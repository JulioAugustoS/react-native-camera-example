import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const cameraRef = useRef<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const verifyCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();

    setHasPermission(status === "granted");
  };

  useEffect(() => {
    verifyCameraPermission();
  }, []);

  if (hasPermission === null) return <View />;

  if (hasPermission === false) return <Text>No access to camera</Text>;

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      alert(photo.uri);
      setPhoto(photo.uri);
    }
  };

  if (image) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setImage(null)}
          style={{ position: "absolute", bottom: 50, zIndex: 10 }}
        >
          <Text style={styles.buttonText}>Tirar outra</Text>
        </TouchableOpacity>
        <Image source={{ uri: image }} style={styles.photoImg} />
      </View>
    );
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        flashMode={Camera.Constants.FlashMode.on}
        autoFocus={Camera.Constants.AutoFocus.on}
        zoom={0}
      >
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={styles.buttonText}>Inverter Camera</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
            <Text style={styles.buttonText}>Galeria de Fotos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => takePicture()}>
            <Text style={styles.buttonText}>Tirar Foto</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 50,
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
  },
  photoImg: {
    width: "100%",
    height: "100%",
  },
});
