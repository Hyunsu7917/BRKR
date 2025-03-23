import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

export default function KoreaInventoryScreen({ navigation }) {
  const [partNumber, setPartNumber] = useState('');
  const [partName, setPartName] = useState('');
  const [data, setData] = useState([]);

  const fetchInventory = async () => {
    if (!partNumber && !partName) {
      Alert.alert('검색어를 입력해주세요');
      return;
    }

    try {
      const searchValue = partNumber || partName;

      const res = await axios.get(
        `https://brkr-server.onrender.com/excel/part/${encodeURIComponent(searchValue)}`,
        {
          auth: {
            username: "BBIOK",
            password: "Bruker_2025"
          }
        }
      );

      // 배열 형태 보장 + 필요한 필드만 추출
      const filtered = Array.isArray(res.data) ? res.data : [res.data];
      const trimmed = filtered.map(row => ({
        'Part#': row['Part#'],
        'Serial #': row['Serial #'],
        'PartName': row['PartName'],
        'Remark': row['Remark']
      }));

      setData(trimmed);
    } catch (err) {
      console.error('검색 실패:', err);
      Alert.alert('검색 결과 없음');
      setData([]);
    }
  };

  const renderTable = () => {
    return data.map((row, index) => (
      <View key={index} style={styles.row}>
        <Text style={styles.cell}>{row['Part#']}</Text>
        <Text style={styles.cell}>{row['Serial #']}</Text>
        <Text style={styles.cell}>{row['PartName']}</Text>
        <Text style={styles.cell}>{row['Remark']}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>국내 재고 조회</Text>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Part#"
          value={partNumber}
          onChangeText={setPartNumber}
          style={styles.input}
        />
        <TextInput
          placeholder="PartName"
          value={partName}
          onChangeText={setPartName}
          style={styles.input}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button title="리스트 보기" onPress={() => navigation.navigate('KoreaInventoryListScreen')} />
        <Button title="파트 조회" onPress={fetchInventory} />
      </View>

      <ScrollView style={{ marginTop: 10 }}>
        <View style={styles.headerRow}>
          <Text style={[styles.cell, styles.header]}>Part#</Text>
          <Text style={[styles.cell, styles.header]}>Serial #</Text>
          <Text style={[styles.cell, styles.header]}>PartName</Text>
          <Text style={[styles.cell, styles.header]}>Remark</Text>
        </View>
        {renderTable()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  header: {
    fontWeight: 'bold',
  },
});
