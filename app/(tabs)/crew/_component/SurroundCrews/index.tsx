import Button from "@/app/_component/Button";
import { View, StyleSheet } from "react-native";
import Crew from "./Crew";
import { fetchSurroundCrews } from "../../_lib/fetchSurroundCrews";
import { useInfiniteQuery } from "@tanstack/react-query";

function SurroundCrews() {
   const { data: surroundCrews, } =
      useInfiniteQuery({
        queryKey: ["surroundCrews"],
        queryFn: fetchSurroundCrews,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage?.page+1,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
      });
      console.log(surroundCrews?.pages);
  const flatContents = surroundCrews?.pages?.flatMap((page) => page.data.content) ?? [];

  return (
    <View style = {styles.container}>
      {flatContents.map((crew,index) => (
        <Crew
          key={index}
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
