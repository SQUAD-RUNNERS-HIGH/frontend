import { StyleSheet, View, Text } from "react-native";
import Button from "../Button";
import { SetStateAction } from "react";

export function RunningModal() {
  return (
    <>
      <View style={styles.infoContainer}>
        <View style = {styles.info}>
          <Text style = {styles.value}>00:45:32</Text>
          <Text style = {styles.key}>경과시간</Text>
        </View>
        <View style = {styles.info}>
        <Text style = {styles.value}>2.5 km</Text>
        <Text style = {styles.key}>남은 거리</Text>
        </View>
        <View style = {styles.info}>
        <Text style = {styles.value}>00:45:32</Text>
        <Text style = {styles.key}>5'23''</Text>
        </View>
      </View>
      <View style = {styles.buttonContainer}><Button onPress={() => {}}>종료하기</Button></View>
    </>
  );
}
const styles = StyleSheet.create({
  infoContainer: {
    width: '100%',
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  info: {
    alignItems: 'center',
    fontFamily: 'Roboto',
  },
  value: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  key: {
    fontSize: 14,
    color: '#4B5563',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
    marginTop: 16,
  }
});