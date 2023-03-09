import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import MyContactsScreen from './MyContactsScreen';
import AllContactsScreen from "./AllContactsScreen";
import BlockedContactsScreen from "./BlockedContactsScreen";
import ContactScreen from './ContactScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

class ContactsNavigator extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Tab.Navigator 
        initialRouteName='MyContacts'
        screenOptions={{
          tabBarIndicatorStyle : {
            backgroundColor: "#606C38"
          },
          tabBarStyle: {
            backgroundColor: '#FEFAE0'
          }
          
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