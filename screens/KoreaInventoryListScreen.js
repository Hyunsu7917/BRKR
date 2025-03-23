import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

export default function KoreaInventoryListScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get("https://brkr-server.onrender.com/excel/part/all", {
          auth: {
            username: "BBIOK",
            password: "Bruker_2025"
          }
        });
        setData(response.data); // ✅ 여기가 핵심!
      } catch (err) {
        console.error("불러오기 실패:", err);
      }
    };
  
    fetchInventory();
  }, []);  

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.cell}>Part#</Text>
        <Text style={styles.cell}>Serial #</Text>
        <Text style={styles.cell}>PartName</Text>
        <Text style={styles.cell}>Remark</Text>
        <Text style={styles.cell}>사용처</Text>
      </View>
      {data.map((row, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{row["Part#"]}</Text>
          <Text style={styles.cell}>{row["Serial #"]}</Text>
          <Text style={styles.cell}>{row["PartName"]}</Text>
          <Text style={styles.cell}>{row["Remark"]}</Text>
          <Text style={styles.cell}>{row["사용처"]}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 6,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
});
