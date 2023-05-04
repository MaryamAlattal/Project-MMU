import {
  Camera,
  CameraType,
  onCameraReady,
  CameraPictureOptions,
} from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {useContextHook} from '../ContextProvider';


export default function CameraTakePhoto({navigation}) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  let {user,url} = useContextHook()

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
    console.log('Camera: ', type);
  }

  async function sendToServer(data) {
    let res = await fetch(data.uri);
    let blob = await res.blob();

    fetch(`${url}/api/1.0.0/user/${user.id}/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': user.token,
      },
      body: blob,
    })
      .then((response) => {

        console.log('Picture added', response.status);
        navigation.navigate('Users')
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function takePhoto() {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);

      sendToServer(data);
    }
  }

  if (!permission || !permission.granted) {
    return <Text>No access to camera</Text>;
  } else {
    return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.text}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:'auto',
  },
  camera:{
    height:'100%'
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 5,
    margin: 5,
    backgroundColor: 'steelblue',
  },
  button: {
    width: 100,
    height: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ddd',
  },
});
