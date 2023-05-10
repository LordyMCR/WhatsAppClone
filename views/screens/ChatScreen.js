import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingIcon from '../components/loadingIcon';
import ChatRow from '../components/ChatRow';

class ChatScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      chatData: [],
      userStorageID: '',
      newMessage: '',
      error: '',
    };

    this.sendNewMessage = this.sendNewMessage.bind(this);
  }

  componentDidMount() {
    this.chat = this.props.navigation.addListener('focus', () => {
      console.log('mounted');
      this.getChat();
      this.setStorageID();
      const { route } = this.props;
      const { chat_id } = route.params;
      AsyncStorage.getItem(`draft_${chat_id}`).then((draft) => {
        if (draft) {
          this.setState({
            newMessage: draft,
          });
        }
      }).catch((error) => {
        console.log(error);
      });
    });
    this.update = setInterval(() => this.getChat(), 1000);
  }

  componentWillUnmount() {
    this.chat();
    clearInterval(this.update);
    const { route } = this.props;
    const { chat_id } = route.params;
    if (this.state.newMessage.trim() !== '') {
      AsyncStorage.setItem(`draft_${chat_id}`, this.state.newMessage);
    } else {
      AsyncStorage.removeItem(`draft_${chat_id}`);
    }
  }

  async handleDeleteMessage(item) {
    const { route } = this.props;
    const { chat_id } = route.params;

    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/message/${item.message_id}`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        this.setState({
          isLoading: false,
        });
        this.getChat();
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
          error: 'Internal Server Error, try again',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async setStorageID() {
    const id = await AsyncStorage.getItem('whatsthat_user_id');
    this.setState({
      userStorageID: parseInt(id, 10),
    });
  }

  async getChat() {
    const { route } = this.props;
    const { chat_id } = route.params;
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        const chatJson = await response.json();
        this.setState({
          isLoading: false,
          chatData: chatJson,
        });
        this.props.navigation.setOptions({
          title: chatJson.name,
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
          error: 'Internal Server Error, try again',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sendNewMessage() {
    if (this.state.newMessage.length !== 0) {
      const { route } = this.props;
      const { chat_id } = route.params;

      const toSend = {
        message: this.state.newMessage,
      };
      try {
        const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
          },
          body: JSON.stringify(toSend),
        });
        if (response.status === 200) {
          this.setState({
            isLoading: false,
            newMessage: '',
          });
          AsyncStorage.removeItem(`draft_${chat_id}`);
          this.getChat();
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
            chatData: 'Internal Server Error, try again',
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <LoadingIcon />
      );
    }
    return (
      <>
        <View style={styles.container1}>
          <Text style={styles.error}>{this.state.error}</Text>
          <View style={styles.container2}>
            <FlatList
              inverted
              data={this.state.chatData.messages
                ? this.state.chatData.messages.sort((a, b) => b.timestamp - a.timestamp) : []}
              keyExtractor={(item) => item.message_id.toString()}
              renderItem={({ item }) => (
                <ChatRow
                  onPressEdit={() => this.props.navigation.navigate('EditChatMessageScreen', {
                    message:
                    item,
                    message_id: item.message_id,
                    chat_id: this.props.route.params.chat_id,
                    chat_name: this.props.route.params.chat_name,
                  })}
                  onPressDelete={() => this.handleDeleteMessage(item)}
                  userStorageID={this.state.userStorageID}
                  item={item}
                />
              )}
            />
          </View>
        </View>
        <View style={styles.messageSendBar}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            onChangeText={(newMessage) => this.setState({ newMessage })}
            value={this.state.newMessage}
          />
          <TouchableOpacity onPress={this.sendNewMessage}>
            <View style={styles.button}>
              <MaterialCommunityIcons name="send" size={24} color="white" textAlign="center" />
            </View>
          </TouchableOpacity>
        </View>
      </>

    );
  }
}

const styles = StyleSheet.create({
  messageSendBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '5px',
    paddingBottom: '10px',
    backgroundColor: '#FEFAE0',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginRight: 5,
    width: '80%',
    padding: '5px',
    borderRadius: '15px',
  },
  button: {
    backgroundColor: '#DDA15E',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  buttonIcon: {
    textAlign: 'center',
  },
  container1: {
    flex: 1,
    backgroundColor: '#FEFAE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    flex: 1,
    width: '90%',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  wholeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    left: '22%',
  },
  wholeWrapperLeft: {
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    marginRight: '5px',
  },
  chatContainer: {
    padding: '10px',
    marginBottom: '10px',
    width: '60%',
    borderRadius: '10px',
    alignSelf: 'flex-end',
    backgroundColor: '#565e3a',
  },
  chatContainerLeft: {
    padding: '10px',
    marginBottom: '10px',
    width: '60%',
    borderRadius: '10px',
    alignSelf: 'flex-start',
    backgroundColor: '#283618',
  },
  chatAuthor: {
    fontSize: '14px',
    marginBottom: '5px',
    color: '#DDA15E',
  },
  chatMessage: {
    fontSize: '16px',
    marginBottom: '5px',
    color: '#fff',
  },
  chatTimestamp: {
    fontSize: '12px',
    color: '#BC6C25',
  },
  error: {
    color: 'red',
    fontSize: '16px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
