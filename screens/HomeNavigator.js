import React, { Component } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabNav from './HomeTabNav';
import ChatScreen from './ChatScreen';
import ContactScreen from './ContactScreen';

const Stack = createNativeStackNavigator();

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
      
      <Stack.Navigator>
        <Stack.Screen name="HomeTabNav" component={HomeTabNav} options={{ headerShown: false }} />
        <Stack.Screen
          name="ChatScreen" 
          component={ChatScreen} 
          options={({route}) => ({
            title: route.params.chat_name,
            headerStyle: {
              backgroundColor: "#FEFAE0"
            },
            })}
        />
        <Stack.Screen
          name="ContactScreen" 
          component={ContactScreen} 
          options={({route}) => ({
            title:  route.params.first_name + " " + route.params.last_name,
            headerStyle: {
              backgroundColor: "#FEFAE0"
            },
            })}
        />
      </Stack.Navigator>
    );
  }
}

export default HomeNavigator;

// https://dev.to/easybuoy/combining-stack-tab-drawer-navigations-in-react-native-with-react-navigation-5-da