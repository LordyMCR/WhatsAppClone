import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditChatMessageScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            originalData: {},
            chat_id : "",
            chat_name: "",
            message_id: "",
            message: "",
            error: "", 
            submitted: false

        }

        this._onPressUpdateButton = this._onPressUpdateButton.bind(this);

    }

    async _onPressUpdateButton() {
        this.setState({
            isLoading: true
        });
        try {
            console.log("updating user details...");
            let data = {};

            if(this.state.message !== this.state.originalData.message){
                data["message"] = this.state.message;
            }

            const response = await fetch("http://localhost:3333/api/1.0.0/chat/"+this.state.chat_id+"/message/"+this.state.message_id, {
                method: "PATCH",
                    headers: {
                        "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token"),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
            })

            if(response.status === 200) {
                this.setState({
                    isLoading: false,
                });
                this.props.navigation.navigate("ChatScreen", {chat_id: this.state.chat_id, chat_name: this.state.chat_name});

            } else if(response.status === 400) {
                this.setState({
                    isLoading: false,
                    error: "Bad Request"
                });
            } else if(response.status === 401) {
                this.setState({
                    isLoading: false,
                    error: "Unauthorised"
                });
            } else if(response.status === 403) {
                this.setState({
                    isLoading: false,
                    error: "Forbidden"
                });
            } else if(response.status === 404) {
                this.setState({
                    isLoading: false,
                    error: "Not Found"
                });
            } else {
                this.setState({
                    isLoading: false,
                    error: "Internal Server Error, try again"
                });
            }
        } catch (error) {
            console.log(error)
        }
                    
    }

    componentDidMount(){
        const { route } = this.props;
        const { chat_id, chat_name, message, message_id } = route.params;

        this.setState({
            chat_id: chat_id,
            chat_name: chat_name,
            message: message.message,
            message_id: message_id
        })
    }
  
    render(){
        if(this.state.isLoading){
            return(
                <View style={styles.container1}>
                    <View style={styles.container2}>
                        <View style={styles.formContainer}>
                            <ActivityIndicator size="large" color="#606C38" />
                        </View>

                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.container1}>
                <View style={styles.container2}>

                        <View style={styles.formContainer}>
                            <View style={styles.message}>
                                <TextInput
                                    style={{borderWidth: 1, width: "100%", backgroundColor: "#fff"}}
                                    placeholder="Enter your message"
                                    onChangeText={message => this.setState({message})}
                                    value={this.state.message}
                                    multiline={true}
                                    numberOfLines={4}
                                />
                            </View>
                    
                            <View style={styles.submitBtn}>
                                <TouchableOpacity onPress={this._onPressUpdateButton}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>Edit Message</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <>
                                {this.state.error &&
                                    <Text style={styles.error}>{this.state.error}</Text>
                                }
                            </>

                        </View>
                </View>
                </View>
            )
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
    message: {
        marginBottom: 10
    },

    submitBtn: {
  
    },
    button: {
      marginBottom: 10,
      backgroundColor: "#606C38",
      border: "1px solid black"
    },
    buttonText: {
      textAlign: "center",
      padding: 20,
      color: "white"
    },
    error: {
        color: "red",
        fontWeight: "900"
    }
  });


export default EditChatMessageScreen;
