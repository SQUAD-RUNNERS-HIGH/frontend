import Button from "@/component/Button";
import { ProtectedRoute } from "@/component/ProtectedRoute";
import { useAuthStore } from "@/store/useAuthStore";
import { StyleSheet, View, Text } from "react-native";

export default function Index() {
  const logout = useAuthStore(state => state.logout);
  return (<ProtectedRoute isAuthPage={false}>
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>프로필 정보</Text>
        <View style={[styles.row, { marginTop: 8 }]}>
          <Text style={styles.leftText}>나이</Text>
          <Text style={styles.rightText}>28세</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.leftText}>성별</Text>
          <Text style={styles.rightText}>남성</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.leftText}>몸무게</Text>
          <Text style={styles.rightText}>75kg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.leftText}>BMI</Text>
          <Text style={styles.rightText}>23.5</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.leftText}>키</Text>
          <Text style={styles.rightText}>180cm</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => {}} style={styles.button}>프로필 수정</Button>
          <Button onPress={async () => { await logout() }} style={styles.button}>로그아웃</Button>
        </View>
      </View>
    </View>
  </ProtectedRoute>)
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 13,
    borderBottomWidth: 1,
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
  buttonContainer: {
    marginTop: 8,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
  }
})