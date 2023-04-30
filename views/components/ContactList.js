import React, { Component } from 'react';
import { FlatList } from 'react-native';
import ContactRow from './ContactRow';

class ContactList extends Component {
  render() {
    const {
      data, chat, navigation, navigateTo, search,
    } = this.props;
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={({ item }) => {
          if (search && !(item.given_name && item.given_name.toLowerCase()
            .includes(search.toLowerCase()) || item.first_name && item.first_name.toLowerCase()
            .includes(search.toLowerCase()) || item.family_name && item.family_name.toLowerCase()
            .includes(search.toLowerCase()) || item.last_name && item.last_name.toLowerCase()
            .includes(search.toLowerCase()))) {
            return null;
          }
          return (
            <ContactRow
              onPress={() => navigation.navigate('ContactScreen', {
                nav: navigateTo,
                user_id: item.user_id,
                first_name: item.given_name || item.first_name,
                last_name: item.family_name || item.last_name,
                chat_id: chat,
              })}
              item={item}
            />
          );
        }}
      />
    );
  }
}

export default ContactList;
