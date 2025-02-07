import React from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  return (
    // <>
    <LinearGradient
      colors={['#8A2BE2', '#4169E1']} // 색상 배열
      start={{ x: 0, y: 0 }} // 시작 지점 (왼쪽 상단)
      end={{ x: 1, y: 1 }} // 끝 지점 (오른쪽 하단)
      style={styles.rootContainer}
    >
      <View style = {styles.container}>
        <Image source={require('../assets/images/logo.png')}/>
        <Text style = {styles.text}>Runner's High</Text>
      </View>
     </LinearGradient>
    // </>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    // fontVariant: ['kern'],
  },
  container: {
    flexDirection: 'column',
    gap: '65px',
    alignItems:'center',
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 36,
    textAlign: 'center',
    letterSpacing: 0,
    color: '#FFFFFF',
  }

})