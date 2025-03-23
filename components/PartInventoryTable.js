import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function PartInventoryTable({ data }) {
  return (
    <ScrollView horizontal>
      <View style={styles.tableContainer}>
        {/* Header */}
        <View style={[styles.row, styles.headerRow]}>
          <View style={[styles.cell, styles.partCell]}>
            <Text style={styles.headerText}>Part#</Text>
          </View>
          <View style={[styles.cell, styles.serialCell]}>
            <Text style={styles.headerText}>Serial #</Text>
          </View>
          <View style={[styles.cell, styles.nameCell]}>
            <Text style={styles.headerText}>PartName</Text>
          </View>
          <View style={[styles.cell, styles.remarkCell]}>
            <Text style={styles.headerText}>Remark</Text>
          </View>
          <View style={[styles.cell, styles.usageCell]}>
            <Text style={styles.headerText}>사용처</Text>
          </View>
        </View>

        {/* Data Rows */}
        {data.map((row, index) => (
          <View key={index} style={styles.row}>
            <View style={[styles.cell, styles.partCell]}>
              <Text>{row["Part#"]}</Text>
            </View>
            <View style={[styles.cell, styles.serialCell]}>
              <Text>{row["Serial #"]}</Text>
            </View>
            <View style={[styles.cell, styles.nameCell]}>
              <Text>{row["PartName"]}</Text>
            </View>
            <View style={[styles.cell, styles.remarkCell]}>
              <Text>{row["Remark"]}</Text>
            </View>
            <View style={[styles.cell, styles.usageCell]}>
              <Text>{row["사용처"]}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    margin: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  partCell: {
    width: 80,
  },
  serialCell: {
    width: 60,
  },
  nameCell: {
    width: 100,
  },
  remarkCell: {
    width: 100,
  },
  usageCell: {
    width: 80,
  },
  headerRow: {
    backgroundColor: "#f2f2f2",
  },
  headerText: {
    fontWeight: "bold",
  },
});
