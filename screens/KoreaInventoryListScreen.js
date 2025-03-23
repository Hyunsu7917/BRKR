import React, { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import PartInventoryTable from "@/components/PartInventoryTable";

export default function KoreaInventoryListScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get("https://brkr-server.onrender.com/excel/part/all", {
          auth: {
            username: "BBIOK",
            password: "Bruker_2025",
          },
        });

        // ✅ 필요한 열만 추려내기
        const parsed = response.data.map((item) => ({
          "Part#": item["Part#"] || "",
          "Serial #": item["Serial #"] || "",
          "PartName": item["PartName"] || "",
          "Remark": item["Remark"] || "",
          "사용처": item["사용처"] || "",
        }));

        setData(parsed);
      } catch (err) {
        console.error("불러오기 실패:", err);
      }
    };

    fetchInventory();
  }, []);

  const headers = ["Part#", "Serial #", "PartName", "Remark", "사용처"];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>국내 재고 리스트</Text>
      <ScrollView horizontal>        
        <PartInventoryTable data={data} />        
      </ScrollView>
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
