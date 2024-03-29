import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';

class SuccessfulRegisterScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container1}>
        <View style={styles.container2}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>WhatsThat</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.message}>
              <Text>Successfully created new account!</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                <Text style={styles.redirect}>Return to Login</Text>
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
  message: {
    justifyContent: 'center',
    textAlign: 'center',
    paddingBottom: '20px',

  },
  redirect: {
    justifyContent: 'center',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default SuccessfulRegisterScreen;
