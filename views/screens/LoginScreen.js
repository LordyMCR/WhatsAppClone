import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import * as EmailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingIcon from '../components/loadingIcon';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: '',
      password: '',
      error: '',
      submitted: false,
      hidePassword: true,
    };

    this.onPressLoginButton = this.onPressLoginButton.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onPressLoginButton() {
    this.setState({ isLoading: true });
    this.setState({ submitted: true });
    this.setState({ error: '' });
    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (!(this.state.email && this.state.password)) {
      this.setState({ isLoading: false });
      this.setState({ error: 'Must enter email and password' });
    } else if (!EmailValidator.validate(this.state.email)) {
      this.setState({ isLoading: false });
      this.setState({ error: 'Must enter valid email' });
    } else if (!PASSWORD_REGEX.test(this.state.password)) {
      this.setState({ isLoading: false });
      this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
    } else {
      console.log('Validated and ready to send to the API');

      // API
      const toSend = {
        email: this.state.email,
        password: this.state.password,
      };

      return fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toSend),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } if (response.status === 400) {
            this.setState({ isLoading: false });
            throw 'Invalid email/password, try again';
          } else {
            throw 'Something went wrong, try again';
          }
        })
        .then((json) => {
          try {
            AsyncStorage.setItem('whatsthat_user_id', json.id);
            AsyncStorage.setItem('whatsthat_session_token', json.token);
            this.formValidationReset();
            this.props.navigation.navigate('HomeNavigator');
          } catch {
            throw 'Something went wrong';
          }
        })
        .catch((error) => {
          this.setState({ error });
          this.setState({ submitted: false });
        });
    }
  }

  async checkLoggedIn() {
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    if (token !== null) {
      this.props.navigation.navigate('HomeNavigator');
    }
  }

  formValidationReset() {
    this.setState({
      isLoading: false,
      email: '',
      password: '',
      submitted: false,
    });
  }

  registerNavigate() {
    this.formValidationReset();
    this.props.navigation.navigate('Register');
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

            <View style={styles.loginbtn}>
              <TouchableOpacity onPress={this.onPressLoginButton}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Login</Text>
                </View>
              </TouchableOpacity>
            </View>
            <>
              {this.state.error
              && <Text style={styles.error}>{this.state.error}</Text>}
            </>
            <View>
              <TouchableOpacity onPress={() => this.registerNavigate()}>
                <Text style={styles.signup}>New here? Register</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: '100px',
    color: '#BC6C25',
  },
  formContainer: {
    flex: 3,
  },
  email: {
    marginBottom: 10,
  },
  password: {
    marginBottom: 20,
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
  iconContainer: {
    position: 'absolute',
    top: 15,
    right: 10,
  },
  signup: {
    justifyContent: 'center',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  loginbtn: {
    left: '20%',
  },
  button: {
    marginBottom: 20,
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

export default LoginScreen;
