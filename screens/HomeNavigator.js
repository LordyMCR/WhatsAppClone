import React, { Component } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import HomeTabNav from './HomeTabNav';
import ChatScreen from './ChatScreen';
import CreateNewChatScreen from './CreateNewChatScreen';
import EditChatMessageScreen from './EditChatMessageScreen';
import EditChatDetailsScreen from './EditChatDetailsScreen';
import ContactScreen from './ContactScreen';
import ChatOptionsScreen from './ChatOptionsScreen';
import EditMyDetailsScreen from './EditMyDetailsScreen';
import ChangeProfilePhotoScreen from './ChangeProfilePhotoScreen';
import AddChatMemberScreen from './AddChatMemberScreen';

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
          options={({route, navigation}) => ({
            headerStyle: {
              backgroundColor: "#FEFAE0"
            },
            headerLeft: () => (
              <TouchableOpacity style={{ marginLeft: 14 }}
                onPress={() => navigation.navigate("HomeTabNav", { screen: "AllChatsScreen" })}
              >
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                style={{marginRight: 15}}
                onPress={() => navigation.navigate('ChatOptionsScreen', { chat_id: route.params.chat_id, chat_name: route.params.chat_name})}>
                <MaterialCommunityIcons name="cog" size={24} color="black" />
              </TouchableOpacity>
            )
            })}
        />
        <Stack.Screen
          name="CreateNewChatScreen" 
          component={CreateNewChatScreen} 
          options={({}) => ({
            title: "Create New Chat",
            headerStyle: {
              backgroundColor: "#FEFAE0"
            },
          })}
        />
        <Stack.Screen
          name="ChatOptionsScreen" 
          component={ChatOptionsScreen} 
          options={({ route, navigation }) => ({
            title: "Chat Options",
            headerStyle: {
              backgroundColor: "#FEFAE0"
            },
            headerTitleStyle: {
              marginLeft: 14
            },
        
            headerLeft: () => (
              <TouchableOpacity style={{ marginLeft: 14 }}
                onPress={() => navigation.navigate("ChatScreen", { chat_id: route.params.chat_id, chat_name: route.params.chat_name })}
              >
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="EditChatDetailsScreen" 
          component={EditChatDetailsScreen} 
          options={({}) => ({
            title: "Edit Chat Name",
            headerStyle: {
              backgroundColor: "#FEFAE0"
            },
          })}
        />
        <Stack.Screen
          name="EditChatMessageScreen" 
          component={EditChatMessageScreen} 
          options={({}) => ({
            title: "Edit Message",
            headerStyle: {
              backgroundColor: "#FEFAE0"
            },
          })}
        />
        <Stack.Screen
          name="AddChatMemberScreen" 
          component={AddChatMemberScreen} 
          options={({}) => ({
            title: "Add Chat Member",
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
        <Stack.Screen
          name="EditMyDetailsScreen"
          component={EditMyDetailsScreen}
          options={({}) => ({
            title: "Edit Details",
            headerStyle: {
              backgroundColor: "#FEFAE0"
            },
          })}
        />
        <Stack.Screen
          name="ChangeProfilePhotoScreen"
          component={ChangeProfilePhotoScreen}
          options={({}) => ({
            title: "Change Profile Photo",
            headerShown: false,
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