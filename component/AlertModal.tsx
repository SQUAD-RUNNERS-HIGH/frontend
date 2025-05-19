import { SetStateAction } from "react";
import { Modal, Pressable, StyleSheet, View, Image, Text } from "react-native";
import Button from "./Button";

const AlertModal = ({
  visible,
  setVisible,
  title,
  description
}: {
  visible: boolean;
  setVisible: React.Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => {
          setVisible(false);
        }}
      ></Pressable>
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <Image
            source={require("@/assets/images/check.png")}
            style={styles.image}
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Button style = {{marginTop:8, width: '100%'}} onPress={() => {setVisible(false)}}>
            확인
          </Button>
        </View>
      </View>
    </Modal>
  );
};
export default AlertModal;
const styles = StyleSheet.create({
  modalBackground: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  container: {
    padding: 24,
    width: "100%",
    backgroundColor: "white",
    zIndex: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    maxWidth: 300,
    borderRadius: 12,
  },
  image: {
    width: 36,
    height: 36,
  },
  title: {
    fontFamily: "Roboto",
    fontSize: 20,
    fontWeight: 600,
    marginTop: 8,
    color: "#000000",
  },
  description: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "normal",
    color: "#4B5563",
  },
});
