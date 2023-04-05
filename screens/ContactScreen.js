import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';


class ContactScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            accountPhoto: null
        }

        this.removeContact = this.removeContact.bind(this);
        this.addContact = this.addContact.bind(this);
        this.blockContact = this.blockContact.bind(this);
        this.unblockContact = this.unblockContact.bind(this);
        this.removeChatMember = this.removeChatMember.bind(this);

    }

    async getPhoto() {
        const { route } = this.props;
        const { user_id } = route.params;
        try {
        const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/photo`, {
            method: "GET",
            headers: {
            "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            }
        });
        if (response.status === 200) {
            let photoBlob = await response.blob();
            let photoResponse = URL.createObjectURL(photoBlob);
            this.setState({
                isLoading: false,
                accountPhoto: photoResponse
            });
        } else if(response.status === 401) {
            this.setState({
                isLoading: false,
                accountPhoto: "Unauthorised"
            });
        } else if(response.status === 404) {
            this.setState({
                isLoading: false,
                accountPhoto: "Not Found"
            });
        
        } else {
            this.setState({
                isLoading: false,
                accountPhoto: "Internal Server Error, try again"
            });
        }
        } catch (error) {
        console.log(error);
        }
    }

    async removeContact() {
        const { route } = this.props;
        const { user_id } = route.params;
        try {
            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/contact`, {
                method: "DELETE",
                headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            });
            if (response.status === 200) {
                this.props.navigation.navigate('HomeTabNav', { screen: 'Contacts' });
            } else if(response.status === 400) {
                console.log("Can't remove yourself");
            } else if(response.status === 401) {
                console.log("Unauthorised");
            } else if(response.status === 404) {
                console.log("Not found");
            } else {
                console.log("Internal server error, try again")
            }
            } catch (error) {
            console.log(error);
            }       

    }

    async addContact() {
        const { route } = this.props;
        const { user_id } = route.params;
        try {
            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/contact`, {
                method: "POST",
                headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            });
            if (response.status === 200) {
                this.props.navigation.navigate('HomeTabNav', { screen: 'Contacts' });
            } else if(response.status === 400) {
                console.log("Can't add yourself");
            } else if(response.status === 401) {
                console.log("Unauthorised");
            } else if(response.status === 404) {
                console.log("Not found");
            } else {
                console.log("Internal server error, try again")
            }
            } catch (error) {
            console.log(error);
            }       

    }

    async blockContact() {
        const { route } = this.props;
        const { user_id } = route.params;
        try {
            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/block`, {
                method: "POST",
                headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            });
            if (response.status === 200) {
                this.props.navigation.navigate('HomeTabNav', { screen: 'Contacts' });
            } else if(response.status === 400) {
                console.log("Can't block yourself");
            } else if(response.status === 401) {
                console.log("Unauthorised");
            } else if(response.status === 404) {
                console.log("Not found");
            } else {
                console.log("Internal server error, try again")
            }
        } catch (error) {
            console.log(error);
        }       
    }

    async unblockContact() {
        const { route } = this.props;
        const { user_id } = route.params;
        try {
            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/block`, {
                method: "DELETE",
                headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            });
            if (response.status === 200) {
                this.props.navigation.navigate('HomeTabNav', { screen: 'Contacts' });
            } else if(response.status === 400) {
                console.log("Can't block yourself");
            } else if(response.status === 401) {
                console.log("Unauthorised");
            } else if(response.status === 404) {
                console.log("Not found");
            } else {
                console.log("Internal server error, try again")
            }
        } catch (error) {
            console.log(error);
        }       
    }

    async removeChatMember() {
        const { route } = this.props;
        const { chat_id, chat_name, user_id } = route.params;
        try {
            const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/user/${user_id}`, {
                method: "DELETE",
                headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            });
            if (response.status === 200) {
                this.props.navigation.navigate("ChatOptionsScreen", {chat_id: chat_id, chat_name: chat_name});
            } else if(response.status === 400) {
                console.log("Can't remove yourself");
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
        this.account = this.props.navigation.addListener("focus", () => {
            console.log("mounted");
            this.getPhoto();
        })
    }

    componentWillUnmount() {
        this.account();
    }  

    render(){
        const { route } = this.props;
        const { user_id, first_name, last_name, nav } = route.params;

        let button1, button2;
        
        if (nav === "mycontacts") {
            button1 = (
              <TouchableOpacity style={styles.removeButton} onPress={this.removeContact}>
                <Text color="white" textAlign="center">Remove Contact</Text>
              </TouchableOpacity>
            );
        } else if (nav === "allcontacts") {
        button1 = (
            <TouchableOpacity style={styles.addButton} onPress={this.addContact}>
            <Text color="white" textAlign="center">Add Contact</Text>
            </TouchableOpacity>
        );
        button2 = (
            <TouchableOpacity style={styles.blockButton} onPress={this.blockContact}>
            <Text color="white" textAlign="center">Block Contact</Text>
            </TouchableOpacity>
        );
        } else if (nav === "blockedcontacts") {
        button1 = (
            <TouchableOpacity style={styles.unblockButton} onPress={this.unblockContact}>
            <Text color="white" textAlign="center">Unblock Contact</Text>
            </TouchableOpacity>
        );
        } else if (nav === "chatmembers") {
        button1 = (
            <TouchableOpacity style={styles.removeButton} onPress={this.removeChatMember}>
                <Text color="white" textAlign="center">Remove from Chat</Text>
            </TouchableOpacity>
        );
        }
 
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
                <View style={styles.container1}>
                <View style={styles.container2}>
                    <View>
                        <Image
                            source={{
                                uri: this.state.accountPhoto,
                            }}
                            style={{ width: 200, height: 200 }}
                        ></Image>
                        <Text>User ID: {user_id}</Text>
                        <Text>First Name: {first_name}</Text>
                        <Text>Last Name: {last_name}</Text>
                        {button1}
                        {button2}
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
        alignItems: "center",
        justifyContent: "center",

      //border: "1px solid black"
    },
    removeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 25,
    },
    addButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 25,
    },
    blockButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'orange',
        borderRadius: 25,
    },
    unblockButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'lightgreen',
        borderRadius: 25,
    }
  });

  export default ContactScreen;