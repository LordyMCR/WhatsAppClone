import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-web';

class AccountNavigator extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            accountData: [],
            accountPhoto: null
        }
    }
    
    async getAccountDetails() {
        try {
            console.log("getting user details...");
            const tokenID = await AsyncStorage.getItem("whatsthat_user_id");
            const response = await fetch("http://localhost:3333/api/1.0.0/user/"+tokenID, {
            method: "GET",
                headers: {
                    "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            })
            if(response.status === 200) {
                let accountJson = await response.json();
                this.setState({
                    isLoading: false,
                    accountData: accountJson
                });
            } else if(response.status === 401) {
                this.setState({
                    isLoading: false,
                    accountData: "Unauthorised"
                });
            } else if(response.status === 404) {
                this.setState({
                    isLoading: false,
                    accountData: "Not Found"
                });
            
            } else {
                this.setState({
                    isLoading: false,
                    accountData: "Internal Server Error, try again"
                });
            }
        } catch (error) {
            console.log(error)
        }

    }

    async getProfilePhoto() {
        try {
            console.log("getting account photo...");
            const tokenID = await AsyncStorage.getItem("whatsthat_user_id");
            const response = await fetch("http://localhost:3333/api/1.0.0/user/"+tokenID+"/photo", {
            method: "GET",
                headers: {
                    "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            })
            if(response.status === 200) {
                let photoResponseBlob = await response.blob();
                let photoResponse = URL.createObjectURL(photoResponseBlob);
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
            console.log(error)
        }
    }

    componentDidMount(){
        this.account = this.props.navigation.addListener("focus", () => {
            console.log("mounted");
            this.getAccountDetails();
            this.getProfilePhoto();
        })
    }

    componentWillUnmount() {
        this.account();
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
            if(this.state.accountData.length === 0) {
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
                            <View>
                                <Image
                                    source={{
                                        uri: this.state.accountPhoto,
                                    }}
                                    style={{ width: 200, height: 200 }}
                                ></Image>
                                <Text>{this.state.accountData.first_name} {this.state.accountData.last_name} {this.state.accountData.email}</Text>
                            </View>
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
        //border: "1px solid black"
    },
    container2: {
        flex: 1,
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        //border: "1px solid black"

      //border: "1px solid black"
    }
  });

  export default AccountNavigator;