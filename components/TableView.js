import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TableView({ data = {}, title = "" }) {
  return (
    <View style={styles.section}>
      {title ? <Text style={styles.subtitle}>{title}</Text> : null}
      <View style={styles.table}>
        {Object.entries(data).map(([key, value]) => (
          <View style={styles.row} key={key}>
            <Text style={[styles.cell, styles.keyCell]}>{key}</Text>
            <Text style={styles.cell}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  cell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
  },
  keyCell: {
    backgroundColor: "#f7f7f7",
    fontWeight: "bold",
  },
});
