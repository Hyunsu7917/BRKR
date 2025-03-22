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

export default function CPPDetailScreen() {
  const navigation = useNavigation();
  const { selections } = useSelection();
  const cppAccArray = selections["CPPAcc"] || [];

  const [cppAccDataList, setCppAccDataList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCPPAccData = async () => {
      try {
        const auth = "Basic " + btoa("BBIOK:Bruker_2025");

        const requests = cppAccArray.map((item) =>
          fetch(`https://brkr-server.onrender.com/excel/CPPAcc/${encodeURIComponent(item)}`, {
            headers: { Authorization: auth },
          }).then((res) => res.json())
        );

        const results = await Promise.all(requests);
        setCppAccDataList(results);
      } catch (err) {
        setError("데이터를 불러오는 중 오류 발생: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (cppAccArray.length > 0) {
      fetchAllCPPAccData();
    } else {
      setLoading(false);
    }
  }, [cppAccArray]);

  const renderTable = (data, index) => {
    return (
      <View key={index} style={styles.table}>
        {Object.entries(data).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.cellHeader}>{key}</Text>
            <Text style={styles.cell}>{value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CPP 정보</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : cppAccArray.length === 0 ? (
        <Text>CPP Acc 선택 항목이 없습니다.</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView>
          {cppAccDataList.map((data, idx) => renderTable(data, idx))}
        </ScrollView>
      )}

      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <Text>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("CRPDetailScreen")}
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
    backgroundColor: "#f6f6f6",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  table: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cellHeader: {
    flex: 1,
    padding: 10,
    backgroundColor: "#eee",
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
    padding: 10,
  },
  error: {
    color: "red",
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
