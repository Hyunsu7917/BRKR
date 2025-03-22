import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useSelection } from "../context/SelectionContext";

const API_BASE = "https://brkr-server.onrender.com/excel";

export default function ItemDetailScreen() {
  const navigation = useNavigation();
  const { selections } = useSelection();

  const [sheet, setSheet] = useState("Magnet"); // 첫 화면은 Magnet
  const [value, setValue] = useState(selections.Magnet); // 선택된 값
  const [data, setData] = useState({});
  const [headers, setHeaders] = useState([]);

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
        setHeaders(Object.keys(res.data));
      } catch (err) {
        console.log("🔴 Error fetching data:", err.message);
      }
    };

    fetchData();
  }, [sheet, value]);

  const renderTable = () => {
    return headers.map((key) => (
      <View key={key} style={styles.row}>
        <Text style={styles.cellHeader}>{key}</Text>
        <Text style={styles.cellValue}>{data[key]}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>항목별 정보 ({sheet})</Text>
      <ScrollView style={styles.table}>{renderTable()}</ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ConsoleAndAutosamplerScreen")}>
          <Text>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 12,
    },
    table: {
      backgroundColor: "#f2f2f2",
      borderRadius: 8,
    },
    row: {
      flexDirection: "row",
      padding: 10,
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    cellHeader: {
      flex: 1,
      fontWeight: "bold",
    },
    cellValue: {
      flex: 2,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    button: {
      padding: 12,
      backgroundColor: "#ddd",
      borderRadius: 6,
      width: 100,
      alignItems: "center",
    },
  });
  