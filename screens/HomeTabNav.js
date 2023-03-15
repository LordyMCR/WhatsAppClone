import React, { Component } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AllChatsScreen from './AllChatsScreen';
import ContactsNavigator from './ContactsNavigator';
import AccountNavigator from './AccountNavigator'
import Logout from '../components/Logout';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

class HomeTabNav extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Tab.Navigator 
        initialRouteName='Chats'
        screenOptions={({ route }) => ({
          headerRight: () => <Logout navigation={this.props.navigation}/>,
          headerStyle: {
            backgroundColor: '#FEFAE0'
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Chats') {
              iconName = focused ? 'message' : 'message-outline';
            } else if (route.name === 'Contacts') {
              iconName = focused ? 'contacts' : 'contacts-outline';
            } else if (route.name === 'Account') {
              iconName = focused ? 'account-cog' : 'account-cog-outline';
            }
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#606C38',
          tabBarInactiveTintColor: '#000',
          tabBarStyle: {
            backgroundColor: '#FEFAE0',
          }
        })}
      >
        <Tab.Screen name="Chats" component={AllChatsScreen} />
        <Tab.Screen name="Contacts" component={ContactsNavigator} />
        <Tab.Screen name="Account" component={AccountNavigator} />
      </Tab.Navigator>
    );
  }
}

export default HomeTabNav;