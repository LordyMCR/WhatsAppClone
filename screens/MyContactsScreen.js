import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, TextInput } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

class MyContactsScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            myContactsData: [],
            search: "",
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
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search..."
                                onChangeText={(text) => this.setState({ search: text })}
                                value={this.state.search}
                            />
                        </View>
                            <FlatList
                                data={this.state.myContactsData}
                                keyExtractor={(item) => item.user_id.toString()}
                                renderItem={({ item }) => {
                                    if (this.state.search && !(item.first_name.toLowerCase().includes(this.state.search.toLowerCase()) || item.last_name.toLowerCase().includes(this.state.search.toLowerCase()))) {
                                        return null;
                                    }
                                    return (
                                      <View style={styles.contactsRow}>
                                        <TouchableOpacity
                                          style={styles.contactTouchable}
                                          onPress={() => this.props.navigation.navigate("ContactScreen", {
                                              nav: "mycontacts",
                                              user_id: item.user_id,
                                              first_name: item.first_name,
                                              last_name: item.last_name
                                          })}
                                        >
                                          <View style={styles.contactContainer}>
                                            <Text style={styles.contactName}>{item.first_name} {item.last_name}</Text>
                                          </View>
                                        </TouchableOpacity>
                                      </View>
                                    );
                                  }}
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
    contactsRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    contactTouchable: {
        flex: 12,
    },
    contactContainer: {
        paddingVertical: 12,
    },
    contactName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    });

export default MyContactsScreen; 