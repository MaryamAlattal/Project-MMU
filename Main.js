import { Button, StyleSheet } from 'react-native';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Conversation from './components/chat/Conversation';
import Users from './components/user/Users';
import UserView from './components/user/UserView';
import ConversationList from './components/chat/ConversationList';
import CameraView from './components/CameraView';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactList from './components/user/ContacstList';
import BlockedContactList from './components/user/BlockedContactList';
import SelectUserList from './components/user/SelectUserList';
import { useContextHook } from './ContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

function App() {
  let { user, setUser, setScope,url } = useContextHook();

  return (
    <NavigationContainer onStateChange={setScope}>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={({ navigation }) => ({
            headerRight: () => (
              <Button
                title="sign up"
                onPress={() => navigation.navigate('SignUp')}
              />
            ),
          })}
        />
        <Stack.Screen name="SignUp" component={(props)=> <SignUp url={url} {...props}/>} />
        <Stack.Screen
          name="Users"
          component={Users}
          options={({ navigation }) => ({
            headerRight: () => (
              <Button
                title="sign out"
                onPress={() => {
                  setUser(null);
                  AsyncStorage.setItem('session', '');
                  navigation.navigate('Login')
                }}
              />
            ),
            headerLeft: () => (
              <Button
                title="Chats"
                onPress={() => {
                  navigation.navigate('Conversations');
                }}
              />
            ),
          })}
        />
        <Stack.Screen name="Conversations" component={ConversationList} />
        <Stack.Screen name="Contacts" component={ContactList} />
        <Stack.Screen name="Blocked Contacts" component={BlockedContactList} />
        <Stack.Screen name="Conversation" component={Conversation} />
        <Stack.Screen
          name="User Overview"
          component={UserView}
          options={({ navigation, route }) => ({
            headerRight:
              route.params.user_id === user.id
                ? () => (
                    <Button
                      title="make photo"
                      onPress={() => navigation.navigate('Camera')}
                    />
                  )
                : null,
          })}
        />
        <Stack.Screen name="Camera" component={CameraView} />
        <Stack.Screen name="Select contacts" component={SelectUserList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
