import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AllChatsScreen from '../screens/AllChatsScreen';
import ContactsNavigator from './ContactsNavigator';
import MyAccountScreen from '../screens/MyAccountScreen';

const Tab = createBottomTabNavigator();

class HomeTabNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Tab.Navigator
        initialRouteName="Chats"
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#E1E0C1',
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
            backgroundColor: '#E1E0C1',
          },
        })}
      >
        <Tab.Screen name="Chats" component={AllChatsScreen} />
        <Tab.Screen name="Contacts" component={ContactsNavigator} />
        <Tab.Screen name="Account" component={MyAccountScreen} />
      </Tab.Navigator>
    );
  }
}

export default HomeTabNav;
