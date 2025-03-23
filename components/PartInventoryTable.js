import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PartInventoryTable({ data = [] }) {
  const headers = ["Part#", "Serial #", "PartName", "Remark", "사용처"];

  return (
    <View style={styles.tableContainer}>
      <View style={[styles.row, styles.headerRow]}>
        {headers.map((header, i) => (
          <Text key={i} style={[styles.cell, styles.headerCell]}>
            {header}
          </Text>
        ))}
      </View>

      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          <Text style={styles.cell}>{row["Part#"]}</Text>
          <Text style={styles.cell}>{row["Serial #"]}</Text>
          <Text style={styles.cell}>{row["PartName"]}</Text>
          <Text style={styles.cell}>{row["Remark"]}</Text>
          <Text style={styles.cell}>{row["사용처"]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerRow: {
    backgroundColor: "#f2f2f2",
  },
  cell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontSize: 13,
  },
  headerCell: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
