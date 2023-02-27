import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class AllChatsScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            allChatsData: ""
        }
    }

    componentDidMount(){
        console.log("mounted");
        this.getAllChats();
    }

    getAllChats(){
        console.log("getting all chats...");
        return fetch("http://localhost:3333/api/1.0.0/chat")
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                isLoading: false,
                allChatsData: responseJson
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            

            <View style={styles.container1}>
            <View style={styles.container2}>

                <View style={styles.textContainer}>
                    <Text>AllChats page</Text>
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
    },
    container2: {
      flex: 1,
      width: "80%",
      alignItems: "stretch",
      justifyContent: "center",

      //border: "1px solid black"
    },
    textContainer: {
        flex: 1,
        //border: "1px solid blue",
        justifyContent: "center",
        textAlign: "center"
    }
});

export default AllChatsScreen; 