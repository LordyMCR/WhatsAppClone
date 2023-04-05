import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, Alert, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

class ChatScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            chatData: [],
            chat_name: '',
            userStorageID: '',
            newMessage: ''
        }

        this._sendNewMessage = this._sendNewMessage.bind(this)

    }

    async setStorageID() {
        const id = await AsyncStorage.getItem("whatsthat_user_id");

        this.setState({
            userStorageID: parseInt(id)
        });
    }

    async getChat() {
        const { route } = this.props;
        const { chat_id, chat_name } = route.params;
        this.setState ({
            chat_name: chat_name
        });
        try {
        const response = await fetch("http://localhost:3333/api/1.0.0/chat/"+chat_id, {
            method: "GET",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            }
        });
        if (response.status === 200) {
            let chatJson = await response.json();
            this.setState({
                isLoading: false,
                chatData: chatJson,
            });
            this.props.navigation.setOptions({
                title: chatJson.name
            });
        } else if(response.status === 401) {
            this.setState({
                isLoading: false,
                chatData: "Unauthorised"
            });
        } else if(response.status === 404) {
            this.setState({
                isLoading: false,
                chatData: "Not Found"
            });
        
        } else {
            this.setState({
                isLoading: false,
                chatData: "Internal Server Error, try again"
            });
        }
        } catch (error) {
            console.log(error);
        }

    }

    async _sendNewMessage() {
                
        if(this.state.newMessage.length !== 0) {
            const { route } = this.props;
            const { chat_id } = route.params;

            this.setState({
                isLoading: true
            });
            
            let toSend = {
                message: this.state.newMessage
            };
            try {
                const response = await fetch("http://localhost:3333/api/1.0.0/chat/"+chat_id+"/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                },
                body: JSON.stringify(toSend)
            });
            if (response.status === 200) {
                this.setState({
                    isLoading: false,
                    newMessage: ''
                });
                this.getChat();
            } else if(response.status === 400) {
                this.setState({
                    isLoading: false,
                });
            } else if(response.status === 401) {
                this.setState({
                    isLoading: false,
                });
            } else if(response.status === 404) {
                this.setState({
                    isLoading: false,
                });
            
            } else {
                this.setState({
                    isLoading: false,
                    chatData: "Internal Server Error, try again"
                });
            } 
            } catch (error) {
                console.log(error);
            }
        }
    }

    async handleDeleteMessage(item) {
        const { route } = this.props;
        const { chat_id } = route.params;

        this.setState({
            isLoading: true
        });

        try {
            const response = await fetch("http://localhost:3333/api/1.0.0/chat/"+chat_id+"/message/"+item.message_id, {
                method: "DELETE",
                headers: {
                    "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            });
            if (response.status === 200) {
                this.setState({
                    isLoading: false,
                });
                this.getChat();
            } else if(response.status === 401) {
                this.setState({
                    isLoading: false,
                });
            } else if(response.status === 404) {
                this.setState({
                    isLoading: false,
                });
            } else {
                this.setState({
                    isLoading: false,
                    chatData: "Internal Server Error, try again"
                });
            } 
            } catch (error) {
                console.log(error);
            }
        } 
       

    componentDidMount(){
        this.chat = this.props.navigation.addListener("focus", () => {
            console.log("mounted");
            this.getChat();
            this.setStorageID();
        })
    }

    componentWillUnmount() {
        this.chat();
    } 

    render(){   
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
            return (
            <><View style={styles.container1}>
                    <View style={styles.container2}>
                        <FlatList
                        inverted
                        data={this.state.chatData.messages ? this.state.chatData.messages.sort((a, b) => b.timestamp - a.timestamp) : []}
                        keyExtractor={(item) => item.message_id.toString()}
                            renderItem={({ item }) => (   
                                <View View style={item.author.user_id === this.state.userStorageID ? styles.wholeWrapper : styles.wholeWrapperLeft}>
                                    {item.author.user_id === this.state.userStorageID && (
                                    <View style={styles.iconWrapper}>
                                        <TouchableOpacity style={styles.iconContainer} onPress={() => this.props.navigation.navigate('EditChatMessageScreen', { message: item, message_id: item.message_id, chat_id: this.props.route.params.chat_id, chat_name: this.props.route.params.chat_name })}>
                                        <MaterialCommunityIcons name="pencil" size={20} color="black" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.iconContainer} onPress={() => this.handleDeleteMessage(item)}>
                                        <MaterialCommunityIcons name="trash-can" size={20} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    )}
                                    <View style={item.author.user_id === this.state.userStorageID ? styles.chatContainer : styles.chatContainerLeft}>
                                        <Text style={styles.chatAuthor}>{item.author.first_name} {item.author.last_name}</Text>
                                        <Text style={styles.chatMessage}>{item.message}</Text>
                                        <Text style={styles.chatTimestamp}>
                                            {new Date(item.timestamp).toLocaleString('en-GB', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </Text>
                                    </View>
                                </View>
                            )} />

                    </View>
                </View>
                <View style={styles.test}>
                        <TextInput
                            style={{ height: 50, borderWidth: 1, width: "80%", backgroundColor: "#fff", padding: '5px', paddingLeft: "10px", paddingRight: "10px", borderRadius: "15px" }}
                            placeholder="Message..."
                            onChangeText={newMessage => this.setState({ newMessage })}
                            value={this.state.newMessage} 
                        />
                        <TouchableOpacity onPress={this._sendNewMessage}>
                            <View style={styles.button}>
                                <MaterialCommunityIcons name="send" size={24} color="white" textAlign="center" />
                            </View>
                        </TouchableOpacity>
                </View></>
            
            )
        }
    }

}



const styles = StyleSheet.create({
    test: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: "5px",
        paddingBottom: "10px",
        backgroundColor: '#FEFAE0',
      },
      textInput: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginRight: 5,
        width: "80%",
        padding: '5px',
        borderRadius: "15px"
      },
      button: {
        backgroundColor: '#DDA15E',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 25,
      },
      buttonIcon: {
        textAlign: 'center',
      },
    container1: {   
        flex: 1,
        backgroundColor: '#FEFAE0',
        alignItems: 'center',
        justifyContent: 'center',
        //border: "1px solid black"
    },
    container2: {
        flex: 1,
        width: "90%",
        paddingTop: "10px",
        paddingBottom: "10px",
        //border: "1px solid black"
    },
    wholeWrapper: {
        display: 'flex',
        flexDirection: 'row',
        left: '22%',
    },
    iconWrapper: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 10,
      },
      iconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        marginRight: '5px',
      },
    chatContainer: {
        padding: '10px',
        marginBottom: '10px',
        width: '60%',
        borderRadius: '10px',
        alignSelf: 'flex-end',
        backgroundColor: '#606C38',
    },
    chatContainerLeft: {
        padding: '10px',
        marginBottom: '10px',
        width: '60%',
        borderRadius: '10px',
        alignSelf: 'flex-start',
        backgroundColor: '#283618',
    },
    chatMessage: {
        fontSize: '16px',
        marginBottom: '5px',
        color: '#fff'
    },      
    chatAuthor: {
        fontSize: '14px',
        marginBottom: '5px',
        color: '#DDA15E',
    },
    chatTimestamp: {
        fontSize: '12px',
        color: '#BC6C25',
    }
  });

  export default ChatScreen;