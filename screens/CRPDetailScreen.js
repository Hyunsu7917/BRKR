import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelection } from "../context/SelectionContext";

export default function CRPDetailScreen() {
  const navigation = useNavigation();
  const { selections } = useSelection();
  const [crpDataList, setCrpDataList] = useState([]);
  const [heTransData, setHeTransData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = "Basic " + btoa("BBIOK:Bruker_2025");

        // CRPAcc 데이터를 순차적으로 요청
        const crpPromises = selections.CRPAcc.map((acc) =>
          fetch(
            `https://brkr-server.onrender.com/excel/CRPAcc/${encodeURIComponent(acc)}`,
            { headers: { Authorization: auth } }
          ).then((res) => res.json())
        );

        const crpResults = await Promise.all(crpPromises);
        setCrpDataList(crpResults);

        // HeTransferline은 단일 값만 요청
        const heTransRes = await fetch(
          `https://brkr-server.onrender.com/excel/HeTransferline/${encodeURIComponent(
            selections.HeTrans
          )}`,
          { headers: { Authorization: auth } }
        );
        const heTransJson = await heTransRes.json();
        setHeTransData(heTransJson);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderTable = (data, title) => (
    <View style={styles.section}>
      <Text style={styles.subtitle}>{title}</Text>
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CRP 정보</Text>

      {error && <Text style={styles.error}>Error: {error}</Text>}

      {crpDataList.map((data, index) =>
        data.error ? (
          <Text style={styles.error} key={`error-${index}`}>{data.error}</Text>
        ) : (
          <View key={`crp-${index}`}>
            {renderTable(data, `CRP Acc 정보 ${index + 1}`)}
          </View>
        )
      )}


      {heTransData && !heTransData.error &&
        renderTable(heTransData, "He Transferline 정보")}

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.goBack()}
        >
          <Text>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text>Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 6,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  cell: {
    flex: 1,
    padding: 10,
  },
  keyCell: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
});
