import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useContextHook } from '../../ContextProvider';
import { Text, View, StyleSheet, Image } from 'react-native';

export default function UserView({ route }) {
  let [image, setImage] = useState(null);
  let [thisIsMe, setThisIsMe] = useState(false);
  let { user: value, url } = useContextHook();

  const ReadImage = async () => {
    try {
      setThisIsMe(route.params.user_id === value.id);
      fetch(`${url}/api/1.0.0/user/${route.params.user_id}/photo`, {
        method: 'GET',
        headers: {
          accept: 'image/png',
          'X-Authorization': value.token,
        },
      })
        .then((response) => response.blob())
        .then((data) => {
          var reader = new FileReader();
          reader.readAsDataURL(data);
          reader.onloadend = function () {
            var base64data = reader.result;
            setImage(base64data);
          };
        });
    } catch (e) {
      // saving error
    }
  };
  useEffect(() => {
    ReadImage();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      ReadImage();
    }, [])
  );
  return (
    <View>
      <Text>{thisIsMe ? 'My Photo:' : 'User Photo:'}</Text>
      <Image
        style={styles.logo}
        source={{
          uri: image,
        }}
      />
      <Text style={styles.paragraph}>{JSON.stringify(route.params)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    width: 100,
    height: 200,
  },
});
