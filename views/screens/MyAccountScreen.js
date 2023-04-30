import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Logout from '../components/Logout';
import LoadingIcon from '../components/loadingIcon';

class MyAccountScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      accountData: {},
      accountPhoto: null,
    };
  }

  componentDidMount() {
    this.account = this.props.navigation.addListener('focus', () => {
      console.log('mounted');
      this.getAccountDetails();
      this.getProfilePhoto();
    });
  }

  componentWillUnmount() {
    this.account();
  }

  async getAccountDetails() {
    try {
      console.log('getting user details...');
      const tokenID = await AsyncStorage.getItem('whatsthat_user_id');
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${tokenID}`, {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        const accountJson = await response.json();
        this.setState({
          isLoading: false,
          accountData: accountJson,
        });
      } else if (response.status === 401) {
        this.setState({
          isLoading: false,
          accountData: 'Unauthorised',
        });
      } else if (response.status === 404) {
        this.setState({
          isLoading: false,
          accountData: 'Not Found',
        });
      } else {
        this.setState({
          isLoading: false,
          accountData: 'Internal Server Error, try again',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProfilePhoto() {
    try {
      console.log('getting account photo...');
      const tokenID = await AsyncStorage.getItem('whatsthat_user_id');
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${tokenID}/photo`, {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        const photoResponseBlob = await response.blob();
        const photoResponse = URL.createObjectURL(photoResponseBlob);
        this.setState({
          isLoading: false,
          accountPhoto: photoResponse,
        });
      } else if (response.status === 401) {
        this.setState({
          isLoading: false,
          accountPhoto: 'Unauthorised',
        });
      } else if (response.status === 404) {
        this.setState({
          isLoading: false,
          accountPhoto: 'Not Found',
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

  render() {
    if (this.state.isLoading) {
      return (
        <LoadingIcon />
      );
    }
    if (this.state.accountData.length === 0) {
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
          <View>
            <Image
              source={{
                uri: this.state.accountPhoto,
              }}
              style={styles.image}
            />
            <Text style={styles.name}>
              {this.state.accountData.first_name}
              {' '}
              {this.state.accountData.last_name}
            </Text>
            <Text style={styles.email}>{this.state.accountData.email}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => this.props.navigation.navigate('EditMyDetailsScreen', { originalData: this.state.accountData })}>
              <Text style={styles.buttonText}>
                <MaterialCommunityIcons name="pencil" size={20} color="white" />
                {' '}
                Change Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.changePhotoButton} onPress={() => this.props.navigation.navigate('ChangeProfilePhotoScreen')}>
              <Text>
                <MaterialCommunityIcons name="camera" size={20} color="black" />
                {' '}
                Change Profile Photo
              </Text>
            </TouchableOpacity>
            <Logout navigation={this.props.navigation} />
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
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 30,
  },
  name: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  email: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#606C38',
    border: '1px solid black',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
  },
  changePhotoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#dca45c',
    border: '1px solid black',
  },
});

export default MyAccountScreen;
