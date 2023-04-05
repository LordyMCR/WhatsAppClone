import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from "react-native-gesture-handler";


class ChatOptionsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            chat_id: this.props.route.params.chat_id,
            chat_name: '',
            chatData: {},
            name_test: "",
            error: "",
        }
    }

    async getChat() {
        try {
        const response = await fetch("http://localhost:3333/api/1.0.0/chat/"+this.state.chat_id, {
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
                chat_name: chatJson.name
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

    componentDidMount(){
        this.chat = this.props.navigation.addListener("focus", () => {
            console.log("mounted");
            this.getChat();
        })
    }

    componentWillUnmount() {
        this.chat();
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

            return (
                <View style={styles.container}>
                <Text style={styles.title}>{this.state.chat_id}</Text>
                <Text style={styles.title}>{(this.state.chatData.name)}</Text>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("EditChatDetailsScreen", {chat_id: this.state.chat_id, chat_name: this.state.chat_name})}>
                    <Text style={styles.buttonText}>Edit Chat Name</Text>
                </TouchableOpacity>
                <Text>            </Text>
                <Text>            </Text>
                <Text style={styles.title}>Chat Members</Text>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("AddChatMemberScreen", {chat_id: this.state.chat_id, chat_name: this.state.chat_name})}>
                    <Text style={styles.buttonText}>Add Member</Text>
                </TouchableOpacity>
                <Text>            </Text>

                <FlatList 
                    data={this.state.chatData.members}
                    renderItem={({item}) => (
                        <TouchableOpacity style={styles.contactContainer} onPress={() => this.props.navigation.navigate("ContactScreen", {nav: "chatmembers", chat_id: this.state.chat_id, chat_name: this.state.chat_name, user_id: item.user_id, first_name: item.first_name, last_name: item.last_name})}>
                            <View style={styles.contactName}>
                                <Text>{item.first_name} {item.last_name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.user_id.toString()}
                >
                </FlatList>
                
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFAE0",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 25,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
});

export default ChatOptionsScreen;
