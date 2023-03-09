import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AllChatsScreen from './AllChatsScreen';
import ChatScreen from './ChatScreen';

const Stack = createNativeStackNavigator();

class ChatsNavigator extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Stack.Navigator 
        initialRouteName='Chats'
        screenOptions={{
            headerStyle: {
                backgroundColor: '#FEFAE0'
            }
        }}
      >
        <Stack.Screen name="All Chats" component={AllChatsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
      </Stack.Navigator>
    );
  }
}

export default ChatsNavigator;