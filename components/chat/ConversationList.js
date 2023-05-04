import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import Search from '../Search';
import ChatRow from './ChatRow';
import AddNewConversation from './AddNewConversation';
import { useContextHook } from '../../ContextProvider';

export default function ConversationList({ navigation }) {
  let [chats, setChats] = useState([]);
  let { contacts, user, url } = useContextHook();

  const ReadData = async () => {
    // try {

    fetch(`${url}/api/1.0.0/chat`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-Authorization': user.token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setChats(data);
      });
    //} catch (e) {
    //   console.log(e);
    // }
  };

  useEffect(() => {
    ReadData();
  }, []);

  return (
    <View style={{ position: 'relative' }}>
      <Search />
      <AddNewConversation addNew={(chat) => setChats([...chats, chat])} />
      <View>
        {contacts.map((contact) => (
          <Text>{contact.given_name}</Text>
        ))}
      </View>
      <ScrollView style={styles.container}>
        {chats.map((chat) => (
          <ChatRow key={chat.chat_id} chatData={chat} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    backgroundColor: '#FFCCCC',
  },
});
