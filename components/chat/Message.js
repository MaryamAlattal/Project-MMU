import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Button, TextInput } from 'react-native';
import { useContextHook } from '../../ContextProvider';

export default function Message({
  user,
  msg,
  time,
  position,
  id,
  chatId,
  onDelete,
}) {
  let { user:{token},url } = useContextHook();
  let [editable, setEditable] = useState(false);
  let [text, onChangeText] = useState(msg);

  function handleChangeMessage() {
    fetch(`${url}/api/1.0.0/chat/${chatId}/message/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify({ message: text }),
    });
  }

  function handleDeleteMessage() {
    fetch(`${url}/api/1.0.0/chat/${chatId}/message/${id}`, {
      method: 'DELETE',
      headers: {
        accept: '*/*',
        'X-Authorization': token,
      },
      body: '',
    }).finally(() => onDelete());
  }
  return (
    <View
      style={{
        backgroundColor:
          position === 'left' ? 'rgba(255,0,0,0.3)' : 'rgba(0,255,0,0.3)',
      }}>
      {editable ? (
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder={'new chat name'}
        />
      ) : (
        <Text style={{ ...styles.paragraph, textAlign: position }}>{text}</Text>
      )}
      <Text style={{ ...styles.below, textAlign: position }}>
        {new Date(time).toDateString()}
      </Text>
      <Text style={{ ...styles.below, textAlign: position }}>{user}</Text>
      {
        position == 'right' && <>
      
      <Button
        title={editable ? 'save' : 'edit'}
        onPress={() => {
          if (editable) {
            setEditable(false);
            handleChangeMessage();
          } else {
            setEditable(true);
          }
        }}
      />
      <Button title={'delete'} onPress={() => handleDeleteMessage()} />
   </>}
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  below: {
    marginTop: 5,
    color: 'rgb(200,200,200)',
  },
});
