import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

class ContactScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            accountPhoto: null
        }
    }

    async getPhoto() {
        const { route } = this.props;
        const { user_id } = route.params;
        try {
        const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/photo`, {
            method: "GET",
            headers: {
            "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            }
        });
        if (response.status === 200) {
            let photoBlob = await response.blob();
            let photoResponse = URL.createObjectURL(photoBlob);
            this.setState({
                isLoading: false,
                accountPhoto: photoResponse
            });
        } else if(response.status === 401) {
            this.setState({
                isLoading: false,
                accountPhoto: "Unauthorised"
            });
        } else if(response.status === 404) {
            this.setState({
                isLoading: false,
                accountPhoto: "Not Found"
            });
        
        } else {
            this.setState({
                isLoading: false,
                accountPhoto: "Internal Server Error, try again"
            });
        }
        } catch (error) {
        console.log(error);
        }
    }

    componentDidMount(){
        this.account = this.props.navigation.addListener("focus", () => {
            console.log("mounted");
            this.getPhoto();
        })
    }

    componentWillUnmount() {
        this.account();
    }  

    render(){
        const { route } = this.props;
        const { user_id, first_name, last_name } = route.params;
        
        if(this.state.isLoading){
            return(
                <View style={styles.container1}>
                    <View style={styles.container2}>
                        <View style={styles.textContainer}>
                            <ActivityIndicator size="large" color="#606C38" />
                        </View>

                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.container1}>
                <View style={styles.container2}>
                    <View>
                        <Image
                            source={{
                                uri: this.state.accountPhoto,
                            }}
                            style={{ width: 200, height: 200 }}
                        ></Image>
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
        alignItems: "center",
        justifyContent: "center",

      //border: "1px solid black"
    },
    
  });

  export default ContactScreen;