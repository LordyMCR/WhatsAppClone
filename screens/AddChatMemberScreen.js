import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

class AddChatMemberScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            myContactsData: [],
            error: ""
        }

    }
    
    async getMyContacts() {
        try {
            console.log("getting my contacts...");
            const response = await fetch("http://localhost:3333/api/1.0.0/contacts", {
            method: "GET",
                headers: {
                    "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            })
            if(response.status === 200) {
                let contactsJson = await response.json();
                let sortedJson = contactsJson.sort((a, b) => a.first_name.localeCompare(b.first_name));
                this.setState({
                    isLoading: false,
                    myContactsData: sortedJson
                });
            } else if(response.status === 401) {
                this.setState({
                    isLoading: false,
                    myContactsData: "Unauthorised"
                });
            } else {
                this.setState({
                    isLoading: false,
                    myContactsData: "Internal Server Error, try again"
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    async addContactToChat(contactId) {
        const { route } = this.props;
        const { chat_id, chat_name } = route.params;

        try {
            const response = await fetch("http://localhost:3333/api/1.0.0/chat/" + chat_id + "/user/" + contactId, {
                method: "POST",
                headers: {
                    "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            })
            if (response.status === 200) {
                this.props.navigation.navigate("ChatOptionsScreen", {chat_id: chat_id, chat_name: chat_name});
            } else if(response.status === 400) {
                console.log("Bad Request");
            } else if(response.status === 401) {
                console.log("Unauthorised");
            } else if(response.status === 403) {
                console.log("Forbidden");
            } else if(response.status === 404) {
                console.log("Not found");
            } else {
                console.log("Internal server error, try again")
            }
        } catch (error) {
            console.log(error);
        }  

    }

    componentDidMount(){
        this.contacts = this.props.navigation.addListener("focus", () => {
            console.log("mounted");
            this.getMyContacts();
        })
    }

    componentWillUnmount() {
        this.contacts();
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
            if(this.state.myContactsData.length === 0) {
                return (
                    <View style={styles.container1}>
                            <View style={styles.container2}>

                            <View style={styles.textContainer}>
                                <Text>No contacts yet</Text>
                            </View>
                        </View>
                    </View>
                )
            } else {
                return (
                    <View style={styles.container1}>
                        <View style={styles.container2}>
                            <FlatList
                                data={this.state.myContactsData}
                                keyExtractor={(item) => item.user_id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                    onPress={() => this.addContactToChat(item.user_id)}
                                    >
                                    <View style={styles.contactContainer}>
                                        <Text style={styles.contactName}>{item.first_name} {item.last_name}</Text>
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


    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      },
      avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
      },
      contactName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
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

export default AddChatMemberScreen; 