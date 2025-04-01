import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  StyleSheet
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const HeScheduleEditScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();

  const {
    date,
    고객사: initialCustomer = '',
    지역: initialRegion = '',
    Magnet: initialMagnet = ''
  } = route.params || {};

  const [selectedDate, setSelectedDate] = useState(() => {
    try {
      const parsed = new Date(date);
      return isNaN(parsed) ? new Date() : parsed;
    } catch {
      return new Date();
    }
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [period, setPeriod] = useState('');
  const [reservation, setReservation] = useState('Y');
  const [usageAmount, setUsageAmount] = useState('');
  const [formattedDate, setFormattedDate] = useState(format(selectedDate, 'yyyy-MM-dd'));

  useEffect(() => {
    setFormattedDate(format(selectedDate, 'yyyy-MM-dd'));
  }, [selectedDate]);

  const handleSave = async () => {
    try {
      const res = await fetch('https://brkr-server.onrender.com/api/set-helium-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          고객사: initialCustomer,
          지역: initialRegion,
          Magnet: initialMagnet,
          충진일: formattedDate,
          충진주기: period === '' ? '0' : period,
          예약여부: reservation,
          사용량: usageAmount,
          Timestamp: new Date().toISOString()
        })
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('저장 완료', '예약 정보가 저장되었습니다.');
        navigation.goBack();
      } else {
        Alert.alert('오류', data.message || '저장 실패');
      }
    } catch (err) {
      Alert.alert('오류', '서버 저장 중 오류 발생');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dateHeader}>
        <Text style={styles.dateText}>📅 {formattedDate}</Text>
      </TouchableOpacity>

      {modalVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="calendar"
          onChange={(e, date) => {
            setModalVisible(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      <View style={styles.infoBox}>
        <Text style={styles.label}>고객사</Text>
        <Text style={styles.readonly}>{initialCustomer}</Text>
        <Text style={styles.label}>지역</Text>
        <Text style={styles.readonly}>{initialRegion}</Text>
        <Text style={styles.label}>Magnet</Text>
        <Text style={styles.readonly}>{initialMagnet}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="충진주기 (예: 6)"
        keyboardType="numeric"
        value={period}
        onChangeText={setPeriod}
      />

      <Text style={styles.label}>사용된 헬륨량 (ℓ)</Text>
      <TextInput
        style={styles.input}
        placeholder="예: 70"
        keyboardType="numeric"
        value={usageAmount}
        onChangeText={setUsageAmount}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => setReservation('Y')}
          style={[styles.choiceButton, reservation === 'Y' && styles.selectedY]}
        >
          <Text style={styles.choiceText}>✅ Y</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setReservation('N')}
          style={[styles.choiceButton, reservation === 'N' && styles.selectedN]}
        >
          <Text style={styles.choiceText}>❌ N</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>💾 저장하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white'
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  infoBox: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 8
  },
  readonly: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f3f3f3'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 6,
    borderRadius: 6
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12
  },
  choiceButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginHorizontal: 4
  },
  selectedY: {
    backgroundColor: '#d4fcd4',
    borderColor: 'green'
  },
  selectedN: {
    backgroundColor: '#fce4e4',
    borderColor: 'red'
  },
  choiceText: {
    fontWeight: 'bold'
  },
  saveButton: {
    backgroundColor: '#2196F3',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginTop: 20
  }
});

export default HeScheduleEditScreen;
