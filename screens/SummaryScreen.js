import React, { useContext } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelection } from "../context/SelectionContext";


export default function SummaryScreen() {
  const navigation = useNavigation();
  const { selections } = useSelection(); 


  const categories = [
    "Magnet", "Console", "Autosampler", "Accessories", "Utilities",
    "Probe", "CPP", "CPPAcc", "CRP", "CRPAcc", "HeTransferline"
  ];

  const renderValue = (value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return "- 없음 -";
    return Array.isArray(value) ? value.join(", ") : value;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summary</Text>
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.headerCell]}>항목</Text>
          <Text style={[styles.cell, styles.headerCell]}>선택 내용</Text>
        </View>
        {categories.map((key) => (
          <View key={key} style={styles.tableRow}>
            <Text style={styles.cell}>{key}</Text>
            <Text style={styles.cell}>{renderValue(selections[key])}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.goBack()}
        >
          <Text>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("ItemDetailScreen")}
        >
          <Text>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    maxHeight: 350,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0A5D7C",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
  },
  headerCell: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  navButton: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
});
