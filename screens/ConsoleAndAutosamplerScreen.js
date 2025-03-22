import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelection } from "../context/SelectionContext";

export default function ConsoleAndAutosamplerScreen() {
  const navigation = useNavigation();
  const { selections } = useSelection();
  const [consoleData, setConsoleData] = useState(null);
  const [autosamplerData, setAutosamplerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = "Basic " + btoa("BBIOK:Bruker_2025");

        const [consoleRes, autosamplerRes] = await Promise.all([
          fetch(`https://brkr-server.onrender.com/excel/Console/${selections.Console}`, {
            headers: { Authorization: auth },
          }),
          fetch(`https://brkr-server.onrender.com/excel/Autosampler/${selections.Autosampler}`, {
            headers: { Authorization: auth },
          }),
        ]);

        const [consoleJson, autosamplerJson] = await Promise.all([
          consoleRes.json(),
          autosamplerRes.json(),
        ]);

        setConsoleData(consoleJson);
        setAutosamplerData(autosamplerJson);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selections]);

  const renderTable = (title, data) => {
    if (!data) return null;

    return (
      <View style={styles.tableSection}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.table}>
          {Object.entries(data).map(([key, value]) => (
            <View key={key} style={styles.row}>
              <Text style={[styles.cell, styles.key]}>{key}</Text>
              <Text style={styles.cell}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Console 및 Autosampler 정보</Text>
      <ScrollView>
        {renderTable("Console 정보", consoleData)}
        {renderTable("Autosampler 정보", autosamplerData)}
      </ScrollView>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("NextScreen")}
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
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  tableSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
  key: {
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
});
