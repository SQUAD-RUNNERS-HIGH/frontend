import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Button from "../../Button";
import { useState } from "react";
import Checkbox from "expo-checkbox";
import { fetchPersonRanks } from "@/app/(tabs)/map/_lib/fetchPersonRanks";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchMyCrew } from "@/app/(tabs)/crew/_lib/fetchMyCrew";
import { useRunningStore } from "@/store/useRunningStore";
import { useCourseStore } from "@/store/useCourseStore";

export function SelectCrew() {
  const [selectedId, setSelectedId] = useState<string>("");
  const selectedCourse = useCourseStore(state => state.selectedCourse);
  const setRunningInfo = useRunningStore(state => state.setRunningInfo);
  const { data: myCrewResponse } =
    useQuery({
      queryKey: ["myCrew", selectedCourse],
      queryFn: fetchMyCrew,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
    });
  console.log(myCrewResponse);
  return (
    <>
      {myCrewResponse?.myCrews?.length === 0 ? (
        <View style={styles.noCompetitorContainer}>
          <Text>아직 크루가 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          style={styles.crewContainer}
          data={myCrewResponse?.myCrews}
          keyExtractor={(item) => item.crewId}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          onEndReachedThreshold={0.5}
          renderItem={({ item: crew }) => (
            <View style={styles.crew}>
              <Text style={styles.name}>{crew.crewName}</Text>
              <View style={styles.checkContainer}>
                <Checkbox
                  style={styles.checkBox}
                  value={selectedId === crew.crewId}
                  onValueChange={() => {
                    if (selectedId === crew.crewId) {
                      setSelectedId("");
                    } else {
                      setSelectedId(crew.crewId);
                    }
                  }}
                />
              </View>
            </View>
          )}
        />
      )}
      {myCrewResponse?.myCrews.length > 0 && (
        <View style={styles.buttonContainer}>
          <Button
            style={{ flex: 1 }}
            onPress={() => {
              if (selectedId) setRunningInfo(`${selectedId}`);
            }}
          >
            선택 하기
          </Button>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  competitorContainer: {
    width: "100%",
    minHeight: 40,
    maxHeight: 220,
    flexDirection: "column",
    marginTop: 20,
  },
  crew: {
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
