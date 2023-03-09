import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class ContactScreen extends Component {

    constructor(props){
        super(props);
    }

    render(){
        const { route } = this.props;
        const { user_id, first_name, last_name } = route.params;
    
        return (
            <View style={styles.container1}>
            <View style={styles.container2}>
                <View>
                    <Text>User ID: {user_id}</Text>
                    <Text>First Name: {first_name}</Text>
                    <Text>Last Name: {last_name}</Text>
                    {/* TODO: display contact details */}
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
    logoContainer: {
        flex: 2,
        //border: "1px solid blue",
        justifyContent: "center",
        textAlign: "center"
    },
    logoText: {
        fontSize: "3em",
        fontWeight: "bold",
        fontFamily: "Helvetica",
        paddingTop: "100px"
    },
    formContainer: {
        flex: 3,
        //border: "1px solid red"
    },
    message: {
        justifyContent: "center",
        textAlign: "center"
    },
    redirect:{
        justifyContent: "center",
        textAlign: "center",
        textDecorationLine: "underline",
        //paddingTop: "50px"
    }
  });

  export default ContactScreen;