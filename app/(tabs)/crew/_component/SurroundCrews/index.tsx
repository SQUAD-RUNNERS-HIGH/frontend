import Button from "@/app/_component/Button";
import { View, StyleSheet, Text } from "react-native";
import Crew from "./Crew";
import { fetchSurroundCrews } from "../../_lib/fetchSurroundCrews";
import { useInfiniteQuery } from "@tanstack/react-query";

function SurroundCrews() {
  const { data: surroundCrews } = useInfiniteQuery({
    queryKey: ["surroundCrews"],
    queryFn: fetchSurroundCrews,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.page + 1,
    staleTime: 0,
    gcTime:0,
  });
  const flatContents =
    surroundCrews?.pages?.flatMap((page) => page.data.content) ?? [];
  console.log(flatContents);
  return (
    <View style={styles.container}>
      {flatContents.map((crew, index) => (
        <Crew
          key={index}
          id={crew.crewId}
          name={crew.name}
          description={crew.description}
          userCount={crew.userCount}
          userRole = {crew.userRole}
        />
      ))}
      {flatContents?.length === 0 && (
        <View
          style={styles.noCrewContainer}
        >
          <Text>주변에 크루가 없습니다.</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: 16,
    width: "100%",
  },
  noCrewContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
  },
});
export default SurroundCrews;
