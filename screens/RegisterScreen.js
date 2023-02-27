import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

import * as EmailValidator from 'email-validator';

class RegisterScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            registrationData: [],
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            error: "", 
            submitted: false
        }

        this._onPressRegisterButton = this._onPressRegisterButton.bind(this)
    }

    _onPressRegisterButton(){
        this.setState({isLoading: true})
        this.setState({submitted: true})
        const NAME_REGEX = new RegExp("^[A-Za-z]+(((\'|\-|\.)?([A-Za-z])+))?$");
        const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")

        if(!(this.state.firstName && this.state.lastName && this.state.email && this.state.password)){
            this.setState({isLoading: false})
            this.setState({error: "Must enter first name, last name, email, password and confirm password"})
            return;
        } else if(!NAME_REGEX.test(this.state.firstName)){
            this.setState({isLoading: false})
            this.setState({error: "First name must only contain upper or lower case letters, and ' special character"})
            return;
        } else if(!NAME_REGEX.test(this.state.lastName)){
            this.setState({isLoading: false})
            this.setState({error: "Last name must only contain upper or lower case letters, and ' special character"})
            return;
        } else if(!EmailValidator.validate(this.state.email)){
            this.setState({isLoading: false})
            this.setState({error: "Must enter valid email"})
            return;
        } else if(!PASSWORD_REGEX.test(this.state.password)){
            this.setState({isLoading: false})
            this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
            return;
        } else if((this.state.password) != (this.state.confirmPassword)){
            this.setState({isLoading: false})
            this.setState({error: "Passwords do not match "})
            return;
        } else {
            console.log("Button clicked: " + this.state.firstName + " " + this.state.lastName + " " + this.state.email + " " + this.state.password + " " + this.state.confirmPassword)
            console.log("Validated and ready to send to the API")
            // API call
            let toSend = {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                email: this.state.email,
                password: this.state.password
            };

            return fetch("http://localhost:3333/api/1.0.0/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(toSend)
            })
            .then((response) => {
                this.setState({isLoading: false})
                this.props.navigation.navigate('SuccessfullyRegistered')
            })
            .catch((error) => {
                console.log(error);
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
            return (
                <View style={styles.container1}>
                <View style={styles.container2}>

                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>WhatsThat</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <View style={styles.firstName}>
                                <TextInput
                                    style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "#fff"}}
                                    placeholder="Enter first name"
                                    onChangeText={firstName => this.setState({firstName})}
                                    value={this.state.firstName}
                                />

                                <>
                                    {this.state.submitted && !this.state.firstName &&
                                        <Text style={styles.error}>*First name is required</Text>
                                    }
                                </>
                            </View>

                            <View style={styles.lastName}>
                                <TextInput
                                    style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "#fff"}}
                                    placeholder="Enter last name"
                                    onChangeText={lastName => this.setState({lastName})}
                                    value={this.state.lastName}
                                />

                                <>
                                    {this.state.submitted && !this.state.lastName &&
                                        <Text style={styles.error}>*Last name is required</Text>
                                    }
                                </>
                            </View>
                            
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

                            <View style={styles.confirmPassword}>
                                <TextInput
                                    style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "#fff"}}
                                    placeholder="Confirm password"
                                    onChangeText={confirmPassword => this.setState({confirmPassword})}
                                    value={this.state.confirmPassword}
                                    secureTextEntry
                                />

                                <>
                                    {this.state.submitted && !this.state.confirmPassword &&
                                        <Text style={styles.error}>*Confirm password is required</Text>
                                    }
                                </>
                            </View>
                    
                            <View style={styles.registerBtn}>
                                <TouchableOpacity onPress={this._onPressRegisterButton}>
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
        paddingTop: "50px"
    },
    formContainer: {
        flex: 5,
        //border: "1px solid red"
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

  export default RegisterScreen;
