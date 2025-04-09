import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Button from "../Button";
import { Ionicons } from "@expo/vector-icons";
import { SetStateAction, useEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import { useLocation } from "@/app/_hooks/useLocation";
import { fetchPersonRanks } from "@/app/(tabs)/map/_lib/fetchPersonRanks";
import { useInfiniteQuery } from "@tanstack/react-query";

interface competitor {
  historyId: string;
  userName: string;
  runningTime: string;
}
export function SelectedModal({
  setTheme,
}: {
  setTheme: React.Dispatch<SetStateAction<string>>;
}) {
  const [selectedId, setSelectedId] = useState<string>("");
  const { setRunning, selectedCourse } = useLocation();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['personalRanks', selectedCourse],
    queryFn: fetchPersonRanks,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
  const seen = new Set();
  const competitors =
    data?.pages
      .flatMap((page) => page.items.personalRunningTimes)
      .filter((item) => {
        if (seen.has(item.historyId)) return false;
        seen.add(item.historyId);
        return true;
      }) || [];
    const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              setTheme("info");
            }}
          >
            <Ionicons name="arrow-back" size={18} color="black" />
          </Pressable>
          <Text style={styles.title}>경쟁자 선택</Text>
        </View>
        {competitors.length === 0 ? (
          <View style={styles.noCompetitorContainer}>
            <Text>이전에 러닝을 했던 경쟁자가 없습니다.</Text>
          </View>
        ) : (
          <FlatList
          style={styles.competitorContainer}
          data={competitors}
          keyExtractor={(item) => item.historyId}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator style={{ margin: 20 }} /> : null
          }
          renderItem={({ item: competitor }) => (
            <View style={styles.competitor}>
              <Text style={styles.name}>{competitor.userName}</Text>
              <View style={styles.checkContainer}>
                <Text style={styles.name}>{competitor.runningTime}</Text>
                <Checkbox
                  style={styles.checkBox}
                  value={selectedId === competitor.historyId}
                  onValueChange={() => {
                    if (selectedId === competitor.historyId) {
                      setSelectedId('');
                    } else {
                      setSelectedId(competitor.historyId);
                    }
                  }}
                />
                </View>
              </View>
            )}
          />
        )}
        <View style={styles.buttonContainer}>
          <Button
            style={{ flex: 1 }}
            onPress={() => {
              setTheme("running");
              setRunning(selectedId);
            }}
          >
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
    paddingVertical: 32,
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
