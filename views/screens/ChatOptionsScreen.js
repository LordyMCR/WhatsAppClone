import React, { Component } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIcon from '../components/loadingIcon';
import ContactList from '../components/ContactList';

class ChatOptionsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      chat_id: this.props.route.params.chat_id,
      chat_name: '',
      chatData: {},
      error: '',
    };
  }

  componentDidMount() {
    this.chat = this.props.navigation.addListener('focus', () => {
      console.log('mounted');
      this.getChat();
    });
  }

  componentWillUnmount() {
    this.chat();
  }

  async getChat() {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${this.state.chat_id}`, {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        const chatJson = await response.json();
        const imagePromises = chatJson.members.map(async (contact) => {
          const responseImage = await fetch(`http://localhost:3333/api/1.0.0/user/${contact.user_id}/photo`, {
            method: 'GET',
            headers: {
              'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
            },
          });
          if (responseImage.status === 200) {
            const photoBlob = await responseImage.blob();
            contact.photo = URL.createObjectURL(photoBlob);
          }
        });
        await Promise.all(imagePromises);
        this.setState({
          isLoading: false,
          chatData: chatJson,
          chat_name: chatJson.name,
        });
      } else if (response.status === 401) {
        this.setState({
          isLoading: false,
          chatData: 'Unauthorised',
        });
      } else if (response.status === 404) {
        this.setState({
          isLoading: false,
          chatData: 'Not Found',
        });
      } else {
        this.setState({
          isLoading: false,
          chatData: 'Internal Server Error, try again',
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
      <View style={styles.container}>
        <Text style={styles.error}>{this.state.error}</Text>
        <Text style={styles.title}>{(this.state.chatData.name)}</Text>
        <View style={styles.submitBtn}>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('EditChatDetailsScreen', { chat_id: this.state.chat_id, chat_name: this.state.chat_name })}>
            <Text style={styles.buttonText}>
              <MaterialCommunityIcons name="pencil" size={20} color="white" />
              {' '}
              Edit Chat Name
            </Text>
          </TouchableOpacity>
        </View>
        <Text>            </Text>
        <Text>            </Text>
        <Text style={styles.title}>Chat Members</Text>
        <View style={styles.submitBtn}>
          <TouchableOpacity style={styles.addButton} onPress={() => this.props.navigation.navigate('AddChatMemberScreen', { chat_id: this.state.chat_id, chat_name: this.state.chat_name })}>
            <Text style={styles.addButtonText}>
              <MaterialCommunityIcons name="plus" size={20} color="black" />
              {' '}
              Add Member
            </Text>
          </TouchableOpacity>
        </View>
        <Text>            </Text>
        <ContactList
          data={this.state.chatData.members}
          chat={this.state.chat_id}
          navigation={this.props.navigation}
          navigateTo="chatmembers"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAE0',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  container1: {
    flex: 1,
    backgroundColor: '#FEFAE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  addButton: {
    marginBottom: 10,
    backgroundColor: '#dca45c',
    border: '1px solid black',
  },
  addButtonText: {
    textAlign: 'center',
    padding: 10,
    color: 'black',
  },
  buttonText: {
    textAlign: 'center',
    padding: 10,
    color: 'white',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ChatOptionsScreen;
