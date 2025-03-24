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
          fetch(`https://brkr-server.onrender.com/excel/CPPAcc/value/${encodeURIComponent(item)}`, {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
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
            {cppAccDataList.map((data, idx) => (
              <View key={idx} style={styles.tableSection}>
                <Text style={styles.sectionTitle}>CPPAcc 정보 {idx + 1}</Text>
                <TableView data={data} />
              </View>
            ))}
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
    textAlign: "center",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
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
