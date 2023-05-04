import { View, StyleSheet, ScrollView } from 'react-native';
import Search from '../Search';
import UserRow from './UserRow';
import { useContextHook } from '../../ContextProvider';

export default function ContactList({ navigation }) {
  let { contacts } = useContextHook();

  return (
    <View>
      <ScrollView style={styles.container}>
        {contacts.map((user) => (
          <UserRow
            key={user.user_id}
            user={user}
            navigation={navigation}
            isContact={true}
          />
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
  },
});
