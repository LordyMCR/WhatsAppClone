import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import LoadingIcon from '../components/loadingIcon';

class ContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      accountPhoto: null,
      error: '',
    };

    this.removeContact = this.removeContact.bind(this);
    this.addContact = this.addContact.bind(this);
    this.blockContact = this.blockContact.bind(this);
    this.unblockContact = this.unblockContact.bind(this);
    this.removeChatMember = this.removeChatMember.bind(this);
  }

  componentDidMount() {
    this.account = this.props.navigation.addListener('focus', () => {
      console.log('mounted');
      this.getPhoto();
    });
  }

  componentWillUnmount() {
    this.account();
  }

  async getPhoto() {
    const { route } = this.props;
    const { user_id } = route.params;
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/photo`, {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        const photoBlob = await response.blob();
        const photoResponse = URL.createObjectURL(photoBlob);
        this.setState({
          isLoading: false,
          accountPhoto: photoResponse,
        });
      } else if (response.status === 401) {
        this.setState({
          isLoading: false,
          error: 'Unauthorised',
        });
      } else if (response.status === 404) {
        this.setState({
          isLoading: false,
          error: 'Not Found',
        });
      } else {
        this.setState({
          isLoading: false,
          accountPhoto: 'Internal Server Error, try again',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async removeContact() {
    const { route } = this.props;
    const { user_id } = route.params;
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/contact`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        this.props.navigation.navigate('HomeTabNav', { screen: 'Contacts' });
      } else if (response.status === 400) {
        this.setState({ error: "Can't remove yourself" });
      } else if (response.status === 401) {
        this.setState({ error: 'Unauthorised' });
      } else if (response.status === 404) {
        this.setState({ error: 'Not found' });
      } else {
        this.setState({ error: 'Internal server error, try again' });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addContact() {
    const { route } = this.props;
    const { user_id } = route.params;
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/contact`, {
        method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        this.props.navigation.navigate('HomeTabNav', { screen: 'Contacts' });
      } else if (response.status === 400) {
        this.setState({ error: "Can't add yourself" });
      } else if (response.status === 401) {
        this.setState({ error: 'Unauthorised' });
      } else if (response.status === 404) {
        this.setState({ error: 'Not found' });
      } else {
        this.setState({ error: 'Internal server error, try again' });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async blockContact() {
    const { route } = this.props;
    const { user_id } = route.params;
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/block`, {
        method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        this.props.navigation.navigate('HomeTabNav', { screen: 'Contacts' });
      } else if (response.status === 400) {
        this.setState({ error: "Can't block yourself" });
      } else if (response.status === 401) {
        this.setState({ error: 'Unauthorised' });
      } else if (response.status === 404) {
        this.setState({ error: 'Not found' });
      } else {
        this.setState({ error: 'Internal server error, try again' });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async unblockContact() {
    const { route } = this.props;
    const { user_id } = route.params;
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/block`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        this.props.navigation.navigate('HomeTabNav', { screen: 'Contacts' });
      } else if (response.status === 400) {
        this.setState({ error: "Can't unblock yourself" });
      } else if (response.status === 401) {
        this.setState({ error: 'Unauthorised' });
      } else if (response.status === 404) {
        this.setState({ error: 'Not found' });
      } else {
        this.setState({ error: 'Internal server error, try again' });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async removeChatMember() {
    const { route } = this.props;
    const {
      chat_id, chat_name, user_id,
    } = route.params;
    const loggedInUserID = await AsyncStorage.getItem('whatsthat_user_id');
    const user_id_str = user_id.toString();
    console.log(user_id_str);
    console.log(loggedInUserID);
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/user/${user_id}`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        if (user_id_str === loggedInUserID) {
          this.props.navigation.navigate('HomeTabNav', { screen: 'AllChatScreen' });
        } else {
          this.props.navigation.navigate('ChatOptionsScreen', { chat_id, chat_name });
        }
      } else if (response.status === 401) {
        this.setState({ error: 'Unauthorised' });
      } else if (response.status === 403) {
        this.setState({ error: 'Forbidden' });
      } else if (response.status === 404) {
        this.setState({ error: 'Not found' });
      } else {
        this.setState({ error: 'Internal server error, try again' });
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { route } = this.props;
    const {
      first_name, last_name, nav,
    } = route.params;

    let button1; let
      button2;

    if (nav === 'mycontacts') {
      button1 = (
        <TouchableOpacity style={styles.removeButton} onPress={this.removeContact}>
          <Text style={styles.removeText}>
            <MaterialCommunityIcons name="close" size={20} color="white" />
            {' '}
            Remove Contact
          </Text>
        </TouchableOpacity>
      );
      button2 = (
        <TouchableOpacity style={styles.blockButton} onPress={this.blockContact}>
          <Text color="white" textAlign="center">
            <MaterialCommunityIcons name="cancel" size={20} color="black" />
            {' '}
            Block Contact
          </Text>
        </TouchableOpacity>
      );
    } else if (nav === 'allcontacts') {
      button1 = (
        <TouchableOpacity style={styles.addButton} onPress={this.addContact}>
          <Text color="white" textAlign="center">
            <MaterialCommunityIcons name="plus" size={20} color="black" />
            {' '}
            Add Contact
          </Text>
        </TouchableOpacity>
      );
    } else if (nav === 'blockedcontacts') {
      button1 = (
        <TouchableOpacity style={styles.unblockButton} onPress={this.unblockContact}>
          <Text color="white" textAlign="center">
            <MaterialCommunityIcons name="plus" size={20} color="black" />
            {' '}
            Unblock Contact
          </Text>
        </TouchableOpacity>
      );
    } else if (nav === 'chatmembers') {
      button1 = (
        <TouchableOpacity style={styles.removeButton} onPress={this.removeChatMember}>
          <Text style={styles.removeText}>
            <MaterialCommunityIcons name="close" size={20} color="white" />
            {' '}
            Remove from Chat
          </Text>
        </TouchableOpacity>
      );
    }

    if (this.state.isLoading) {
      return (
        <LoadingIcon />
      );
    }
    return (
      <View style={styles.container1}>
        <View style={styles.container2}>
          <View>
            <Image
              source={{
                uri: this.state.accountPhoto,
              }}
              style={styles.image}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {first_name}
                {' '}
                {last_name}
              </Text>
            </View>
            {button1}
            {button2}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 50,
  },
  nameContainer: {
    textAlign: 'center',
  },
  name: {
    marginBottom: 50,
    fontSize: 20,
    fontWeight: 'bold',
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#AA4841',
    border: '1px solid black',
  },
  removeText: {
    color: 'white',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#94B82A',
    border: '1px solid black',
  },
  blockButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#dda15e',
    border: '1px solid black',
  },
  unblockButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#dda15e',
    border: '1px solid black',
  },
  error: {
    color: 'red',
    fontWeight: '900',
    textAlign: 'center',
  },
});

export default ContactScreen;
