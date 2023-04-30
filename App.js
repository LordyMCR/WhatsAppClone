import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './views/screens/LoginScreen';
import RegisterScreen from './views/screens/RegisterScreen';
import SuccessfulRegisterScreen from './views/screens/SuccessfulRegisterScreen';
import HomeNavigator from './views/navigators/HomeNavigator';

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
              backgroundColor: '#E1E0C1'
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
                backgroundColor: '#E1E0C1'
              }
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;