import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

class SearchBar extends Component {
  render() {
    const { search, onSearchChange } = this.props;

    return (
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={onSearchChange}
          value={search}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default SearchBar;
