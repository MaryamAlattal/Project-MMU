import { useState, useEffect, useContext, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Context = createContext(null);
//created custom Hook to prevent import of context instance 
export let useContextHook = () => useContext(Context);
//reusable server endpoint 
const url = 'https://whatsthatapp.ijsyouridea.repl.co';

export default function ContextProvider({ children }) {
  let [user, setUser] = useState(null);
  let [me, setMe] = useState(null);
  let [scope, setScope] = useState(null);
  let [users, setUsers] = useState([]);
  let [contacts, setContacts] = useState([]);
  let [blocked, setBlocked] = useState([]);
  let [filtered, setFiltered] = useState([]);

  const ReadData = async () => {
    try {
      fetch(`${url}/api/1.0.0/search?search_in=all&limit=20&offset=0`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-Authorization': user.token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          //filter ourself from user list
          let withoutMe = data.filter((item) => {
            if (item.user_id != user.id) {
              return true;
            } else {
              setMe(item);
              return false;
            }
          });
          setUsers(withoutMe);
          setFiltered(withoutme);
        });
    } catch (e) {
      // saving error
    }
  };
  const ReadContacts = async () => {
    try {
      fetch(`${url}/api/1.0.0/contacts`, {
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
          setContacts(data);
        });
    } catch (e) {
      console.log(e);
    }
  };
  const ReadBlocked = async () => {
    try {
      fetch(`${url}/api/1.0.0/blocked`, {
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
          setBlocked(data);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('session').then((jsonValue) => {
      const value = JSON.parse(jsonValue);
      if (value) {
        setUser(value);
      }
    });
  }, []);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        setScope,
        users,
        setUsers,
        contacts,
        setContacts,
        blocked,
        setBlocked,
        ReadBlocked,
        ReadContacts,
        ReadData,
        me,
        url,
        filtered,
        setFiltered,
      }}>
      {children}
    </Context.Provider>
  );
}
