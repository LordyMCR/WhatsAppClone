import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import HomeTabNav from './HomeTabNav';
import ChatScreen from '../screens/ChatScreen';
import CreateNewChatScreen from '../screens/CreateNewChatScreen';
import EditChatMessageScreen from '../screens/EditChatMessageScreen';
import EditChatDetailsScreen from '../screens/EditChatDetailsScreen';
import ContactScreen from '../screens/ContactScreen';
import ChatOptionsScreen from '../screens/ChatOptionsScreen';
import EditMyDetailsScreen from '../screens/EditMyDetailsScreen';
import ChangeProfilePhotoScreen from '../screens/ChangeProfilePhotoScreen';
import AddChatMemberScreen from '../screens/AddChatMemberScreen';

const Stack = createNativeStackNavigator();

class HomeNavigator extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async checkLoggedIn() {
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    if (token == null) {
      await AsyncStorage.multiRemove('whatsthat_session_token', 'whatsthat_user_id');
      const keys = await AsyncStorage.getAllKeys();
      const draftKeys = keys.filter((key) => key.startsWith('draft_'));
      await AsyncStorage.multiRemove(draftKeys);
      this.props.navigation.navigate('Login');
    }
  }

  render() {
    return (

      <Stack.Navigator>
        <Stack.Screen name="HomeTabNav" component={HomeTabNav} options={{ headerShown: false }} />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={({ route, navigation }) => ({
            headerStyle: {
              backgroundColor: '#E1E0C1',
            },
            headerTitleStyle: {
              marginLeft: 14,
            },
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 14 }}
                onPress={() => navigation.navigate('HomeTabNav', { screen: 'AllChatsScreen' })}
              >
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate('ChatOptionsScreen', { chat_id: route.params.chat_id, chat_name: route.params.chat_name })}
              >
                <MaterialCommunityIcons name="cog" size={24} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="CreateNewChatScreen"
          component={CreateNewChatScreen}
          options={{
            title: 'Create New Chat',
            headerStyle: {
              backgroundColor: '#E1E0C1',
            },
          }}
        />
        <Stack.Screen
          name="ChatOptionsScreen"
          component={ChatOptionsScreen}
          options={({ route, navigation }) => ({
            title: 'Chat Options',
            headerStyle: {
              backgroundColor: '#E1E0C1',
            },
            headerTitleStyle: {
              marginLeft: 14,
            },
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 14 }}
                onPress={() => navigation.navigate('ChatScreen', { chat_id: route.params.chat_id, chat_name: route.params.chat_name })}
              >
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="EditChatDetailsScreen"
          component={EditChatDetailsScreen}
          options={{
            title: 'Edit Chat Name',
            headerStyle: {
              backgroundColor: '#E1E0C1',
            },
          }}
        />
        <Stack.Screen
          name="EditChatMessageScreen"
          component={EditChatMessageScreen}
          options={{
            title: 'Edit Message',
            headerStyle: {
              backgroundColor: '#E1E0C1',
            },
          }}
        />
        <Stack.Screen
          name="AddChatMemberScreen"
          component={AddChatMemberScreen}
          options={{
            title: 'Add Chat Member',
            headerStyle: {
              backgroundColor: '#E1E0C1',
            },
          }}
        />
        <Stack.Screen
          name="ContactScreen"
          component={ContactScreen}
          options={({ route }) => ({
            title: `${route.params.first_name} ${route.params.last_name}`,
            headerStyle: {
              backgroundColor: '#E1E0C1',
            },
          })}
        />
        <Stack.Screen
          name="EditMyDetailsScreen"
          component={EditMyDetailsScreen}
          options={{
            title: 'Edit Details',
            headerStyle: {
              backgroundColor: '#E1E0C1',
            },
          }}
        />
        <Stack.Screen
          name="ChangeProfilePhotoScreen"
          component={ChangeProfilePhotoScreen}
          options={{
            title: 'Change Profile Photo',
            headerShown: false,
            headerStyle: {
              backgroundColor: '#E1E0C1',
            },
          }}
        />
      </Stack.Navigator>
    );
  }
}

export default HomeNavigator;
