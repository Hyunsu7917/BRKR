import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';



const SERVER_URL = 'https://brkr-server.onrender.com';

const HeScheduleCalendar = ({ navigation }) => {
  const [heliumData, setHeliumData] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [dailySchedules, setDailySchedules] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`https://brkr-server.onrender.com/api/helium`);
          setHeliumData(response.data);
        } catch (error) {
          console.error('헬륨 데이터 불러오기 실패:', error);
        }
      };
      fetchData();
    }, [])
  );
  

  useEffect(() => {
    const latestMap = new Map();
  
    heliumData.forEach((entry) => {
      const key = `${entry['고객사']}_${entry['지역']}_${entry['Magnet']}`;
      const existing = latestMap.get(key);
      
      // Timestamp가 없으면 무시 (이전 기록 필터링)
      if (!entry.Timestamp) return;
  
      if (
        !existing || 
        new Date(entry.Timestamp) > new Date(existing.Timestamp)
      ) {
        latestMap.set(key, entry);
      }
    });
  
    const marked = {};
    latestMap.forEach((entry) => {
      const date = entry['충진일']?.slice(0, 10);
      if (date) {
        marked[date] = {
          marked: true,
          dotColor: 'blue',
        };
      }
    });
  
    setMarkedDates(marked);
  }, [heliumData]);  

  const handleDayPress = (day) => {
    const date = day.dateString;
  
    const latestMap = new Map();
    heliumData.forEach((entry) => {
      const key = `${entry['고객사']}_${entry['지역']}_${entry['Magnet']}`;
      const existing = latestMap.get(key);
  
      if (!entry.Timestamp) return;
  
      if (
        !existing || 
        new Date(entry.Timestamp) > new Date(existing.Timestamp)
      ) {
        latestMap.set(key, entry);
      }
    });
  
    const filtered = Array.from(latestMap.values()).filter(
      (entry) => entry['충진일']?.slice(0, 10) === date
    );
  
    setSelectedDate(date);
    setDailySchedules(filtered);
  }; 

  const handleReservation = (entry) => {
    navigation.navigate('HeScheduleEditScreen', {
      고객사: entry['고객사'],
      지역: entry['지역'],
      Magnet: entry['Magnet'],
      date: entry['충진일'],
      충진주기: entry['충진주기(개월)'], // ✅ 이거 추가
    });    
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          markingType={'multi-dot'}
        />

        {selectedDate && (
          <View style={styles.detailBox}>
            <Text style={styles.dateTitle}>{selectedDate} 일정</Text>
            <ScrollView style={styles.scrollArea}>
              {dailySchedules.map((entry, index) => (
                <View key={index} style={styles.entryBox}>
                  <Text style={styles.customer}>{entry['고객사']}</Text>
                  <Text>{entry['지역']} / {entry['Magnet']}</Text>
                  <Text style={{ color: entry['예약여부'] === 'Y' ? 'green' : 'red' }}>
                    {entry['예약여부'] === 'Y' ? '✅ 예약됨' : '❌ 미예약'}
                  </Text>

                  <Button
                    title={entry['예약여부'] === 'Y' ? '예약 수정' : '예약하기'}
                    onPress={() => handleReservation(entry)}
                    color={entry['예약여부'] === 'Y' ? 'orange' : undefined}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HeScheduleCalendar;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  detailBox: { marginTop: 15, padding: 10, backgroundColor: '#f2f2f2', borderRadius: 10 },
  dateTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  scrollArea: { maxHeight: 300 },
  entryBox: { marginBottom: 10, padding: 8, backgroundColor: 'white', borderRadius: 8 },
  customer: { fontWeight: 'bold' },
});
