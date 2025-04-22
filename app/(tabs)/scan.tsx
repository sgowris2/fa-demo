import {
    CameraView,
    useCameraPermissions,
  } from "expo-camera";
  import { useRef, useState } from "react";
  import { Button, Pressable, StyleSheet, Text, View } from "react-native";
  import { Image } from "expo-image";

  
  export default function App() {
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const [uri, setUri] = useState<string | null>(null);

  
    if (!permission) {
      return null;
    }
  
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: "center" }}>
            We need your permission to use the camera
          </Text>
          <Button onPress={requestPermission} title="Grant permission" />
        </View>
      );
    }
  
    const takePicture = async () => {
      const photo = await ref.current?.takePictureAsync();
      setUri(photo?.uri ?? null);
    };
  
    const renderPicture = () => {
      return (
        <View>
          <Image
            source={{ uri }}
            contentFit="contain"
            style={{ width: 400, aspectRatio: 1 }}
          />
          <Button onPress={() => setUri(null)} title="Take another picture" />
        </View>
      );
    };
  
    const renderCamera = () => {
      return (
        <CameraView
          style={styles.camera}
          ref={ref}
          mode={'picture'}
          facing={'back'}
          mute={false}
          responsiveOrientationWhenOrientationLocked
        >
          <View className="absolute bottom-4 left-0 w-full flex-row items-center justify-center px-8">
            <Pressable onPress={takePicture}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.shutterBtn,
                    {
                      opacity: pressed ? 0.5 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.shutterBtnInner,
                      {
                        backgroundColor: "white",
                      },
                    ]}
                  />
                </View>
              )}
            </Pressable>
          </View>
        </CameraView>
      );
    };
  
    return (
        <View style={styles.container}>
            {uri ? renderPicture() : renderCamera()}
        </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    camera: {
      flex: 1,
      width: "100%",
    },
    shutterContainer: {
      position: "absolute",
      bottom: 70,
      left: 0,
      width: "100%",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: 30,
    },
    shutterBtn: {
      backgroundColor: "transparent",
      borderWidth: 5,
      borderColor: "white",
      width: 85,
      height: 85,
      borderRadius: 45,
      alignItems: "center",
      justifyContent: "center",
    },
    shutterBtnInner: {
      width: 70,
      height: 70,
      borderRadius: 50,
    },
  });