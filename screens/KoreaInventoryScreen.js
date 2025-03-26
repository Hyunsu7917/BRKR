import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';



export default function KoreaInventoryScreen({ navigation }) {
  const [partNumber, setPartNumber] = useState('');
  const [partName, setPartName] = useState('');
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchInventory = async () => {
    if (!partNumber && !partName) {
      Alert.alert('검색어를 입력해주세요');
      return;
    }

    try {
      const searchValue = partNumber || partName;

      const res = await axios.get(
        `https://brkr-server.onrender.com/excel/part/value/${encodeURIComponent(searchValue)}`,
        {
          auth: {
            username: "BBIOK",
            password: "Bruker_2025"
          }
        }
      );

      const resultArray = Array.isArray(res.data) ? res.data : [res.data];

      const trimmed = resultArray.map((row) => ({
        'Part#': row['Part#'],
        'Serial #': row['Serial #'],
        'PartName': row['PartName'],
        'Remark': row['Remark'],
        '사용처': row['사용처']
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
      <TouchableOpacity
        key={`${row['Part#']}_${row['Serial #']}_${index}`}
        onPress={() => setSelectedRow(row)}
        style={[
          styles.row,
          selectedRow === row && styles.selectedRow, // 선택 시 강조
        ]}
      >
        <Text style={styles.cell}>{row['Part#']}</Text>
        <Text style={styles.cell}>{row['Serial #']}</Text>
        <Text style={styles.cell}>{row['PartName']}</Text>
        <Text style={styles.cell}>{row['Remark']}</Text>
        <Text style={styles.cell}>{row['사용처']}</Text>
      </TouchableOpacity>
    ));
  };
  const downloadPartExcel = async () => {
    try {
      const uri = 'https://your-server.onrender.com/excel/part/download';
      const fileUri = FileSystem.documentDirectory + 'Part.xlsx';
  
      const downloadRes = await FileSystem.downloadAsync(uri, fileUri);
      console.log('📥 다운로드 성공:', downloadRes.uri);
  
      Alert.alert("✅ 동기화 완료", "최신 Part.xlsx가 로컬에 저장되었습니다.");
    } catch (error) {
      console.error('❌ 다운로드 오류:', error);
      Alert.alert("에러", "파일 다운로드에 실패했습니다.");
    }
  };
  const triggerServerSync = async () => {
    try {
      const res = await axios.post("https://brkr-server.onrender.com/api/trigger-local-update");
      Alert.alert("✅", "로컬 엑셀 동기화 완료!");
    } catch (err) {
      Alert.alert("❌", "로컬 엑셀 동기화 실패!");
    }
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
        <Button
          title="동기화!"
          onPress={async () => {
            await downloadPartExcel();     // 1️⃣ 파일 다운로드
            await triggerServerSync();     // 2️⃣ 서버에서 로컬 파일 갱신
          }}
        />

      </View>

      <ScrollView style={{ marginTop: 10 }}>
        {data.length > 0 && (
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.header]}>Part#</Text>
            <Text style={[styles.cell, styles.header]}>Serial #</Text>
            <Text style={[styles.cell, styles.header]}>PartName</Text>
            <Text style={[styles.cell, styles.header]}>Remark</Text>
            <Text style={[styles.cell, styles.header]}>사용처</Text>
          </View>
        )}
        {renderTable()}
      </ScrollView>

      <View style={styles.bottomButtons}>
        <Button title="이전" onPress={() => navigation.goBack()} />
        <Button
          title="사용 기록"
          onPress={() => {
            if (!selectedRow) {
              Alert.alert("선택된 항목이 없습니다");
              return;
            }
            navigation.navigate('KoreaUsageRecordScreen', {
              selectedPart: selectedRow,
            });
          }}
        />
        
      </View>
     


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
  selectedRow: {
    backgroundColor: '#d0ebff',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  header: {
    fontWeight: 'bold',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
  },
  selectedRow: {
    backgroundColor: '#d0e8ff',
  },
});
