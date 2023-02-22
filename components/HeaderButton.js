import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HeaderButton = () => {
    const navigation = useNavigation();

    const handleLogout = () => {
        // Implement your logout logic here
        // For example, clear user session and navigate to the login screen
        navigation.navigate('Login');
    };

    return (
        <TouchableOpacity onPress={handleLogout} style={styles.icon}>
            <MaterialCommunityIcons name="dots-vertical-circle" size={24} color="#606C38" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    icon: {
        paddingLeft: "5px"
    }
  });

export default HeaderButton;