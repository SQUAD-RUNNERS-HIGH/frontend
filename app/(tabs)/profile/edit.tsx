import Button from "@/component/Button";
import FormInput from "@/component/FormInput";
import { ProtectedRoute } from "@/component/ProtectedRoute";
import { calculateBMI } from "@/lib/profile";
import { fetchProfile } from "@/lib/profile/fetchProfile";
import { fetchProfileEdit } from "@/lib/profile/fetchProfileEdit";
import { profileSchema } from "@/lib/profile/profileSchema";
import { useAlertStore } from "@/store/useAlertStore";
import { useAuthStore } from "@/store/useAuthStore";
import { UserProfile } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import z from "zod";
export default function ProfileEditScreen() {
  const { data } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: () =>
      fetchProfile()
  })
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      age: data?.physical.age,
      gender: data?.physical.gender,
      weight: data?.physical.weight,
      height: data?.physical.height,
      userLocation: data?.userLocation,
    }
  });
  const showAlert = useAlertStore(state => state.showAlert);
  async function onSubmit(data: z.infer<typeof profileSchema>) {
    const apiData = {physical: {age: data.age, gender: data.gender, weight: data.weight, height: data.height}, userLocation: data.userLocation }
    const response = await fetchProfileEdit(apiData);
    if (response?.status === 200) {
      showAlert({ title: '프로필 수정 완료', description: '프로필을 수정 했습니다!' });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      router.push('/profile');
    }
  }
  return (
    <ProtectedRoute isAuthPage={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        contentContainerStyle={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.box}>
            <FormInput
              control={control}
              errorMessage={errors.age?.message}
              name="age"
              type="number"
              label="나이"
              placeholder="나이를 입력해주세요"
            />
            <FormInput
              control={control}
              errorMessage={errors.gender?.message}
              name="gender"
              label="성별"
              placeholder="성별을 입력해주세요"
              isRadio
            />
            <FormInput
              control={control}
              errorMessage={errors.weight?.message}
              name="weight"
              type="number"
              label="몸무게"
              placeholder="몸무게를 입력해주세요"
            />
            <FormInput
              control={control}
              errorMessage={errors.height?.message}
              name="height"
              type="number"
              label="키"
              placeholder="키를 입력해주세요"
            />
            <FormInput
              control={control}
              errorMessage={errors.userLocation?.message}
              name="userLocation"
              label="위치"
              isLocationInput
              placeholder="위치를 입력해주세요"
            />
            <View style={styles.buttonContainer}>
              <Button onPress={handleSubmit(onSubmit)} style={styles.button}>프로필 수정</Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ProtectedRoute>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  box: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 380,
    padding: 24,
    gap: 16,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
    color: '#6500A8',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 13,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 2,
    borderStyle: 'solid',
    borderColor: '#E5E7EB',
  },
  leftText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#4B5563',
  },
  rightText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 500,
    color: '#000000',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 8,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
  }
});
