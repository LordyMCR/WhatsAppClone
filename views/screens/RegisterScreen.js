import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import * as EmailValidator from 'email-validator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingIcon from '../components/loadingIcon';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
      submitted: false,
      hidePassword: true,
      hidePasswordConfirm: true,
    };

    this.onPressRegisterButton = this.onPressRegisterButton.bind(this);
  }

  onPressRegisterButton() {
    this.setState({ isLoading: true });
    this.setState({ submitted: true });
    const NAME_REGEX = /^[A-Za-z]+((('|-|.)?([A-Za-z])+))?$/;
    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (!(this.state.firstName && this.state.lastName && this.state.email && this.state.password)) {
      this.setState({ isLoading: false });
      this.setState({ error: 'Must enter first name, last name, email, password and confirm password' });
    } else if (!NAME_REGEX.test(this.state.firstName)) {
      this.setState({ isLoading: false });
      this.setState({ error: "First name must only contain upper or lower case letters, and ' special character" });
    } else if (!NAME_REGEX.test(this.state.lastName)) {
      this.setState({ isLoading: false });
      this.setState({ error: "Last name must only contain upper or lower case letters, and ' special character" });
    } else if (!EmailValidator.validate(this.state.email)) {
      this.setState({ isLoading: false });
      this.setState({ error: 'Must enter valid email' });
    } else if (!PASSWORD_REGEX.test(this.state.password)) {
      this.setState({ isLoading: false });
      this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
    } else if ((this.state.password) !== (this.state.confirmPassword)) {
      this.setState({ isLoading: false });
      this.setState({ error: 'Passwords do not match ' });
    } else {
      console.log('Validated and ready to send to the API');
      // API call
      const toSend = {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
      };

      return fetch('http://localhost:3333/api/1.0.0/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toSend),
      })
        .then((response) => {
          this.setState({ isLoading: false });
          this.setState({ submitted: false });
          if (response.status === 201) {
            return response.json();
          } if (response.status === 400) {
            throw "Email already exists or password isn't strong enough";
          } else {
            throw 'Something went wrong, try again';
          }
        })
        .then(() => {
          this.props.navigation.navigate('SuccessfullyRegistered');
        })
        .catch((error) => {
          this.setState({ error });
          this.setState({ submitted: false });
        });
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <LoadingIcon />
      );
    }
    return (
      <View style={styles.container1}>
        <View style={styles.container2}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>WhatsThat</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.firstName}>
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                onChangeText={(firstName) => this.setState({ firstName })}
                value={this.state.firstName}
              />
              <>
                {this.state.submitted && !this.state.firstName
                 && <Text style={styles.error}>*First name is required</Text>}
              </>
            </View>
            <View style={styles.lastName}>
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                onChangeText={(lastName) => this.setState({ lastName })}
                value={this.state.lastName}
              />
              <>
                {this.state.submitted && !this.state.lastName
                && <Text style={styles.error}>*Last name is required</Text>}
              </>
            </View>
            <View style={styles.email}>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
              />
              <>
                {this.state.submitted && !this.state.email
                && <Text style={styles.error}>*Email is required</Text>}
              </>
            </View>
            <View style={styles.password}>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
                secureTextEntry={this.state.hidePassword}
              />
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={this.state.hidePassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="black"
                  onPress={() => this.setState({ hidePassword: !this.state.hidePassword })}
                />
              </View>
              <>
                {this.state.submitted && !this.state.password
                && <Text style={styles.error}>*Password is required</Text>}
              </>
            </View>
            <View style={styles.confirmPassword}>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                value={this.state.confirmPassword}
                secureTextEntry={this.state.hidePasswordConfirm}
              />
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={this.state.hidePasswordConfirm ? 'eye' : 'eye-off'}
                  size={20}
                  color="black"
                  onPress={() => this.setState({
                    hidePasswordConfirm: !this.state.hidePasswordConfirm,
                  })}
                />
              </View>

              <>
                {this.state.submitted && !this.state.confirmPassword
                 && <Text style={styles.error}>*Confirm password is required</Text>}
              </>
            </View>
            <View style={styles.registerBtn}>
              <TouchableOpacity onPress={this.onPressRegisterButton}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Register</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.error}>{this.state.error}</Text>
          </View>
        </View>
      </View>
    );
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
    width: '80%',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    textAlign: 'center',
  },
  logoText: {
    fontSize: '3em',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    paddingTop: '50px',
    color: '#BC6C25',
  },
  formContainer: {
    flex: 5,
  },
  firstName: {
    marginBottom: 10,
  },
  lastName: {
    marginBottom: 10,
  },
  email: {
    marginBottom: 10,
  },
  password: {
    marginBottom: 10,
  },
  iconContainer: {
    position: 'absolute',
    top: 15,
    right: 10,
  },
  confirmPassword: {
    marginBottom: 20,
  },
  registerBtn: {
    left: '20%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginRight: 5,
    width: '100%',
    padding: '5px',
    borderRadius: '15px',
  },
  button: {
    marginBottom: 10,
    backgroundColor: '#606C38',
    border: '1px solid black',
    width: '60%',
  },
  buttonText: {
    textAlign: 'center',
    padding: 10,
    color: 'white',
  },
  error: {
    color: 'red',
    fontWeight: '900',
    textAlign: 'center',
  },
});

export default RegisterScreen;
