import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import Button from "../Button";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Checkbox from "expo-checkbox";

interface competitor {
  id: number;
  name: string;
  time: string;
}
export function SelectedModal() {
  const [competitors, setCompetitors] = useState<competitor[]>([
    { id: 1, name: "김소연", time: "2:35" },
    { id: 2, name: "박민준", time: "2:45" },
    { id: 3, name: "이서현", time: "2:50" },
    { id: 4, name: "정우성", time: "2:30" },
    { id: 5, name: "최지훈", time: "2:55" },
    { id: 6, name: "한예진", time: "2:40" },
    { id: 7, name: "오민서", time: "2:38" },
    { id: 8, name: "김도윤", time: "2:48" },
    { id: 9, name: "박지우", time: "2:33" },
    { id: 10, name: "이하은", time: "2:52" },
  ]);
  const [selectedId, setSelectedId] = useState<number>(0);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Pressable style={styles.backButton}>
            <Ionicons name="arrow-back" size={18} color="black" />
          </Pressable>
          <Text style={styles.title}>경쟁자 선택</Text>
        </View>
        <ScrollView style = {styles.competitorContainer} contentContainerStyle = {{gap:16}}>
          {competitors?.map((competitor) => (
            <View style={styles.competitor} key={competitor.id}>
              <Text style={styles.name}>{competitor.name}</Text>
              <View style={styles.checkContainer}>
                <Text style={styles.name}>{competitor.time}</Text>
                <Checkbox
                  style={styles.checkBox}
                  value={selectedId === competitor.id}
                  onValueChange={() => {
                    if (selectedId === competitor.id) {
                      setSelectedId(-1);
                    } else {
                      setSelectedId(competitor.id);
                    }
                  }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button style={{ flex: 1 }} onPress={() => {}}>
            시작 하기
          </Button>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: "center",
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translate(0,-50%)",
  },
  title: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: 600,
  },
  competitorContainer: {
    width: "100%",
    minHeight: 61,
    maxHeight: 228,
    height: '100%',
    flexDirection: "column",
    marginTop: 20,
  },
  competitor: {
    padding: 12,
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
  },
  name: {
    fontFamily: "Roboto",
    fontSize: 14,
    lineHeight: 21,
  },
  checkContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  checkBox: {
    padding: 0,
    width: 20,
    height: 20,
  },
  buttonContainer: {
    width: "100%",
    padding:8,
    marginTop:20,
  },
});
