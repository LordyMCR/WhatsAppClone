import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AllChatsScreen from './screens/AllChatsScreen';
import AllContactsScreen from './screens/AllContactsScreen';

const Tab = createBottomTabNavigator();

class HomeNavigator extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator initialRouteName='AllChats'>
          <Tab.Screen name="AllChats" component={AllChatsScreen} />
          <Tab.Screen name="AllContacts" component={AllContactsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default HomeNavigator;