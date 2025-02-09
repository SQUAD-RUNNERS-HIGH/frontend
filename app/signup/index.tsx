import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import Input from "../_component/Input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioButton } from "react-native-paper";
import FormInput from "../_component/FormInput";
import Button from "../_component/Button";
import { useRouter } from "expo-router";
export const signUpSchema = z.object({
  username: z.string().min(2, "아이디는 최소 2글자여야 합니다."),
  password: z.string().min(8, "비밀번호는 최소 8글자여야합니다"),
  nickname: z
    .string()
    .min(2, "닉네임은 최소 2글자 여야 합니다.")
    .max(10, "닉네임은 10글자를 넘을 수 없습니다."),
  age: z.coerce
    .number({
      required_error: "나이를 입력해주세요.",
      invalid_type_error: "숫자만 입력 가능합니다.",
    })
    .positive("양수만 입력 가능합니다.")
    .int("정수만 입력 가능합니다."), // 문자열을 숫자로 변환,
  weight: z.coerce
    .number({
      required_error: "몸무게를 입력해주세요.",
      invalid_type_error: "숫자만 입력 가능합니다.",
    })
    .positive("양수만 입력 가능합니다.")
    .int("정수만 입력 가능합니다."), // 문자열을 숫자로 변환,
  gender: z.enum(["male", "female"]),
});
export default function Signup() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });
  const router = useRouter();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* keyboardShouldPersistTaps는 키보드가 열려있을 때도 동작가능하게 하는 것
contentContainerStyle는 키보드로 인해 화면이 다차지 하지않을 때 스크롤 발동하는 것 */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.rootContainer}>
          <Text style={styles.title}>회원가입</Text>

          <View style={styles.formContainer}>
            <FormInput
              control={control}
              errorMessage={errors.username?.message}
              name="username"
              label="아이디"
              placeholder="아이디를 입력하세요"
            />
            <FormInput
              control={control}
              errorMessage={errors.password?.message}
              name="password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
            />
            <FormInput
              control={control}
              errorMessage={errors.nickname?.message}
              name="nickname"
              label="닉네임"
              placeholder="2-10자 사이로 입력해주세요"
            />
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
              errorMessage={errors.weight?.message}
              name="weight"
              label="몸무게"
              type="number"
              placeholder="몸무게를 입력해주세요"
            />
            {/* 성별 */}
            <FormInput
              control={control}
              errorMessage={errors.gender?.message}
              isRadio
              name="gender"
              label="성별"
              placeholder="성별을 입력해주세요"
            />
            <View style={styles.buttonview}>
              <Button
                onPress={() => {
                  console.log(isValid);
                }}
              >
                회원가입
              </Button>
            </View>
            <View style={styles.loginContainer}>
                <Text>
                이미 계정이 있으신가요?
                </Text>
                <Pressable
                  onPress={() => {
                    router.push("/login");
                  }}
                >
                  <Text style={styles.loginButton}>로그인하기</Text>
                </Pressable>
              </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
    minHeight: "100%",
    backgroundColor: "#ffffff",
  },
  title: {
    marginTop: 32,
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
    textAlign: "center",
    letterSpacing: 0,
  },
  formContainer: {
    marginTop: 32,
    width: "100%",
    gap: 24,
    alignItems: "center",
  },
  buttonview: {
    width: "100%",
    marginTop: 40,
    marginBottom: 24,
  },
  loginContainer: {
    marginBottom: 32,
    color: "#4B5563",
    alignItems: "center",
    flexDirection: "row", // 버튼과 텍스트를 한 줄로 정렬
    gap:2,
  },
  loginButton: {
    color: "#000000",
    fontWeight: "500",
  },
});
