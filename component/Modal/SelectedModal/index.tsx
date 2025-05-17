import { StyleSheet, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SetStateAction } from "react";

import { SelectCompetitor } from "./SelectCompetitor";
import { SelectCrew } from "./SelectCrew";

export function SelectedModal({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: React.Dispatch<SetStateAction<string>>;
}) {
  return (
    <>
      <View style={styles.container}>
        <View style={[styles.titleContainer,theme === 'selectCrew' && {marginBottom:20}]}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              setTheme("info");
            }}
          >
            <Ionicons name="arrow-back" size={18} color="black" />
          </Pressable>
          <Text style={styles.title}>{theme === 'selectCrew'? '크루' :'경쟁자'} 선택</Text>
        </View>
        {theme === "selectCompetitor" && <SelectCompetitor />}
        {theme === "selectCrew" && <SelectCrew />}

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
    alignItems:'center',
    width: "100%",
    position: "relative",
    marginBottom:4,
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
    minHeight: 40,
    maxHeight: 220,
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
  noCompetitorContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 50,
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
    padding: 8,
    marginTop: 20,
  },
});
