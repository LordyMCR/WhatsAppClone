import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Logout extends Component {
  constructor(props) {
    super(props);

    this.onPressLogoutButton = this.onPressLogoutButton.bind(this);
  }

  async onPressLogoutButton() {
    console.log('logout processing...');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.multiRemove(['whatsthat_session_token', 'whatsthat_user_id']);
          const keys = await AsyncStorage.getAllKeys();
          const draftKeys = keys.filter((key) => key.startsWith('draft_'));
          await AsyncStorage.multiRemove(draftKeys);
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.props.navigation.navigate('Login');
          throw 'Unauthorised';
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <TouchableOpacity style={styles.logoutButton} onPress={this.onPressLogoutButton}>
        <Text style={styles.text}>
          <MaterialCommunityIcons name="logout" size={16} color="white" />
          {' '}
          Log Out
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ac4c44',
    border: '1px solid black',
  },
  text: {
    color: 'white',
  },
});

export default Logout;
