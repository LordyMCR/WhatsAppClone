import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AllChatsScreen from './AllChatsScreen';
import AllContactsScreen from './AllContactsScreen';
import Logout from '../components/Logout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

class HomeNavigator extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    if(token == null) {
      this.props.navigation.navigate("Login");
    }
  }



  render() {
    return (
          <Tab.Navigator 
            initialRouteName='Chats'
            screenOptions={({ route }) => ({
              headerLeft: () => <Logout navigation={this.props.navigation}/>,
              headerStyle: {
                backgroundColor: '#FEFAE0'
              },
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Chats') {
                  iconName = focused ? 'message' : 'message-outline';
                } else if (route.name === 'Contacts') {
                  iconName = focused ? 'contacts' : 'contacts-outline';
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
            <Tab.Screen name="Contacts" component={AllContactsScreen} />
          </Tab.Navigator>
    );
  }
}

export default HomeNavigator;

// https://dev.to/easybuoy/combining-stack-tab-drawer-navigations-in-react-native-with-react-navigation-5-da