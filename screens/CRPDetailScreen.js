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
import TableView from "@/components/TableView"; // ✅ 테이블 컴포넌트 재사용

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

        // CRPAcc 다건 요청
        const crpPromises = selections.CRPAcc.map((acc) =>
          fetch(
            `https://brkr-server.onrender.com/excel/CRPAcc/${encodeURIComponent(acc)}`,
            { headers: { Authorization: auth } }
          ).then((res) => res.json())
        );
        const crpResults = await Promise.all(crpPromises);
        setCrpDataList(crpResults);

        // HeTransferline 단일 요청
        const heTransRes = await fetch(
          `https://brkr-server.onrender.com/excel/HeTransferline/${encodeURIComponent(selections.HeTrans)}`,
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
          <Text style={styles.error} key={`error-${index}`}>
            {data.error}
          </Text>
        ) : (
          <View key={`crp-${index}`} style={styles.tableSection}>
            <Text style={styles.sectionTitle}>CRP Acc 정보 {index + 1}</Text>
            <TableView data={data} />
          </View>
        )
      )}

      {heTransData && !heTransData.error && (
        <View style={styles.tableSection}>
          <Text style={styles.sectionTitle}>He Transferline 정보</Text>
          <TableView data={heTransData} />
        </View>
      )}

      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  tableSection: {
    marginBottom: 24,
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
    backgroundColor: "#ccc",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});
