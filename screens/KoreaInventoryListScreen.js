import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, StyleSheet, View, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import PartInventoryTable from "@/components/PartInventoryTable";

export default function KoreaInventoryListScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const ts = Date.now(); // 캐시 방지용 쿼리 파라미터
      const res = await axios.get(`https://brkr-server.onrender.com/excel/part/all?ts=${ts}`, {
        auth: {
          username: "BBIOK",
          password: "Bruker_2025",
        },
      });

      setData(res.data);
    } catch (err) {
      console.error("❌ 불러오기 실패:", err?.response?.data || err.message);
      Alert.alert("불러오기 실패", "서버로부터 재고 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>국내 재고 리스트</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 30 }} />
      ) : (
        <ScrollView horizontal>
          <ScrollView 
            style={{ maxHeight: 600 }} 
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <PartInventoryTable data={data} />
          </ScrollView>
        </ScrollView>

      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
});
