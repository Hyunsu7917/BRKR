import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, StyleSheet, View, Alert, Button, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import PartInventoryTable from "@/components/PartInventoryTable";

export default function KoreaInventoryListScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const ts = Date.now(); // 캐시 방지용
      const [partRes, usageRes] = await Promise.all([
        axios.get(`https://brkr-server.onrender.com/excel/part/all?ts=${ts}`, {
          auth: {
            username: "BBIOK",
            password: "Bruker_2025",
          },
        }),
        axios.get("https://brkr-server.onrender.com/api/usage-json", {
          auth: {
            username: "BBIOK",
            password: "Bruker_2025",
          },
        }),
      ]);

      const usageMap = new Map();
      usageRes.data.forEach((item) => {
        const key = `${item["Part#"]}_${item["Serial #"]}`;
        usageMap.set(key, item);
      });

      const parsed = partRes.data.map((item) => {
        const key = `${item["Part#"]}_${item["Serial #"]}`;
        const usage = usageMap.get(key);
        return {
          "Part#": item["Part#"] || "",
          "Serial #": item["Serial #"] || "",
          "PartName": item["PartName"] || "",
          "Remark": usage?.Remark || item["Remark"] || "",
          "사용처": usage?.UsageNote || item["사용처"] || "",
        };
      });

      setData(parsed);
    } catch (err) {
      console.error("❌ 불러오기 실패:", err?.response?.data || err.message);
      Alert.alert("불러오기 실패", "서버로부터 재고 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ 서버 동기화 + 재조회 함수
  const handleServerSync = async () => {
    try {
      const res = await axios.post("https://brkr-server.onrender.com/api/sync-usage-to-excel", {}, {
        auth: {
          username: "BBIOK",
          password: "Bruker_2025",
        },
      });
      Alert.alert("✅ 동기화 완료", res.data?.message || "서버 업데이트 완료");

      // 동기화 완료 후 재조회
      fetchInventory();
    } catch (err) {
      console.error("❌ 서버 동기화 실패:", err);
      Alert.alert("❌ 동기화 실패", "서버 업데이트 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>국내 재고 리스트</Text>

      <View style={styles.syncButtonContainer}>
        <Button title="🔄 서버 동기화" onPress={handleServerSync} color="#007bff" />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 30 }} />
      ) : (
        <ScrollView horizontal>
          <PartInventoryTable data={data} />
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
  syncButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
});
