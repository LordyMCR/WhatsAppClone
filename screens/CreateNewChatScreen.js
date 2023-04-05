import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class CreateNewChatScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            chat_name: "",
            error: "", 
            submitted: false

        }
        this._onPressCreateButton = this._onPressCreateButton.bind(this);
    }

    async _onPressCreateButton() {
        this.setState({
            isLoading: true
        });
        let data = {"name": this.state.chat_name};
        try {
            const response = await fetch("http://localhost:3333/api/1.0.0/chat", {
                method: "POST",
                    headers: {
                        "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token"),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
            })

            if(response.status === 201) {
                this.setState({
                    isLoading: false,
                });
                const responseData = await response.json();
                let chat_id = responseData.chat_id;
                this.props.navigation.navigate("ChatScreen", {chat_id: chat_id});

                // MAYBE ADD OTHER OPTIONS IN THE VIEW
                // LET THEM HAVE OPTION TO ADD PEOPLE TO THE CHAT IN THE CREATE SCREEN
                // AND/OR SEND AN INITIAL MESSAGE
                // MAKE BOTH OF THESE OPTIONAL, AND IF BOTH EMPTY, THEN JUST CREATE THE CHAT
                // IF ONE OR THE OTHER HAS INPUT ENTERED
                // THEN DO CREATE CHAT, AND DO ANOTHER FUNCTION TO
                // ADD PEOPLE AND/OR SEND INITIAL MESSAGE
    
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
                                    placeholder="Enter chat name"
                                    onChangeText={chat_name => this.setState({chat_name})}
                                    value={this.state.chat_name}
                                    multiline={true}
                                    numberOfLines={4}
                                />
                            </View>
                    
                            <View style={styles.submitBtn}>
                                <TouchableOpacity onPress={this._onPressCreateButton}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>Create New Chat</Text>
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


export default CreateNewChatScreen;
