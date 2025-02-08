import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../_component/FormInput";
import Button from "../_component/Button";
export const signUpSchema = z.object({
  username: z.string().min(2, "아이디는 최소 2글자여야 합니다."),
  password: z.string().min(8, "비밀번호는 최소 8글자여야합니다"),
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
          <View>
            <Text style={styles.title}>로그인</Text>

            <View style={styles.formContainer}>
              <FormInput
                control={control}
                errorMessage={errors.username?.message}
                name="username"
                label="아이디"
                placeholder="아이디를 입력하세요"
                hideError
              />
              <FormInput
                control={control}
                errorMessage={errors.password?.message}
                name="password"
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력하세요"
                hideError
              />
            </View>
          </View>
          <View style={styles.buttonview}>
            <Button
              onPress={() => {
                console.log(isValid);
              }}
            >
              로그인
            </Button>
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
    justifyContent: "space-between",
    minHeight: "100%",
    backgroundColor: "#ffffff",
    paddingTop: 32,
    paddingBottom: 76,
  },
  title: {
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
    maxWidth: 500,
    marginTop: 40,
    marginBottom: 24,
  },
});
