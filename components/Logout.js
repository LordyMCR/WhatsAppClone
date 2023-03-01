import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Logout extends Component {

    constructor(props) {
        super(props);

        this._onPressLogoutButton = this._onPressLogoutButton.bind(this)
    }

    async _onPressLogoutButton(){
        console.log("logout processing...")
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: "POST",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            }
        })
        .then(async (response) => {
            if(response.status === 200) {
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login");
            } else if(response.status === 401) {
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login");
                throw "Unauthorised"
            } else {
                throw "Something went wrong"
            }
        })
        .catch((error) => {
            console.log(error)
        })
    };

    render() {
        return (
        <TouchableOpacity onPress={this._onPressLogoutButton} style={styles.icon}>
            <MaterialCommunityIcons name="dots-vertical-circle" size={24} color="#606C38" />
        </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    icon: {
        paddingLeft: "5px"
    }
  });

export default Logout;