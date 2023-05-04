import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { useState } from 'react';
import {useContextHook} from '../../ContextProvider'

export default function ChatRow({ chatData, navigation }) {
  let {user,url} = useContextHook()
  let [chat, setChat] = useState(null);
  let [editable, setEditable] = useState(false);
  let [text, onChangeText] = useState(chatData.name);

  const ReadChatMessages = async (cb) => {
    fetch(`${url}/api/1.0.0/chat/${chatData.chat_id}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-Authorization': user.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setChat(data);
        cb(data);
      });
  };
  function handleChangeChatName(){
     fetch(`${url}/api/1.0.0/chat/${chatData.chat_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.token,
        },
        body: JSON.stringify({ name: text }),
      })
  }

  return (
    <View>
      {editable ? (
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder={'new chat name'}
        />
      ) : (
        <Text>
          {chatData.chat_id}. {text}
        </Text>
      )}
      <Button
        title={editable ? 'save' : 'rename chat'}
        onPress={() => {
          if (editable) {
            setEditable(false);
            handleChangeChatName()
          } else {
            setEditable(true);
          }
        }}
      />
      <Button
        title="show history"
        onPress={() =>
          navigation.navigate('Conversation', {
            chatData,
            ReadChatMessages,
            chat,
          })
        }
      />
      <Button
        title="invite members"
        onPress={() =>
          navigation.navigate('Select contacts', {
            chatData,
            ReadChatMessages,
            chat,
          })
        }
      />
    </View>
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
