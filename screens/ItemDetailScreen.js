import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useSelection } from "../context/SelectionContext";
import TableView from "@/components/TableView";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE = "https://brkr-server.onrender.com/excel";

export default function ItemDetailScreen() {
  const navigation = useNavigation();
  const { selections } = useSelection();

  const [sheet, setSheet] = useState("Magnet");
  const [value, setValue] = useState(selections.Magnet);
  const [data, setData] = useState({});

  useEffect(() => {
    if (!value || value === "없음") return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/${sheet}/${encodeURIComponent(value)}`, {
          auth: {
            username: "BBIOK",
            password: "Bruker_2025",
          },
        });
        setData(res.data);
      } catch (err) {
        console.log("🔴 Error fetching data:", err.message);
      }
    };

    fetchData();
  }, [sheet, value]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.title}>항목별 정보 ({sheet})</Text>

        <ScrollView style={{ marginBottom: 16 }}>
          <TableView data={data} />
        </ScrollView>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ConsoleAndAutosamplerScreen")}
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
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
