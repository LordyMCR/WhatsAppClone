import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import MyContactsScreen from '../screens/MyContactsScreen';
import AllContactsScreen from '../screens/AllContactsScreen';
import BlockedContactsScreen from '../screens/BlockedContactsScreen';

const Tab = createMaterialTopTabNavigator();

class ContactsNavigator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Tab.Navigator
        initialRouteName="MyContacts"
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: '#606C38',
          },
          tabBarStyle: {
            backgroundColor: '#FEFAE0',
          },

        }}
      >
        <Tab.Screen name="My Contacts" component={MyContactsScreen} />
        <Tab.Screen name="All Contacts" component={AllContactsScreen} />
        <Tab.Screen name="Blocked" component={BlockedContactsScreen} />
      </Tab.Navigator>
    );
  }
}

export default ContactsNavigator;
