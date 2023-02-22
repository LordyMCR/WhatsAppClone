import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SuccessfulRegisterScreen from './screens/SuccessfulRegisterScreen';
import HomeNavigator from './screens/HomeNavigator';

const Stack = createNativeStackNavigator();

class App extends Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {  
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FEFAE0'
            }
          }}
        >
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
          <Stack.Screen
            name="HomeNavigator"
            component={HomeNavigator}
            options={{ 
              headerShown: false,
              headerStyle: {
                backgroundColor: '#FEFAE0'
              }
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;