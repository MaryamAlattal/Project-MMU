import React from 'react';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { useContextHook } from '../ContextProvider';

const Search = () => {
  const [text, onChangeText] = React.useState('');
  let { setFiltered, users } = useContextHook();
  function handleChange(value) {
    onChangeText(value);
    let filtered = users.filter((user) => {
      for (let key in user) {
        if (user[key].includes(value)) {
          return true;
        }
      }
      return false;
    });
    setFiltered(filtered);
  }
  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={handleChange}
        value={text}
        placeholder={'search...'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    
  },
});

export default Search;
