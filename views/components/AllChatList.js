import React, { Component } from 'react';
import { FlatList } from 'react-native';
import AllChatRow from './AllChatRow';

class AllChatList extends Component {
  render() {
    const { data, navigation, search } = this.props;
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.chat_id.toString()}
        renderItem={({ item }) => {
          if (search && (!(item.name && item.name.toLowerCase().includes(search.toLowerCase()))
          && (!(item.last_message && item.last_message.message
          && item.last_message.message.toLowerCase().includes(search.toLowerCase()))))) {
            return null;
          }
          return (
            <AllChatRow
              onPress={() => navigation.navigate('ChatScreen', {
                chat_id: item.chat_id,
                chat_name: item.name,
              })}
              item={item}
            />
          );
        }}
      />
    );
  }
}

export default AllChatList;
