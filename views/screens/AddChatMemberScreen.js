import React, { Component } from 'react';
import {
  View, Text, StyleSheet, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIcon from '../components/loadingIcon';
import ContactRow from '../components/ContactRow';

class AddChatMemberScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      myContactsData: [],
      error: '',
    };
  }

  componentDidMount() {
    this.contacts = this.props.navigation.addListener('focus', () => {
      console.log('mounted');
      this.getMyContacts();
    });
  }

  componentWillUnmount() {
    this.contacts();
  }

  handleError(errorMessage) {
    this.setState({ error: errorMessage }, () => {
      setTimeout(() => {
        this.setState({ error: null });
      }, 3000);
    });
  }

  async getMyContacts() {
    try {
      console.log('getting my contacts...');
      const response = await fetch('http://localhost:3333/api/1.0.0/contacts', {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        const contactsJson = await response.json();
        const imagePromises = contactsJson.map(async (contact) => {
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
        const sortedJson = contactsJson.sort((a, b) => a.first_name.localeCompare(b.first_name));
        this.setState({
          isLoading: false,
          myContactsData: sortedJson,
        });
      } else if (response.status === 401) {
        this.setState({
          isLoading: false,
          myContactsData: 'Unauthorised',
        });
      } else {
        this.setState({
          isLoading: false,
          myContactsData: 'Internal Server Error, try again',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addContactToChat(contactId) {
    const { route } = this.props;
    const { chat_id, chat_name } = route.params;
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/user/${contactId}`, {
        method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        this.props.navigation.navigate('ChatOptionsScreen', { chat_id, chat_name });
      } else if (response.status === 400) {
        this.handleError('Member already in chat');
      } else if (response.status === 401) {
        this.setState({ error: 'Unauthorized' });
      } else if (response.status === 403) {
        this.setState({ error: 'Forbidden' });
      } else if (response.status === 404) {
        this.setState({ error: 'Not Found' });
      } else {
        console.log('Internal server error, try again');
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
    if (this.state.myContactsData.length === 0) {
      return (
        <View style={styles.container1}>
          <View style={styles.container2}>
            <View style={styles.textContainer}>
              <Text>No contacts yet</Text>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container1}>
        <View style={styles.container2}>
          <Text style={styles.error}>{this.state.error}</Text>
          <FlatList
            data={this.state.myContactsData}
            keyExtractor={(item) => item.user_id.toString()}
            renderItem={({ item }) => (
              <ContactRow
                onPress={() => this.addContactToChat(item.user_id)}
                item={item}
              />
            )}
          />
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
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  contactsRow: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 6,
  },
  contactTouchable: {
    flex: 12,
    flexDirection: 'row',
  },
  contactContainer: {
    paddingVertical: 12,
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

});

export default AddChatMemberScreen;
