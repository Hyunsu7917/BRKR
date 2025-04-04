import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const HeScheduleCalendarScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [heliumData, setHeliumData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  // ✅ 최신 기록만 추출 (고객사+지역+Magnet 기준)
  const getLatestUniqueRecords = (data) => {
    const map = new Map();
    data.forEach(entry => {
      const key = `${entry['고객사']}_${entry['지역']}_${entry['Magnet']}`;
      const existing = map.get(key);
      if (!existing || new Date(entry.Timestamp) > new Date(existing.Timestamp)) {
        map.set(key, entry);
      }
    });
    return Array.from(map.values());
  };

  const fetchHeliumData = async () => {
    try {
      const response = await axios.get('https://brkr-server.onrender.com/api/helium');
      const data = response.data;
      setHeliumData(data);
      updateMarkedDates(data);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
  };

  const updateMarkedDates = (data) => {
    const latestRecords = getLatestUniqueRecords(data);
    setHeliumData(latestRecords); // 💡 여기에 추가!
    const marked = {};
    latestRecords.forEach(entry => {
      const date = entry['충진일'];
      if (date) {
        marked[date] = {
          marked: true,
          dotColor: '#FFA500'
        };
      }
    });
    setMarkedDates(marked);
  };
  

  useEffect(() => {
    fetchHeliumData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const refresh = async () => {
        await fetchHeliumData();
  
        // ✅ 선택한 날짜가 있으면 최신 정보 다시 찾아서 반영
        if (selectedDate) {
          const sameDay = heliumData.filter(entry => entry['충진일'] === selectedDate);
          const map = new Map();
          sameDay.forEach(entry => {
            const key = `${entry['고객사']}_${entry['지역']}_${entry['Magnet']}`;
            const existing = map.get(key);
            if (!existing || new Date(entry.Timestamp) > new Date(existing.Timestamp)) {
              map.set(key, entry);
            }
          });
  
          const latest = Array.from(map.values());
          setSelectedEntry(latest[0] || null);
        }
      };
  
      refresh();
    }, [selectedDate])
  );
  

  const handleDayPress = (day) => {
    const date = day.dateString;
    setSelectedDate(date);
  
    const sameDayEntries = heliumData.filter(entry => entry['충진일'] === date);
    setSelectedEntries(sameDayEntries);  // 🔥 배열 그대로 저장!
  };
  

  const handleNavigate = () => {
    if (!selectedEntry) return;
    navigation.navigate('HeScheduleEditScreen', {
      date: selectedDate,
      고객사: selectedEntry['고객사'],
      지역: selectedEntry['지역'],
      Magnet: selectedEntry['Magnet'],
      '충진주기(개월)': selectedEntry['충진주기(개월)'] || '',
      사용량: selectedEntry['사용량'] || '',
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: '#FFA500',
            marked: true,
            dotColor: '#FFA500'
          },
        }}
        theme={{
          arrowColor: '#FFA500',
          selectedDayBackgroundColor: '#FFA500',
          todayTextColor: '#000',
        }}
      />

      {selectedDate && selectedEntries.length > 0 && (
        <ScrollView contentContainerStyle={styles.entryBox}>
          <Text style={styles.dateTitle}>{selectedDate} 일정 ({selectedEntries.length}건)</Text>
          {selectedEntries.map((entry, index) => (
            <View key={index} style={styles.infoBox}>
              <Text style={styles.customer}>{entry['고객사']}</Text>
              <Text>{entry['지역']} / {entry['Magnet']}</Text>
              <Text style={{ color: entry['예약여부'] === 'Y' ? 'green' : 'red', marginTop: 4 }}>
                {entry['예약여부'] === 'Y' ? '✅ 예약됨' : '❌ 미예약'}
              </Text>
              {entry['사용량'] && (
                <Text style={{ marginTop: 4 }}>사용량: {entry['사용량']} ℓ</Text>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('HeScheduleEditScreen', {
                    date: entry['충진일'],
                    고객사: entry['고객사'],
                    지역: entry['지역'],
                    Magnet: entry['Magnet'],
                    '충진주기(개월)': entry['충진주기(개월)'] || '',
                    사용량: entry['사용량'] || ''
                  })
                }
              >
                <Text style={styles.buttonText}>예약 수정</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

    </SafeAreaView>
  );
};

export default HeScheduleCalendarScreen;

const styles = StyleSheet.create({
  entryBox: {
    marginTop: 12,
    paddingHorizontal: 20
  },
  dateTitle: {
    fontWeight: 'bold',
    marginBottom: 8
  },
  infoBox: {
    backgroundColor: '#f7f7f7',
    padding: 12,
    borderRadius: 10,
    elevation: 1
  },
  customer: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  button: {
    marginTop: 12,
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    borderRadius: 6
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  }
});
