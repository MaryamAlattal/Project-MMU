import { useState, useEffect } from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Button,
} from 'react-native';
import Message from './Message';
import { useContextHook } from '../../ContextProvider';

export default function Conversation({ navigation, route }) {
  let { user, url } = useContextHook();
  let [text, onChangeText] = useState('');
  let [chat, setChat] = useState(null);

  const sendMessage = () => {
    fetch(`${url}/api/1.0.0/chat/${route.params.chatData.chat_id}/message`, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'X-Authorization': user.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: text }),
    })
      .then(() => route.params.ReadChatMessages(setChat))
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      route.params.ReadChatMessages(setChat);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    let interval = setInterval(() => {
      route.params.ReadChatMessages(setChat);
      console.log('REQ');
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function handleDelete(id) {
    chat.messages = chat.messages.filter((message) => message.message_id != id);
    setChat({ ...chat });
  }

  return (
    <View>
      <ScrollView style={styles.container}>
        {chat &&
          chat.messages
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((message) => (
              <Message
                position={message.author.user_id === user.id ? 'right' : 'left'}
                user={message.author.first_name}
                msg={message.message}
                time={message.timestamp}
                id={message.message_id}
                key={message.message_id}
                chatId={route.params.chatData.chat_id}
                onDelete={() => handleDelete(message.message_id)}
              />
            ))}
      </ScrollView>
      <SafeAreaView>
        <View style={styles.messageInput}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            placeholder="message here ..."
          />
          <Button title="send" onPress={sendMessage} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 4,
    height: '90%',
  },
  input: {
    height: 33,
    borderWidth: 1,
    padding: 5,
    flex: 1,
    marginRight: 5,
    width: 100,
  },
  messageInput: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 5,
  },
});
