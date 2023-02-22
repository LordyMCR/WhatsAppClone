import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SuccessfulRegisterScreen from './screens/SuccessfulRegisterScreen';


const Stack = createNativeStackNavigator();

export default class App extends Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {  
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login"
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen} 
          />
          <Stack.Screen
            name="SuccessfullyRegistered"
            component={SuccessfulRegisterScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
