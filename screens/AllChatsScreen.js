import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import AsyncStorage from '@react-native-async-storage/async-storage';

class AllChatsScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            allChatsData: [],
            search: "",
        }
    }

    async getAllChats() {
        try {
            console.log("getting all chats...");
            const response = await fetch("http://localhost:3333/api/1.0.0/chat", {
            method: "GET",
                headers: {
                    "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            })
            if(response.status === 200) {
                let chatsJson = await response.json();
                let sortedJson = chatsJson.sort((a, b) => {
                    if (a.last_message.timestamp && b.last_message.timestamp) {
                      return b.last_message.timestamp - a.last_message.timestamp;
                    } else if (a.last_message.timestamp) {
                      return -1;
                    } else if (b.last_message.timestamp) {
                      return 1;
                    } else {
                      return b.chat_id - a.chat_id;
                    }
                  });
                  this.setState({
                    isLoading: false,
                    allChatsData: sortedJson
                });
            } else if(response.status === 401) {
                this.setState({
                    isLoading: false,
                    allChatsData: "Unauthorised"
                });
            } else {
                this.setState({
                    isLoading: false,
                    allChatsData: "Internal Server Error, try again"
                });
            }
        } catch (error) {
            console.log(error)
        }

    }

    componentDidMount(){
        this.chats = this.props.navigation.addListener("focus", () => {
            console.log("mounted");
            this.getAllChats();
        })
    }

    componentWillUnmount() {
        this.chats();
    }    

    render() {
        if(this.state.isLoading){
            return(
                <View style={styles.container1}>
                    <View style={styles.container2}>
                        <View style={styles.textContainer}>
                            <ActivityIndicator size="large" color="#606C38" />
                        </View>

                    </View>
                </View>
            );
        } else {
            if(this.state.allChatsData.length === 0) {
                return (
                    <View style={styles.container1}>
                            <View style={styles.container2}>

                            <View style={styles.textContainer}>
                                <Text>No chats yet</Text>
                            </View>
                        </View>
                    </View>
                )
            } else {
                return (
                    <View style={styles.container1}>
                        <View style={styles.container2}>
                            <View style={styles.searchContainer}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search..."
                                    onChangeText={(text) => this.setState({ search: text })}
                                    value={this.state.search}
                                />
                            </View>
                            <FlatList
                                data={this.state.allChatsData}
                                keyExtractor={(item) => item.chat_id.toString()}
                                renderItem={({ item }) => {
                                    if (this.state.search && (!(item.name && item.name.toLowerCase().includes(this.state.search.toLowerCase())) && (!(item.last_message && item.last_message.message && item.last_message.message.toLowerCase().includes(this.state.search.toLowerCase()))))) {
                                        return null;
                                    }
                                    return (
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.props.navigation.navigate("ChatScreen", {
                                                    chat_id: item.chat_id,
                                                    chat_name: item.name,
                                                })
                                            }
                                        >
                                        <View style={styles.chatContainer}>
                                            <Text style={styles.chatName}>
                                                {item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name}
                                            </Text>
                                            <Text style={styles.chatLastMessage}>
                                                {item.last_message && item.last_message.message
                                                    ? item.last_message.message.length > 92
                                                        ? item.last_message.message.substring(0, 92) + "..."
                                                        : item.last_message.message
                                                    : "<No messages sent yet>"}
                                            </Text>
                                            <Text style={styles.chatTimestamp}>
                                            {item.last_message.timestamp
                                                ? new Date(item.last_message.timestamp).toLocaleString('en-GB', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                                : ''}
                                            </Text>
                                        </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                            <TouchableOpacity
                                style={styles.createChatButton}
                                onPress={() => this.props.navigation.navigate('CreateNewChatScreen')}
                            >
                            <MaterialCommunityIcons name="message-plus" size={28} color="#fff" />
                            </TouchableOpacity>

                        </View>
                    </View>
                )
            }
        }
    }
}

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        backgroundColor: '#FEFAE0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container2: {
        flex: 1,
        width: "90%",
        alignItems: "stretch",
        justifyContent: "center",
        //border: "1px solid black"
    },
    searchContainer: {
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        marginHorizontal: 16,
        marginVertical: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
      },
      searchInput: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
      },  
    textContainer: {
        flex: 1,
        //border: "1px solid blue",
        justifyContent: "center",
        textAlign: "center"
    },
    createChatButton: {
        position: 'absolute',
        bottom: 25,
        right: 5,
        zIndex: 1,
        padding: 10,
        backgroundColor: "#606C38",
        borderRadius: 50,
    },
    chatContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    chatName: {
        flex: 2,
        //border: "1px solid red",
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: "center",
    },
    chatLastMessage: {
        flex: 6,
        //border: "1px solid red",
        paddingLeft: 5,
        color: '#888',
        fontSize: 14,
        textAlign: "center",
    },
    chatTimestamp: {
        flex: 2,
        //border: "1px solid red",
        color: '#888',
        paddingLeft: 5,
        fontSize: 12,
        textAlign: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#888',
        fontSize: 18,
        textAlign: 'center',
        marginHorizontal: 32,
    },
});


export default AllChatsScreen; 