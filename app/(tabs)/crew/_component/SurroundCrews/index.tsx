import Button from "@/app/_component/Button";
import { View, StyleSheet, Text } from "react-native";
import Crew from "./Crew";
import { useEffect, useState } from "react";
import { fetchSurroundCrews } from "../../_lib/fetchSurroundCrews";

function SurroundCrews() {
  const [surroundCrews,setSurroundCrews] = useState([]);
  useEffect(() => {
    const response = fetchSurroundCrews();
    response.then((data) => {setSurroundCrews(data)})
  },[])
  return (
    <View style = {styles.container}>
      {surroundCrews?.map((crew) => (
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
