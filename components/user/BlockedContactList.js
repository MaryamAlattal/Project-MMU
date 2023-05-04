import { View, StyleSheet, ScrollView } from 'react-native';
import Search from '../Search';
import UserRow from './UserRow';
import { useContextHook } from '../../ContextProvider';

export default function BlockedContactList({ navigation }) {
  let { blocked } = useContextHook();

  return (
    <View>
      <ScrollView style={styles.container}>
        {blocked.map((user) => (
          <UserRow
            key={user.user_id}
            user={user}
            navigation={navigation}
            isBlocked={true}
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
