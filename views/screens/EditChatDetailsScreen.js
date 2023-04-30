import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIcon from '../components/loadingIcon';

class EditChatMessageScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      originalTitle: '',
      chat_id: '',
      chat_name: '',
      error: '',
    };

    this.onPressUpdateButton = this.onPressUpdateButton.bind(this);
  }

  componentDidMount() {
    const { route } = this.props;
    const { chat_id, chat_name } = route.params;

    this.setState({
      chat_id,
      originalTitle: chat_name,
      chat_name,
    });
  }

  async onPressUpdateButton() {
    if (this.state.chat_name !== '') {
      this.setState({
        isLoading: true,
      });
      try {
        console.log('updating chat details...');
        const data = {};

        if (this.state.chat_name !== this.state.originalTitle) {
          data.name = this.state.chat_name;
        }

        const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${this.state.chat_id}`, {
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
          });
          this.props.navigation.navigate('ChatOptionsScreen', { chat_id: this.state.chat_id, chat_name: this.state.chat_name });
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
        } else if (response.status === 403) {
          this.setState({
            isLoading: false,
            error: 'Forbidden',
          });
        } else if (response.status === 404) {
          this.setState({
            isLoading: false,
            error: 'Not Found',
          });
        } else {
          this.setState({
            isLoading: false,
            error: "Can't enter the same chat name, try again",
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setState({
        error: 'Chat name cannot be empty',
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
              <TouchableOpacity onPress={this.onPressUpdateButton}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>
                    <MaterialCommunityIcons name="pencil" size={20} color="white" />
                    {' '}
                    Change Chat Name
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
    marginBottom: 20,
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

export default EditChatMessageScreen;
