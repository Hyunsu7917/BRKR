import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Alert } from 'react-native';



export default function KoreaUsageRecordScreen({ route, navigation }) {
  // ✅ selectedPart 방어 처리
  const { selectedPart = {} } = route.params || {};
  const initialRemark = selectedPart["Remark"] || "";
  const initialUsageNote = selectedPart["사용처"] || ""; // ✅ 요거!

  if (!selectedPart) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>잘못된 접근입니다. 목록에서 항목을 선택해주세요.</Text>
      </SafeAreaView>
    );
  }

  const [remark, setRemark] = useState(initialRemark);
  const [usageNote, setUsageNote] = useState(initialUsageNote);

  const handleSave = async () => {
    const usageData = {
      "Part#": selectedPart['Part#'],
      "Serial #": selectedPart['Serial #'],
      "PartName": selectedPart['PartName'],
      "Remark": remark,
      "UsageNote": usageNote,
      "Timestamp": new Date().toISOString(),
    };
  
    try {
      await axios.post(
        'https://brkr-server.onrender.com/api/update-part-excel',
        usageData,
        {
          auth: {
            username: "BBIOK",
            password: "Bruker_2025",
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      Alert.alert("✅ 저장 완료", "사용 기록이 저장되었습니다.");
      navigation.goBack();
    } catch (err) {
      console.error("❌ 저장 실패:", err);
      Alert.alert("❌ 저장 실패", "서버에 기록을 저장하지 못했습니다.");
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>국내 재고 사용 기록</Text>

      <ScrollView>
        <View style={styles.field}>
          <Text style={styles.label}>파트 번호</Text>
          <Text style={styles.readonly}>{selectedPart['Part#']}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>시리얼 번호</Text>
          <Text style={styles.readonly}>{selectedPart['Serial #']}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>파트명</Text>
          <Text style={styles.readonly}>{selectedPart['PartName']}</Text>
        </View>
        

        <View style={styles.field}>
          <Text style={styles.label}>Remark (최대 100자)</Text>
          <TextInput
            value={remark}
            onChangeText={setRemark}
            maxLength={100}
            multiline
            placeholder="사용여부를 기록해주세요."
            style={styles.textarea}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>사용처 (최대 100자)</Text>
          <TextInput
            value={usageNote}
            onChangeText={setUsageNote}
            maxLength={100}
            multiline
            placeholder="사용처를 입력하세요"
            style={styles.textarea}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonRow}>
        <Button title="이전" onPress={() => navigation.goBack()} />
        <Button title="홈" onPress={() => navigation.navigate("HomeScreen")} />
        <Button title="저장" onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  field: { marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  readonly: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
