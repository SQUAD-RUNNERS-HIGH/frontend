import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Platform,
  Alert,
} from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../../../component/FormInput";
import Button from "../../../component/Button";
import { loginSchema } from "../../../lib/login/loginSchema";
import { fetchLogin } from "../../../lib/login/fetchLogin";
import { useRouter } from "expo-router";
import { ProtectedRoute } from "@/component/ProtectedRoute";
import { useAuthStore } from "@/store/useAuthStore";

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
  const setAuth = useAuthStore(state => state.setAuth);
  const router = useRouter();
  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const response = await fetchLogin(data);
    if (response?.status === 200) {
      console.log(response?.data.data);
      await setAuth(
        response?.data.data
      );
      router.push("/map");
    }
  }
  return (
    <ProtectedRoute isAuthPage>
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
            <View style={styles.container}>
              <Text style={styles.title}>로그인</Text>
              <Image
                style={{ width: 111, height: 113, marginTop: 38 }}
                source={require("@/assets/images/logo.png")}
              />
              <View style={styles.formContainer}>
                <FormInput
                  control={control}
                  errorMessage={errors.loginId?.message}
                  name="loginId"
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
              <Button disabled={!isValid} onPress={handleSubmit(onSubmit)}>
                로그인
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ProtectedRoute>
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
  container: {
    width: "100%",
    alignItems: "center",
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
    marginTop: 85,
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
