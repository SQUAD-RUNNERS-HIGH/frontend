import Button from "@/component/Button";
import FormInput from "@/component/FormInput";
import { ProtectedRoute } from "@/component/ProtectedRoute";
import { profileSchema } from "@/lib/profile/profileSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import z from "zod";
export default function ProfileEditScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });
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
              <Button onPress={() => { }} style={styles.button}>프로필 수정</Button>

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
