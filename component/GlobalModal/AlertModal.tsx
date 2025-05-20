import { Modal, Pressable, StyleSheet, View, Image, Text } from "react-native";
import Button from "../Button";
import { useAlertStore } from "@/store/useAlertStore";
import { useShallow } from "zustand/react/shallow";

const AlertModal = () => {
    const {
  visible,
  title,
  theme,
  description,
  hideAlert,
} = useAlertStore(
  useShallow((state) => ({
    visible: state.visible,
    title: state.title,
    theme: state.theme,
    description: state.description,
    hideAlert: state.hideAlert,
  }))
);
const icon = theme === 'Alert'
  ? require('@/assets/images/check.png')
  : require('@/assets/images/xCircle.png');  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        hideAlert();
      }}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => {
          hideAlert();
        }}
      ></Pressable>
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <Image
            source={icon}
            style={styles.image}
          />
          <Text style={styles.title}>{title || "크루 생성 완료"}</Text>
          <Text style={styles.description}>
            {description || "크루가 생성되었습니다."}
          </Text>
          <Button
            style={{ marginTop: 8, width: "100%" }}
            onPress={() => {
              hideAlert();
            }}
          >
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
    position: "fixed",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  container: {
    padding: 24,
    width: "100%",
    backgroundColor: "white",
    zIndex: 40,
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
