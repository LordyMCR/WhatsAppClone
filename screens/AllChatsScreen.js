import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

class AllChatsScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            allChatsData: []
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
                this.setState({
                    isLoading: false,
                    allChatsData: chatsJson
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
                            <FlatList
                                data={this.state.allChatsData}
                                keyExtractor={(item) => item.chat_id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                    onPress={() =>
                                        this.props.navigation.navigate("ChatScreen", {
                                        chat_id: item.chat_id,
                                        chat_name: item.name,
                                        })
                                    }
                                    >
                                    <View style={styles.chatContainer}>
                                        <Text style={styles.chatName}>{item.name}</Text>
                                        <Text style={styles.chatLastMessage}>
                                        {item.last_message.message}
                                        </Text>
                                        <Text style={styles.chatTimestamp}>
                                        {new Date(item.last_message.timestamp).toLocaleString('en-GB', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                        </Text>
                                    </View>
                                    </TouchableOpacity>
                                )}
                            />
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
      width: "80%",
      alignItems: "stretch",
      justifyContent: "center",

      //border: "1px solid black"
    },
    textContainer: {
        flex: 1,
        //border: "1px solid blue",
        justifyContent: "center",
        textAlign: "center"
    },
    chatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      },
      avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
      },
      chatInfo: {
        flex: 1,
        justifyContent: 'center',
      },
      chatName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
      },
      chatLastMessage: {
        paddingLeft: 10,
        color: '#888',
        fontSize: 14,
      },
      chatTimestamp: {
        color: '#888',
        fontSize: 12,
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