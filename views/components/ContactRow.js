import React, { Component } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
} from 'react-native';

class ContactRow extends Component {
  render() {
    const { onPress, item } = this.props;
    return (
      <View style={styles.contactsRow}>
        <TouchableOpacity style={styles.contactTouchable} onPress={onPress}>
          <Image style={styles.avatar} source={{ uri: item.photo }} />
          <View style={styles.contactContainer}>
            <Text style={styles.contactName}>
              {item.given_name || item.first_name}
              {' '}
              {item.family_name || item.last_name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contactsRow: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 6,

  },
  contactTouchable: {
    flex: 12,
    flexDirection: 'row',
  },
  contactContainer: {
    paddingVertical: 12,
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

});

export default ContactRow;
