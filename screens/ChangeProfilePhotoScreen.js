import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, CameraType, onCameraReady, CameraPictureOptions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CameraSendToServer() {
    const [type, setType] = useState(CameraType.back);
    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          if (status === 'granted') {
            setHasPermission(true);
          }
        })();
      }, []);

    function toggleCameraType(){
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
        console.log("Camera: ", type)
    }

    async function takePhoto(){
        if(camera){
            const options = {quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data)}
            const data = await camera.takePictureAsync(options)
        }
    }

    async function sendToServer(data){

        let tokenID = await AsyncStorage.getItem("whatsthat_user_id");

        let res = await fetch(data.uri);
        let blob = await res.blob()

        return fetch('http://localhost:3333/api/1.0.0/user/' + tokenID + '/photo', {
            method: 'POST',
            headers: {
                'Content-Type': 'image/jpeg',
                'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")
            },
            body: blob
        })
        .then((response) => {
            if(response.status === 200){
                console.log("Photo sent to server")
                navigation.navigate("HomeTabNav", {screen: "MyAccountScreen"});

            } else if(response.status === 400){
                console.log("Bad request")
            } else if(response.status === 401){
                console.log("Unauthorised")
            } else if(response.status === 404){
                console.log("Not found")
            } else if(response.status === 500){
                console.log("Server error")
            }
        })
        .catch((error) => {
            console.log(error)
        })

    }

    if (hasPermission === null) {
        return <Text>Please allow browser permissions to use Camera</Text>;
    } else if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    } else {   
        return (
            <View style={styles.container}>
                <Camera style={styles.camera} type={type} ref={ref => setCamera(ref)}>
                <View style={styles.buttonsGroup}>
                    <View style={styles.buttonContainerBack}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("HomeTabNav", {screen: "MyAccountScreen"})}>
                            <MaterialCommunityIcons name="close" size={36} color="white" textAlign="center" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainerTake}>
                        <TouchableOpacity style={styles.button} onPress={takePhoto}>
                            <MaterialCommunityIcons name="circle-slice-8" size={68} color="white" textAlign="center" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainerFlip}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                            <MaterialCommunityIcons name="camera-flip" size={32} color="white" textAlign="center" />
                        </TouchableOpacity>
                    </View>       
                </View>             
                </Camera>
            </View>
        );
    }  
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      buttonsGroup: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        
      },
      buttonContainerBack: {
        width: 35,
        height: 35,      
        marginTop: 20,
        marginLeft: 10,
        padding: 5,
        margin: 5,
        backgroundColor: 'black',
        borderRadius: 50,
      },
      buttonContainerTake: {
        alignSelf: 'flex-end',
        width: 60,
        height: 60,    
        marginLeft: 5,  
        padding: 5,
        margin: 5,
        marginBottom: 20,
      },
      buttonContainerFlip: {
        alignSelf: 'flex-end',
        width: 40,
        height: 40,    
        marginBottom: 30,
        marginRight: 20,  
        padding: 5,
        margin: 5,
        backgroundColor: 'black',
        borderRadius: 50,
      },
      button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      },
      camera: {
        flex: 1,
      },
})
