import FormInput from "@/app/_component/FormInput";
import { SetStateAction } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { crewSchema } from "../_lib/crewSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/app/_component/Button";
import { useRouter } from "expo-router";
import { fetchCrewCreate } from "../_lib/fetchCrewCreate";
import { useQueryClient } from "@tanstack/react-query";

export function CreateCrewModal({
  modalVisible,
  setModalVisible,
}: {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<SetStateAction<boolean>>;
}) {
  const onSubmit = async (data: z.infer<typeof crewSchema>) => {
    const response = await fetchCrewCreate(data);
    if (response?.status === 200) {
      Alert.alert("크루가 생성되었습니다!");
      const queryClient = useQueryClient();
      queryClient.invalidateQueries({queryKey:['myCrew']});
      setModalVisible(false);
    }
  };
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch
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
        <FlatList
          data={[{ key: "form" }]} // FlatList에 필요한 데이터 구조
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.modalContainer}
          ListHeaderComponent={
            <Text style={styles.modalTitle}>새로운 크루 만들기</Text>
          }
          renderItem={() => (
            <View style={styles.formContainer}>
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
                type="number"
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
                errorMessage={errors.crewLocation?.message}
                name="crewLocation"
                label="활동 장소"
                placeholder="위치를 입력해주세요"
                isLocationInput
              />
              <Button
                style={{ marginTop: 6, width: "100%" }}
                onPress={handleSubmit(onSubmit)}
              >
                크루 만들기
              </Button>
            </View>
          )}
        />
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
  formContainer: {
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
