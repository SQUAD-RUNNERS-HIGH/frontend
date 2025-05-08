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
import { useEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import { useLocation } from "@/app/_hooks/useLocation";
import { fetchPersonRanks } from "@/app/(tabs)/map/_lib/fetchPersonRanks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useCourseStore } from "@/store/useCourseStore";

export function SelectCompetitor() {
  const [selectedId, setSelectedId] = useState<string>("");
  const selectedCourse = useCourseStore(state => state.selectedCourse);
  const {runningInfo, setRunningInfo} = useRunningStore(useShallow((state) => ({
    runningInfo:state.runningInfo,
    setRunningInfo: state.setRunningInfo
  })))
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["personalRanks", selectedCourse],
      queryFn: fetchPersonRanks,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
    });
  const seen = new Set();
  const competitors =
    data?.pages
      .flatMap((page) => page?.items.personalRunningTimes)
      .filter((item) => {
        if (item.userName === "러너스하이") return false;
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
            isFetchingNextPage ? (
              <ActivityIndicator style={{ margin: 20 }} />
            ) : null
          }
          renderItem={({ item: competitor }) => (
            <>
              {competitor.userName === "러너스하이" ? (
                <View></View>
              ) : (
                <View style={styles.competitor}>
                  <Text style={styles.name}>{competitor.userName}</Text>
                  <View style={styles.checkContainer}>
                    <Text style={styles.name}>{competitor.runningTime}</Text>
                    <Checkbox
                      style={styles.checkBox}
                      value={selectedId === competitor.historyId}
                      onValueChange={() => {
                        if (selectedId === competitor.historyId) {
                          setSelectedId("");
                        } else {
                          setSelectedId(competitor.historyId);
                        }
                      }}
                    />
                  </View>
                </View>
              )}
            </>
          )}
        />
      )}
      {competitors.length > 0 && (
        <View style={styles.buttonContainer}>
          <Button
            style={{ flex: 1 }}
            onPress={() => {
              if (selectedId) setRunningInfo(selectedId);
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
