/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';

class AllChatRow extends Component {
  render() {
    const { onPress, item } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
      >
        <View style={styles.chatContainer}>
          <Text style={styles.chatName}>
            {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
          </Text>
          <Text style={styles.chatLastMessage}>
            {item.last_message && item.last_message.message
              ? item.last_message.message.length > 92
                ? `${item.last_message.message.substring(0, 92)}...`
                : item.last_message.message
              : '<No messages sent yet>'}
          </Text>
          <Text style={styles.chatTimestamp}>
            {item.last_message.timestamp
              ? new Date(item.last_message.timestamp).toLocaleString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                month: 'short',
                day: 'numeric',
              })
              : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatName: {
    flex: 2,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  chatLastMessage: {
    flex: 6,
    paddingLeft: 5,
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  chatTimestamp: {
    flex: 2,
    color: '#888',
    paddingLeft: 5,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AllChatRow;
