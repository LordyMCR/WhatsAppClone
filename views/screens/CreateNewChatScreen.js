import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIcon from '../components/loadingIcon';

class CreateNewChatScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      chat_name: '',
      error: '',

    };
    this.onPressCreateButton = this.onPressCreateButton.bind(this);
  }

  async onPressCreateButton() {
    if (this.state.chat_name !== '') {
      this.setState({
        isLoading: true,
      });
      const data = { name: this.state.chat_name };
      try {
        const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
          method: 'POST',
          headers: {
            'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.status === 201) {
          this.setState({
            isLoading: false,
          });
          const responseData = await response.json();
          const { chat_id } = responseData;
          this.props.navigation.navigate('ChatScreen', { chat_id });
        } else if (response.status === 400) {
          this.setState({
            isLoading: false,
            error: 'Bad Request',
          });
        } else if (response.status === 401) {
          this.setState({
            isLoading: false,
            error: 'Unauthorised',
          });
        } else {
          this.setState({
            isLoading: false,
            error: 'Internal Server Error, try again',
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setState({
        error: "Can't create a new chat with a blank name",
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
          <View style={styles.formContainer}>
            <View style={styles.message}>
              <TextInput
                style={styles.text}
                placeholder="Enter chat name"
                onChangeText={(chat_name) => this.setState({ chat_name })}
                value={this.state.chat_name}
                multiline
                numberOfLines={4}
              />
            </View>
            <View style={styles.submitBtn}>
              <TouchableOpacity onPress={this.onPressCreateButton}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>
                    <MaterialCommunityIcons name="plus" size={20} color="white" />
                    {' '}
                    Create New Chat
                  </Text>
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
  message: {
    marginBottom: 10,
  },
  text: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginRight: 5,
    width: '100%',
    padding: '5px',
    borderRadius: '15px',
  },
  submitBtn: {
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  button: {
    marginBottom: 10,
    backgroundColor: '#606C38',
    border: '1px solid black',
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

export default CreateNewChatScreen;
