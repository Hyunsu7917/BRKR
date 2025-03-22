import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelection } from "../context/SelectionContext";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Summary</Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.headerCell]}>항목</Text>
            <Text style={[styles.cell, styles.headerCell]}>선택 내용</Text>
          </View>

          <ScrollView style={{ flexGrow: 0 }}>
            {categories.map((key) => (
              <View key={key} style={styles.row}>
                <Text style={[styles.cell, styles.keyCell]}>{key}</Text>
                <Text style={styles.cell}>{renderValue(selections[key])}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
            <Text>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("ItemDetailScreen")}>
            <Text>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
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
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#0A5D7C",
    color: "#fff",
    textAlign: "center",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    padding: 12,
    backgroundColor: "#ccc",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});
