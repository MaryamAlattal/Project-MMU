import { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Search from '../Search';
import UserRow from './UserRow';
import { useContextHook } from '../../ContextProvider';

export default function SelectUserList({ navigation, route }) {
  let [users, setUsers] = useState([]);
  let { user, contacts, url } = useContextHook();

  function takeContacts({ members }) {
    //It could be users who are my contact, but they are not in the existed chat 
    let contactsWithChatPresenceProp = contacts.map((contactUser) => ({
      ...contactUser,
      isInChat:
        members.findIndex(
          (chatUser) => chatUser.user_id == contactUser.user_id
        ) > -1,
      isMineContact: true,
    }));
    //It could be users in a chat, which are not my contacts so, we add functunality to added to contact from invite 
    members.forEach((member) => {
      if (
        contactsWithChatPresenceProp.findIndex(
          (contact) => contact.user_id === member.user_id
        ) === -1
      ) {
        contactsWithChatPresenceProp.push({
          ...member,
          isInChat: true,
          isMineContact: false,
        });
      }
    });
    let withoutMe = contactsWithChatPresenceProp.filter(
      (item) => item.user_id != user.id
    );

    setUsers(withoutMe);
  }

  function handleDeleteFromChat(id) {
    fetch(
      `${url}/api/1.0.0/chat/${route.params.chatData.chat_id}/user/${id}`,
      {
        method: 'DELETE',
        headers: {
          accept: '*/*',
          'X-Authorization': user.token,
        },
        body: '',
      }
    )
      .then(() => route.params.ReadChatMessages(takeContacts))
      .catch((error) => {
        console.log(error);
      });
  }

  function handleAddToChat(id) {
    console.log(user,`${url}/api/1.0.0/chat/${route.params.chatData.chat_id}/user/${id}`)
    fetch(
      `${url}/api/1.0.0/chat/${route.params.chatData.chat_id}/user/${id}`,
      {
        method: 'POST',
        headers: {
          accept: '*/*',
          'X-Authorization': user.token,
        },
        body: '',
      }
    )
      .then(() => route.params.ReadChatMessages(takeContacts))
      .catch((error) => {
        console.log('34',error);
      });
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      route.params.ReadChatMessages(takeContacts);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      <ScrollView style={styles.container}>
        {users.map((user) =>
          user.isMineContact ? (
            <View style={styles.row}>
              <Text> {user.first_name} </Text>
              <Text> {user.last_name} </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: user.isInChat ? 'red' : 'green',
                  marginVertical: 2,
                  padding: 8,
                  textAlign: 'center',
                }}
                onPress={
                  user.isInChat
                    ? () => handleDeleteFromChat(user.user_id)
                    : () => handleAddToChat(user.user_id)
                }>
                <Text>
                  {user.isInChat ? 'delete from this chat' : 'add to this chat'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <UserRow
              user={user}
              navigation={navigation}
              isContact={false}
              ReadContacts={() => route.params.ReadChatMessages(takeContacts)}
            />
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'lightpink',
  },
});
