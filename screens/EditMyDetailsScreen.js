import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditMyDetailsScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            originalData: {},
            firstName: "",
            lastName: "",
            email: "",
            password: "",
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

            if(this.state.firstName !== this.state.originalData.first_name){
                data["first_name"] = this.state.firstName;
            }

            if(this.state.lastName !== this.state.originalData.last_name){
                data["last_name"] = this.state.lastName;
            }

            if(this.state.email !== this.state.originalData.email){
                data["email"] = this.state.email;
            }

            if(this.state.password !== ""){
                data["password"] = this.state.password;
            }

            const tokenID = await AsyncStorage.getItem("whatsthat_user_id");
            const response = await fetch("http://localhost:3333/api/1.0.0/user/"+tokenID, {
                method: "PATCH",
                    headers: {
                        "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token"),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
            })
            console.log(data);

            if(response.status === 200) {
                this.setState({
                    isLoading: false,
                });
                this.props.navigation.navigate('HomeTabNav', { screen: 'MyAccountScreen' });

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
        const { originalData } = route.params; 

        this.setState({
            originalData: originalData,
            firstName: originalData.first_name,
            lastName: originalData.last_name,   
            email: originalData.email
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
                            <View style={styles.firstName}>
                                <TextInput
                                    style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "#fff"}}
                                    placeholder="Enter first name"
                                    onChangeText={firstName => this.setState({firstName})}
                                    value={this.state.firstName}
                                />
                            </View>

                            <View style={styles.lastName}>
                                <TextInput
                                    style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "#fff"}}
                                    placeholder="Enter last name"
                                    onChangeText={lastName => this.setState({lastName})}
                                    value={this.state.lastName}
                                />
                            </View>
                            
                            <View style={styles.email}>
                                <TextInput
                                    style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "#fff"}}
                                    placeholder="Enter email"
                                    onChangeText={email => this.setState({email})}
                                    value={this.state.email}
                                />
                            </View>
                    
                            <View style={styles.password}>
                                <TextInput
                                    style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "#fff"}}
                                    placeholder="Enter password"
                                    onChangeText={password => this.setState({password})}
                                    value={this.state.password}
                                    secureTextEntry
                                />
                            </View>
                    
                            <View style={styles.registerBtn}>
                                <TouchableOpacity onPress={this._onPressUpdateButton}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>Register</Text>
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
    firstName: {
        marginBottom: 10
    },
    lastName: {
        marginBottom: 10
    },
    email: {
      marginBottom: 10
    },
    password: {
      marginBottom: 10
    },
    confirmPassword: {
        marginBottom: 10
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
    registerBtn: {
  
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


export default EditMyDetailsScreen;
