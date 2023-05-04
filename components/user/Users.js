import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Button } from 'react-native';
import UserRow from './UserRow';
import Search from '../Search';
import { useContextHook } from '../../ContextProvider';

export default function Users({ navigation }) {
  let { filtered, contacts, blocked, ReadBlocked, ReadContacts, ReadData, me, users } =
    useContextHook();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      ReadContacts();
      ReadData();
      ReadBlocked();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      <Button
        title={'My profile'}
        onPress={() => navigation.navigate('User Overview', me)}
      />
      <Button
        title={'show contact list'}
        onPress={() => navigation.navigate('Contacts')}
      />
      <Button
        title={'show blocked contacts'}
        onPress={() => navigation.navigate('Blocked Contacts')}
      />
      <Search />
      <ScrollView style={styles.container}>
        {users.map((user, index) => (
          <UserRow
            user={user}
            navigation={navigation}
            isContact={contacts.find(
              (contact) => contact.user_id == user.user_id
            )}
            isBlocked={blocked.find(
              (contact) => contact.user_id == user.user_id
            )}
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
    padding: 24,
    height: '80%',
  },
});
