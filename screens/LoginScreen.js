import React, { Component, createRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

import * as EmailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            email: "",
            password: "",
            error: "", 
            submitted: false
        }

        this._onPressLoginButton = this._onPressLoginButton.bind(this)
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            this.checkLoggedIn();
        });
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const token = await AsyncStorage.getItem("whatsthat_session_token");
        if(token !== null) {
            this.props.navigation.navigate("HomeNavigator");
        }
    }

    formValidationReset(){
        this.setState({
            isLoading: false,
            email: "",
            password: "",
            submitted: false
        })
    }

    registerNavigate(){
        this.formValidationReset()
        this.props.navigation.navigate('Register')
    }

    _onPressLoginButton(){
        this.setState({isLoading: true})
        this.setState({submitted: true})
        this.setState({error: ""})
        const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")

        if(!(this.state.email && this.state.password)){
            this.setState({isLoading: false})
            this.setState({error: "Must enter email and password"})
            return;
        } else if(!EmailValidator.validate(this.state.email)){
            this.setState({isLoading: false})
            this.setState({error: "Must enter valid email"})
            return;
        } else if(!PASSWORD_REGEX.test(this.state.password)){
            this.setState({isLoading: false})
            this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
            return;
        } else {
            console.log("Button clicked: " + this.state.email + " " + this.state.password)
            console.log("Validated and ready to send to the API")
            
            //API
            let toSend = {
                email: this.state.email,
                password: this.state.password
            };

            return fetch("http://localhost:3333/api/1.0.0/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(toSend)
            })
            .then((response) => {
                if(response.status === 200) {
                    return response.json();
                } else if(response.status === 400) {
                    this.setState({isLoading: false})
                    throw "Invalid email/password, try again"
                } else {
                    throw "Something went wrong, try again"
                }
            })
            .then((json) => {
                try {
                    AsyncStorage.setItem("whatsthat_user_id", json.id)
                    AsyncStorage.setItem("whatsthat_session_token", json.token)
                    this.formValidationReset()
                    this.props.navigation.navigate('HomeNavigator')
                } catch {
                    throw "Something went wrong"
                }
            })
            .catch((error) => {
                this.setState({error: error})
                this.setState({submitted: false})
            })
        }
    }

    render(){
        if(this.state.isLoading){
            return(
                <View style={styles.container1}>
                    <View style={styles.container2}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>WhatsThat</Text>
                        </View>
                        <View style={styles.formContainer}>
                            <ActivityIndicator size="large" color="#606C38" />
                        </View>

                    </View>
                </View>
            );
        } else {
            return(
                <View style={styles.container1}>
                <View style={styles.container2}>

                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>WhatsThat</Text>
                    </View>

                        <View style={styles.formContainer}>
                            <View style={styles.email}>
                                <TextInput
                                    style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "#fff"}}
                                    placeholder="Enter email"
                                    onChangeText={email => this.setState({email})}
                                    value={this.state.email}
                                />

                                <>
                                    {this.state.submitted && !this.state.email &&
                                        <Text style={styles.error}>*Email is required</Text>
                                    }
                                </>
                            </View>
                    
                            <View style={styles.password}>
                                <TextInput
                                    style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "#fff"}}
                                    placeholder="Enter password"
                                    onChangeText={password => this.setState({password})}
                                    value={this.state.password}
                                    secureTextEntry
                                />

                                <>
                                    {this.state.submitted && !this.state.password &&
                                        <Text style={styles.error}>*Password is required</Text>
                                    }
                                </>
                            </View>
                    
                            <View style={styles.loginbtn}>
                                <TouchableOpacity onPress={this._onPressLoginButton}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>Login</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <>
                                {this.state.error &&
                                    <Text style={styles.error}>{this.state.error}</Text>
                                }
                            </>
                    
                            <View>
                                <TouchableOpacity onPress={() => this.registerNavigate()}>
                                    <Text style={styles.signup}>New here? Register</Text>
                                </TouchableOpacity>
                            </View>
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
    logoContainer: {
        flex: 2,
        //border: "1px solid blue",
        justifyContent: "center",
        textAlign: "center"
    },
    logoText: {
        fontSize: "3em",
        fontWeight: "bold",
        fontFamily: "Helvetica",
        paddingTop: "100px"
    },
    formContainer: {
        flex: 3,
        //border: "1px solid red"
    },
    email:{
      marginBottom: 10
    },
    password:{
      marginBottom: 10
    },
    loginbtn:{
  
    },
    signup:{
      justifyContent: "center",
      textAlign: "center",
      textDecorationLine: "underline",
      //paddingTop: "50px"
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

  export default LoginScreen;