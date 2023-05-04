import { useState,useEffect } from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  StyleSheet,
  Vibration,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContextHook } from '../ContextProvider';

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('session', jsonValue);
  } catch (e) {
    // saving error
  }
};

function Login({ navigation }) {
  let [obj, setObj] = useState({
    email: '',
    password: '',
    success: null,
  });
  let { setUser, url, user } = useContextHook();

  useEffect(() => {
      if (user) {
        navigation.navigate('Users');
      }
  }, [user]);

  function handEmailInput(email) {
    console.log('ok');
    setObj({ ...obj, email: email });
  }

  function handPasswordInput(pass) {
    setObj({ ...obj, password: pass });
  }

  function login() {
    fetch(`${url}/api/1.0.0/login`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: obj.email,
        password: obj.password,
      }),
    })
      .then((response) => {
        console.log(response, obj);
        if (response.status == 200) {
          setObj({
            ...obj,
            success: true,
          });
          return response.json();
        } else {
          setObj({
            ...obj,
            success: false,
          });
          Vibration.vibrate();
          return response.text();
        }
      })
      .then((result) => {
        if (result.token) {
          setUser(result);
          storeData(result);
          navigation.navigate('Users');
        }
      });
  }

  return (
    <View style={{ padding: 50 }}>
    <Text>{user && user.id}</Text>
      <TextInput
        style={styles.input}
        keyboardType={'email-address'}
        placeholder="email..."
        onChangeText={handEmailInput}
        value={obj.email}
      />

      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="password..."
        onChangeText={handPasswordInput}
        value={obj.password}
      />
      <Button
        onPress={login}
        title="Log in"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      {obj.success === null ? null : obj.success ? (
        <Text style={{ color: 'green' }}>Success login</Text>
      ) : (
        <Text style={{ color: 'red' }}>
          Email or password is not correct or you need to sign up
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderTop: '1px solid black',
    padding: 10,
    margin: 5,
    backgroundColor: 'yellow',
  },
});

export default Login;
