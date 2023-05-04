import { StyleSheet, SafeAreaView, Button, TextInput } from 'react-native';
import { useState } from 'react';
import { useContextHook } from '../../ContextProvider';

export default function AddNewConversation({ addNew }) {
  const [text, onChangeText] = useState('');
  const [editable, setEditable] = useState('');
  let { user, url } = useContextHook();

  const makeNewChat = async () => {
    try {
      fetch(`${url}/api/1.0.0/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.token,
        },
        body: JSON.stringify({ name: text }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          addNew({ ...data, name: text });
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView>
      <Button
        title={editable ? 'save chat' : 'add chat'}
        onPress={() => {
          if (editable) {
            makeNewChat();
          }
          setEditable(!editable);
        }}
      />
      {editable && (
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="new chat name"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
