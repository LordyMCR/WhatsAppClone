import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIcon from '../components/loadingIcon';
import SearchBar from '../components/SearchBar';
import AllChatList from '../components/AllChatList';

class AllChatsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      allChatsData: [],
      search: '',
      error: '',
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.chats = this.props.navigation.addListener('focus', () => {
      console.log('mounted');
      this.getAllChats();
    });
    this.update = setInterval(() => this.getAllChats(), 1000);
  }

  componentWillUnmount() {
    this.chats();
    clearInterval(this.update);
    this.setState({ search: '' });
  }

  handleSearch(text) {
    this.setState({ search: text });
  }

  async getAllChats() {
    try {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
        this.setState({
          isLoading: false,
        });
      }, 5000);
      const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        const chatsJson = await response.json();
        const sortedJson = chatsJson.sort((a, b) => {
          if (a.last_message.timestamp && b.last_message.timestamp) {
            return b.last_message.timestamp - a.last_message.timestamp;
          } if (a.last_message.timestamp) {
            return -1;
          } if (b.last_message.timestamp) {
            return 1;
          }
          return b.chat_id - a.chat_id;
        });
        this.setState({
          isLoading: false,
          allChatsData: sortedJson,
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
    if (this.state.allChatsData.length === 0) {
      return (
        <View style={styles.container1}>
          <View style={styles.container2}>
            <View style={styles.textContainer}>
              <Text>No chats yet</Text>
            </View>
            <TouchableOpacity
              style={styles.createChatButton}
              onPress={() => this.props.navigation.navigate('CreateNewChatScreen')}
            >
              <MaterialCommunityIcons name="message-plus" size={28} color="#fff" />
            </TouchableOpacity>

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
          <AllChatList
            data={this.state.allChatsData}
            navigation={this.props.navigation}
            search={this.state.search}
          />
          <TouchableOpacity
            style={styles.createChatButton}
            onPress={() => this.props.navigation.navigate('CreateNewChatScreen')}
          >
            <MaterialCommunityIcons name="message-plus" size={28} color="#fff" />
          </TouchableOpacity>
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
    width: '90%',
    alignItems: 'stretch',
    justifyContent: 'center',
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
  createChatButton: {
    position: 'absolute',
    bottom: 25,
    right: 5,
    zIndex: 1,
    padding: 10,
    backgroundColor: '#dda15e',
    borderRadius: 50,
  },
  chatContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatName: {
    flex: 2,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  chatLastMessage: {
    flex: 6,
    paddingLeft: 5,
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  chatTimestamp: {
    flex: 2,
    color: '#888',
    paddingLeft: 5,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AllChatsScreen;
