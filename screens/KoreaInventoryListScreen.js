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
      const response = await axios.get(
        `https://brkr-server.onrender.com/excel/part/all?ts=${Date.now()}`,
        {
          auth: {
            username: "BBIOK",
            password: "Bruker_2025",
          },
        }
      );

      const usageRes = await axios.get("https://brkr-server.onrender.com/api/usage-json", {
        auth: {
          username: "BBIOK",
          password: "Bruker_2025",
        },
      });
      const usageMap = new Map();
      usageRes.data.forEach((item) => {
        const key = `${item["Part#"]}_${item["Serial #"]}`;
        usageMap.set(key, item);
      });

      const parsed = response.data.map((item) => {
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
      console.error("❌ 불러오기 실패:", err);
      Alert.alert("불러오기 실패", "재고 데이터를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleServerSync = async () => {
    try {
      setLoading(true);
      await axios.post(
        "https://brkr-server.onrender.com/api/sync-usage-to-excel",
        {},
        {
          auth: {
            username: "BBIOK",
            password: "Bruker_2025",
          },
        }
      );
      Alert.alert("서버 업로드 완료", "최신 데이터로 동기화되었습니다.");
      await fetchInventory();
    } catch (err) {
      console.error("❌ 서버 업로드 실패:", err);
      Alert.alert("서버 업로드 실패", "엑셀 파일 업데이트 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
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
