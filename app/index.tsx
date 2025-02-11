import { View, Text, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style = {styles.rootContainer}>
      <Text>index페이지</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    width:'100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
