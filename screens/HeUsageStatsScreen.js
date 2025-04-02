import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { format } from 'date-fns';

const HeUsageStatsScreen = () => {
  const insets = useSafeAreaInsets();
  const [heliumData, setHeliumData] = useState([]);
  const [startMonth, setStartMonth] = useState('2025-01');
  const [endMonth, setEndMonth] = useState('2025-04');
  const [monthlyTotals, setMonthlyTotals] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedData, setSelectedData] = useState([]);

  useEffect(() => {
    fetchHeliumData();
  }, []);

  useEffect(() => {
    if (heliumData.length > 0) {
      computeMonthlyTotals();
    }
  }, [heliumData, startMonth, endMonth]);

  const fetchHeliumData = async () => {
    try {
      const res = await axios.get('https://brkr-server.onrender.com/api/helium');
      setHeliumData(res.data);
    } catch (error) {
      console.error('불러오기 실패', error);
    }
  };

  const computeMonthlyTotals = () => {
    const filtered = heliumData.filter(entry => {
      const date = entry['충진일'];
      return date >= `${startMonth}-01` && date <= `${endMonth}-31`;
    });

    const map = {};
    filtered.forEach(entry => {
      const key = `${entry['고객사']}_${entry['지역']}_${entry['Magnet']}`;
      const ts = new Date(entry.Timestamp);
      if (!map[key] || ts > new Date(map[key].Timestamp)) {
        map[key] = entry;
      }
    });

    const totals = {};
    Object.values(map).forEach(entry => {
      const month = entry['충진일'].slice(0, 7);
      if (!totals[month]) totals[month] = 0;
      totals[month] += Number(entry['사용량']) || 0;
    });

    const sorted = Object.entries(totals).sort().map(([month, usage]) => ({ month, usage }));
    setMonthlyTotals(sorted);
  };

  const handleSelectMonth = (month) => {
    const records = heliumData.filter(
      entry => typeof entry['충진일'] === 'string' && entry['충진일'].startsWith(month)
    );    
    const map = new Map();
    records.forEach(entry => {
      const key = `${entry['고객사']}_${entry['지역']}_${entry['Magnet']}`;
      const ts = new Date(entry.Timestamp);
      if (!map.has(key) || ts > new Date(map.get(key).Timestamp)) {
        map.set(key, entry);
      }
    });
    setSelectedMonth(month);
    setSelectedData(Array.from(map.values()));
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.header}>월별 헬륨 사용량 통계</Text>

      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={startMonth} onChangeText={setStartMonth} />
        <TextInput style={styles.input} value={endMonth} onChangeText={setEndMonth} />
      </View>

      <Text style={styles.subTitle}>📊 월별 총 사용량</Text>
      {monthlyTotals.map((item, idx) => (
        <TouchableOpacity key={idx} onPress={() => handleSelectMonth(item.month)}>
          <Text style={styles.monthItem}>• {item.month}: {item.usage} ℓ</Text>
        </TouchableOpacity>
      ))}

      {selectedMonth !== '' && (
        <View style={styles.recordsBox}>
          <Text style={styles.selectedMonth}>📅 {selectedMonth} 사용 기록</Text>
          <Text style={{ marginBottom: 8 }}>총 {selectedData.length}건</Text>
          {selectedData.map((entry, idx) => (
            <View key={idx} style={styles.recordItem}>
              <Text style={styles.customer}>{entry['고객사']}</Text>
              <Text>{entry['지역']} / {entry['Magnet']}</Text>
              <Text>충진일: {entry['충진일']}</Text>
              <Text>사용량: {entry['사용량']} ℓ</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default HeUsageStatsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { fontSize: 18, fontWeight: 'bold', marginVertical: 16 },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 10, borderColor: '#ccc' },
  subTitle: { marginBottom: 8, fontWeight: 'bold' },
  monthItem: { paddingVertical: 4 },
  recordsBox: { marginTop: 16 },
  selectedMonth: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  recordItem: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  customer: { fontWeight: 'bold' }
});
