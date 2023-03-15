import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

class BlockedContactsScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            allContactsData: []
        }
    }
    
    async getAllContacts() {
        try {
            console.log("getting blocked contacts...");
            const response = await fetch("http://localhost:3333/api/1.0.0/blocked", {
            method: "GET",
                headers: {
                    "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            })
            if(response.status === 200) {
                let contactsJson = await response.json();
                this.setState({
                    isLoading: false,
                    allContactsData: contactsJson
                });
            } else if(response.status === 401) {
                this.setState({
                    isLoading: false,
                    allContactsData: "Unauthorised"
                });
            } else {
                this.setState({
                    isLoading: false,
                    allContactsData: "Internal Server Error, try again"
                });
            }
        } catch (error) {
            console.log(error)
        }

    }

    componentDidMount(){
        this.contacts = this.props.navigation.addListener("focus", () => {
            console.log("mounted");
            this.getAllContacts();
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
            if(this.state.allContactsData.length === 0) {
                return (
                    <View style={styles.container1}>
                            <View style={styles.container2}>

                            <View style={styles.textContainer}>
                                <Text>No blocked contacts</Text>
                            </View>
                        </View>
                    </View>
                )
            } else {
                return (
                    <View style={styles.container1}>
                        <View style={styles.container2}>
                            <FlatList
                                data={this.state.allContactsData}
                                keyExtractor={(item) => item.user_id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                    onPress={() =>
                                        this.props.navigation.navigate("ContactScreen", {
                                            user_id: item.user_id,
                                            first_name: item.first_name,
                                            last_name: item.last_name
                                        })
                                    }
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

export default BlockedContactsScreen; 