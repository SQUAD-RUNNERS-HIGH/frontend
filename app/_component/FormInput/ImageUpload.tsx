import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ControllerRenderProps } from "react-hook-form";
import { pick, random } from "lodash";
interface ImageUploadProps {
  errorMessage?: string;
  type?: string;
  placeholder: string;
  hideError?: boolean;
  field: ControllerRenderProps<any, string>;
}
const ImageUpload = ({
  errorMessage,
  type = "text",
  placeholder,
  field,
  hideError,
}: ImageUploadProps) => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      field.onChange({
        uri: result.assets[0].uri,
        name: result.assets[0].fileName ?? `photo.jpg`,
        type: "image/jpeg",
      });
    }
    console.log(result);
  };
  return (
    <Pressable
      style={[styles.container, { paddingVertical: field.value ? 0 : 24 }]}
      onPress={pickImage}
    >
      {field.value ? (
        <Image
          source={{ uri: field.value.uri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      ) : (
        <>
          <Image
            width={24}
            height={21}
            source={require("@/assets/images/camera.png")}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.mainText]}>이미지를 선택하세요</Text>
            <Text style={[styles.subText]}>PNG,JPG,GIF (최대 2MB)</Text>
          </View>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    paddingVertical: 24,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    width: "100%",
    maxHeight: 130,
    gap: 12,
  },
  textContainer: {
    gap: 4,
  },
  mainText: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 20,
    textAlign: "center",
    color: "#6B7280",
  },
  subText: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: 16,
    textAlign: "center",
    letterSpacing: 0,
    color: "#9CA3AF",
  },
  error: {
    fontSize: 14,
    color: "#EF4444",
  },
});
export default ImageUpload;
