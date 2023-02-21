import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import * as EmailValidator from 'email-validator';

export default class LoginScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            error: "", 
            submitted: false
        }

        this._onPressLoginButton = this._onPressLoginButton.bind(this)
    }

    _onPressLoginButton(){
        this.setState({submitted: true})
        this.setState({error: ""})

        if(!(this.state.email && this.state.password)){
            this.setState({error: "Must enter email and password"})
            return;
        }

        if(!EmailValidator.validate(this.state.email)){
            this.setState({error: "Must enter valid email"})
            return;
        }

        const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if(!PASSWORD_REGEX.test(this.state.password)){
            this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
            return;
        }

        console.log("Button clicked: " + this.state.email + " " + this.state.password)
        console.log("Validated and ready to send to the API")

    }

    render(){
        return (
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
                                defaultValue={this.state.email}
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
                                defaultValue={this.state.password}
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
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                                <Text style={styles.signup}>New here? Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </View>
            </View>
        )
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