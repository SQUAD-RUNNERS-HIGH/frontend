import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";

const ProgressList = ({
  records,
}: {
  records: { name: string; progress: number }[];
}) => {
  return (
    <View style={styles.container}>
      {records?.map((record, index) => {
        const progress = Number(record?.progress.toFixed(2));
        return (
          <View key={index} style={styles.row}>
            <Text style={styles.name}>{record.name}</Text>
            <View style={styles.progressBar}>
              <ProgressBar
                progress={progress}
                color="#6200ee"
                style={styles.progressBar}
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
    padding: 16,
    gap: 12,
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
    fontSize: 16,
    minWidth: 100, // 이름 최소 너비 지정
  },
  progressBar: {
    flexGrow: 1, // 이게 핵심! 남은 공간 다 차지
    height: 16,
    borderRadius: 12,
    marginTop:1,
  },
});

export default ProgressList;
