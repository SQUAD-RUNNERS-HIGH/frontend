import Button from "@/app/_component/Button";
import { View, StyleSheet, Text } from "react-native";
import Crew from "./Crew";

function SurroundCrews() {
  const surroundCrews = [
    {
      id: 1,
      name: "아침을 여는 러너들",
      userCount: 42,
      description: "매일 아침 6시 강남구 러닝 크루입니다. 초보자 도 환영!",
    },
    {
      id: 2,
      name: "위켄드 러너스",
      userCount: 38,
      description: "주말 오전 한강에서 함께 뛰어요!",
    },
  ];
  return (
    <View style = {styles.container}>
      {surroundCrews.map((crew) => (
        <Crew
          key={crew.id}
          id={crew.id}
          name={crew.name}
          description={crew.description}
          userCount={crew.userCount}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap:16,
    width: "100%",
  },
  
});
export default SurroundCrews;
