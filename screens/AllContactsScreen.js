import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class AllContactsScreen extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            

            <View style={styles.container1}>
            <View style={styles.container2}>

                <View>
                    <Text>AllContacts page</Text>
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
    }
});

export default AllContactsScreen; 