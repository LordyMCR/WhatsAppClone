import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AllChatsScreen from './AllChatsScreen';
import AllContactsScreen from './AllContactsScreen';
import HeaderButton from '../components/HeaderButton';

const Tab = createBottomTabNavigator();

class HomeNavigator extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Tab.Navigator 
        initialRouteName='Chats'
        screenOptions={({ route }) => ({
          headerLeft: () => <HeaderButton />,
          headerStyle: {
            backgroundColor: '#FEFAE0'
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Chats') {
              iconName = focused
                ? 'message'
                : 'message-outline';
            } else if (route.name === 'Contacts') {
              iconName = focused ? 'contacts' : 'contacts-outline';
            }

            // You can return any component that you like here!
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
        <Tab.Screen name="Contacts" component={AllContactsScreen} />
      </Tab.Navigator>
    );
  }
}

export default HomeNavigator;