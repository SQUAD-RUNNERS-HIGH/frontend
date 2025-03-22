import FormInput from "@/app/_component/FormInput";
import { SetStateAction } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { crewSchema } from "../_lib/crewSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/app/_component/Button";

export function CreateCrewModal({
  modalVisible,
  setModalVisible,
}: {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<SetStateAction<boolean>>;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof crewSchema>>({
    resolver: zodResolver(crewSchema),
    mode: "onChange",
  });
  return (
    <Modal
      animationType="slide" // fade, slide, none 가능
      transparent={true} // 배경을 투명하게 설정
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)} // 안드로이드 뒤로가기 대응
    >
      <Pressable
        style={styles.modalOverlay}
        // onPress={() => setModalVisible(false)}
      ></Pressable>
      <View style={styles.modalPosition}>
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>새로운 크루 만들기</Text>
          <FormInput
            control={control}
            errorMessage={errors.name?.message}
            name="name"
            label="크루 이름"
            placeholder="크루 이름을 입력하세요"
          />
          <FormInput
            control={control}
            errorMessage={errors.image?.message}
            name="image"
            label="크루 이미지"
            placeholder="이미지를 선택하세요"
            isImage
          />
          <FormInput
            control={control}
            errorMessage={errors.maxCapacity?.message}
            name="maxCapacity"
            label="최대 인원"
            placeholder="최대 인원을 입력하세요"
          />
          <FormInput
            control={control}
            errorMessage={errors.description?.message}
            name="description"
            label="크루 설명"
            placeholder="크루를 소개해주세요"
          />
          <FormInput
            control={control}
            errorMessage={errors.description?.message}
            name="description"
            label="크루 설명"
            placeholder="크루를 소개해주세요"
          />
          <Button style = {{marginTop:6, width:'100%'}} onPress = {() => {}}>크루 만들기</Button>
        </ScrollView>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalPosition: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: "white",
    zIndex: 20,
    maxHeight: 616,
  },
  modalContainer: {
    padding: 24,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    zIndex: 20,  
    gap: 16,
  },
  modalTitle: {
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 28,
    color: "#000000",
    marginBottom: 24,
  },
});
