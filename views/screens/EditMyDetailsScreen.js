import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIcon from '../components/loadingIcon';

class EditMyDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      originalData: {},
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: '',
      submitted: false,
    };
    this.onPressUpdateButton = this.onPressUpdateButton.bind(this);
  }

  componentDidMount() {
    const { route } = this.props;
    const { originalData } = route.params;

    this.setState({
      originalData,
      firstName: originalData.first_name,
      lastName: originalData.last_name,
      email: originalData.email,
    });
  }

  async onPressUpdateButton() {
    this.setState({
      isLoading: true,
      submitted: true,
    });
    try {
      console.log('updating user details...');
      const data = {};
      if (this.state.firstName !== this.state.originalData.first_name) {
        data.first_name = this.state.firstName;
      }
      if (this.state.lastName !== this.state.originalData.last_name) {
        data.last_name = this.state.lastName;
      }
      if (this.state.email !== this.state.originalData.email) {
        data.email = this.state.email;
      }
      if (this.state.password !== '') {
        data.password = this.state.password;
      }
      const tokenID = await AsyncStorage.getItem('whatsthat_user_id');
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${tokenID}`, {
        method: 'PATCH',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        this.setState({
          isLoading: false,
          submitted: false,
        });
        this.props.navigation.navigate('HomeTabNav', { screen: 'MyAccountScreen' });
      } else if (response.status === 400) {
        this.setState({
          isLoading: false,
          submitted: false,
          error: 'Bad Request',
        });
      } else if (response.status === 401) {
        this.setState({
          isLoading: false,
          submitted: false,
          error: 'Unauthorised',
        });
      } else if (response.status === 404) {
        this.setState({
          isLoading: false,
          submitted: false,
          error: 'Not Found',
        });
      } else {
        this.setState({
          isLoading: false,
          submitted: false,
          error: 'Internal Server Error, try again',
        });
      }
    } catch (error) {
      console.log(error);
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
          <View style={styles.formContainer}>
            <View style={styles.firstName}>
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                onChangeText={(firstName) => this.setState({ firstName })}
                value={this.state.firstName}
              />
            </View>
            <>
              {this.state.submitted && !this.state.firstName
               && <Text style={styles.error}>*First name is required</Text>}
            </>
            <View style={styles.lastName}>
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                onChangeText={(lastName) => this.setState({ lastName })}
                value={this.state.lastName}
              />
            </View>
            <>
              {this.state.submitted && !this.state.lastName
               && <Text style={styles.error}>*Last name is required</Text>}
            </>
            <View style={styles.email}>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
              />
            </View>
            <>
              {this.state.submitted && !this.state.email
               && <Text style={styles.error}>*Email is required</Text>}
            </>
            <View style={styles.password}>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
                secureTextEntry
              />
            </View>
            <>
              {this.state.submitted && !this.state.password
               && <Text style={styles.error}>*Password is required</Text>}
            </>
            <View style={styles.registerBtn}>
              <TouchableOpacity onPress={this.onPressUpdateButton}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>
                    <MaterialCommunityIcons name="pencil" size={20} color="white" />
                    {' '}
                    Edit Details
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <>
              {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}
            </>
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
  registerBtn: {
    left: '20%',
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
  },
});

export default EditMyDetailsScreen;
