import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class ChatScreen extends Component {

    constructor(props){
        super(props);
    }

    render(){
        const { route } = this.props;
        const { chat_id, chat_name } = route.params;
    
        return (
            <View style={styles.container1}>
            <View style={styles.container2}>
                <View>
                    <Text>Chat ID: {chat_id}</Text>
                    <Text>Chat Name: {chat_name}</Text>
                    {/* TODO: display chat messages */}
                </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        backgroundColor: '#FEFAE0',
        alignItems: 'center',
        justifyContent: 'center',
        //border: "1px solid black"
    },
    container2: {
        flex: 1,
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
        //border: "1px solid black"

      //border: "1px solid black"
    }
  });

  export default ChatScreen;