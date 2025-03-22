import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelection } from "../context/SelectionContext";
import TableView from "@/components/TableView";
import { SafeAreaView } from "react-native-safe-area-context";

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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Console 및 Autosampler 정보</Text>
        <ScrollView>
          {consoleData && (
            <View style={styles.tableSection}>
              <Text style={styles.sectionTitle}>Console 정보</Text>
              <TableView data={consoleData} />
            </View>
          )}

          {autosamplerData && (
            <View style={styles.tableSection}>
              <Text style={styles.sectionTitle}>Autosampler 정보</Text>
              <TableView data={autosamplerData} />
            </View>
          )}
        </ScrollView>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CPPDetailScreen")}
          >
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
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
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
