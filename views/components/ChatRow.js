import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

class ChatRow extends Component {
  render() {
    const {
      onPressEdit, onPressDelete, userStorageID, item,
    } = this.props;
    return (
      <View style={item.author.user_id === userStorageID
        ? styles.wholeWrapper : styles.wholeWrapperLeft}
      >
        {item.author.user_id === userStorageID && (
        <View style={styles.iconWrapper}>
          <TouchableOpacity style={styles.iconContainer} onPress={onPressEdit}>
            <MaterialCommunityIcons name="pencil" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer} onPress={onPressDelete}>
            <MaterialCommunityIcons name="trash-can" size={20} color="black" />
          </TouchableOpacity>
        </View>
        )}
        <View style={item.author.user_id === userStorageID
          ? styles.chatContainer : styles.chatContainerLeft}
        >
          <Text style={styles.chatAuthor}>
            {item.author.first_name}
            {' '}
            {item.author.last_name}
          </Text>
          <Text style={styles.chatMessage}>{item.message}</Text>
          <Text style={styles.chatTimestamp}>
            {new Date(item.timestamp).toLocaleString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wholeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    left: '22%',
  },
  wholeWrapperLeft: {
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    marginRight: '5px',
  },
  chatContainer: {
    padding: '10px',
    marginBottom: '10px',
    width: '60%',
    borderRadius: '10px',
    alignSelf: 'flex-end',
    backgroundColor: '#565e3a',
  },
  chatContainerLeft: {
    padding: '10px',
    marginBottom: '10px',
    width: '60%',
    borderRadius: '10px',
    alignSelf: 'flex-start',
    backgroundColor: '#283618',
  },
  chatAuthor: {
    fontSize: '14px',
    marginBottom: '5px',
    color: '#DDA15E',
  },
  chatMessage: {
    fontSize: '16px',
    marginBottom: '5px',
    color: '#fff',
  },
  chatTimestamp: {
    fontSize: '12px',
    color: '#BC6C25',
  },
});

export default ChatRow;
