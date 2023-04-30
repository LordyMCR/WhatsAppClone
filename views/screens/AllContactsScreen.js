import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIcon from '../components/loadingIcon';
import SearchBar from '../components/SearchBar';
import ContactList from '../components/ContactList';

class AllContactsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      allContactsData: [],
      search: '',
      error: '',
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.contacts = this.props.navigation.addListener('focus', () => {
      console.log('mounted');
      this.getAllContacts();
    });
  }

  componentWillUnmount() {
    this.contacts();
  }

  handleSearch(text) {
    this.setState({ search: text });
  }

  async getAllContacts() {
    try {
      console.log('getting all contacts...');
      const response = await fetch('http://localhost:3333/api/1.0.0/search', {
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
        const sortedJson = contactsJson.sort((a, b) => a.given_name.localeCompare(b.given_name));
        this.setState({
          isLoading: false,
          allContactsData: sortedJson,
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
  }

  render() {
    if (this.state.isLoading) {
      return (
        <LoadingIcon />
      );
    }
    if (this.state.allContactsData.length === 0) {
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
    const { search } = this.state;
    return (
      <View style={styles.container1}>
        <View style={styles.container2}>
          <SearchBar search={search} onSearchChange={this.handleSearch} />
          <Text style={styles.error}>{this.state.error}</Text>
          <ContactList
            data={this.state.allContactsData}
            navigation={this.props.navigation}
            navigateTo="allcontacts"
            search={this.state.search}
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

    // border: "1px solid black"
  },
  searchContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
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
  error: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AllContactsScreen;
