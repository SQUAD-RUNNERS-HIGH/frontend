import { useLayoutStore } from "@/store/useLayoutStore";
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ProgressBar } from "react-native-paper";

const ProgressList = ({
  records,
}: {
  records: { name: string; progress: number; runningStatus: string }[];
}) => {
  const isSmall = useLayoutStore(state => state.isSmall);
  const smallProgress = isSmall || records.length>=3;
  const progressBarStyle = [styles.progressBar, smallProgress && {height:8}];
  console.log(records);
  return (
    <View style={[styles.container, smallProgress && {paddingVertical: 10,gap:2}]}>
      {records?.map((record, index) => {
        return (
          <View key={index} style={styles.row}>
            <Text style={[styles.name,smallProgress && {fontSize:12}]}>{record.name}</Text>
            <View style={progressBarStyle}>
              <ProgressBar
                progress={record.progress}
                color={`${record.runningStatus === 'ONGOING'? "#6200ee": "red"}`}
                style={progressBarStyle}
              />
            </View>
          </View>
        );
        
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    width: "100%",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  name: {
    fontSize: 14,
    minWidth: 100, // 이름 최소 너비 지정
  },
  progressBar: {
    flexGrow: 1,
    height: 10,
    borderRadius: 12,
    marginTop:1,
  },
});

export default ProgressList;
