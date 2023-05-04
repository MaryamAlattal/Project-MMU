import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import {useContextHook} from '../../ContextProvider'

export default function UserRow({
  user,
  navigation,
  isContact,
  isBlocked
}) {
  let { given_name, family_name, email, user_id } = user;
  let {ReadBlocked, ReadContacts, user:value, url} = useContextHook()

  async function handleAddToContactList() {
    fetch(`${url}/api/1.0.0/user/${user_id}/contact`, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'X-Authorization': value.token,
      },
    }).finally(() => {
      ReadContacts();
    });
  }
  async function handleDeleteFromContactList() {
    fetch(`${url}/api/1.0.0/user/${user_id}/contact`, {
      method: 'DELETE',
      headers: {
        accept: '*/*',
        'X-Authorization': value.token,
      },
    }).finally(() => {
      ReadContacts();
    });
  }

  async function handleBlock() {
    fetch(`${url}/api/1.0.0/user/${user_id}/block`, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'X-Authorization': value.token,
      },
    }).finally(() => {
      ReadBlocked();
      ReadContacts();
    });
  }
  async function handleUnblock() {
    fetch(`${url}/api/1.0.0/user/${user_id}/block`, {
      method: 'DELETE',
      headers: {
        accept: '*/*',
        'X-Authorization': value.token,
      },
    }).finally(() => {
      ReadBlocked();
      ReadContacts();
    });
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text> {given_name} </Text>
        <Text> {family_name} </Text>

        <Text>{email}</Text>
      </View>
      <Text style={styles.paragraph}>{family_name}</Text>
      <Button
        title="show details"
        onPress={() => navigation.navigate('User Overview', user)}
      />
      {!isBlocked && (
        <TouchableOpacity
          style={{
            backgroundColor: isContact ? 'red' : 'green',
            marginVertical: 2,
            padding: 8,
            textAlign: 'center',
          }}
          onPress={
            isContact ? handleDeleteFromContactList : handleAddToContactList
          }>
          <Text>
            {isContact ? 'delete from contact list' : 'add to contact list'}
          </Text>
        </TouchableOpacity>
      )}
      {(isBlocked || isContact) && (
        <TouchableOpacity
          style={{
            backgroundColor: isBlocked ? 'green' : 'red',
            marginVertical: 2,
            padding: 8,
            textAlign: 'center',
          }}
          onPress={isBlocked ? handleUnblock : handleBlock}>
          <Text>{isBlocked ? 'Unblock contact' : 'Block contact'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFE5CC',
  },
  card:{
    padding:5,
    borderTop: '1px solid black',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    borderRadius: '5px',
    backgroundColor: '#FFCCCC',

    margin:5
  },
  paragraph: {
    margin: 24,
    marginTop: 2,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#FFFFCC',
  },
});
