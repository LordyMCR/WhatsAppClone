import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

class LoadingIcon extends Component {
  render() {
    return (
      <View style={styles.container1}>
        <View style={styles.container2}>
          <View style={styles.textContainer}>
            <ActivityIndicator size="large" color="#606C38" />
          </View>
        </View>
      </View>
    );
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
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingIcon;
