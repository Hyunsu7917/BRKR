import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

const HeScheduleCalendar = ({ heliumData }) => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailySchedules, setDailySchedules] = useState([]);

  const handleReservation = async (entry) => {
    try {
      const response = await fetch('https://brkr-server.onrender.com/api/set-helium-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          고객사: entry['고객사'],
          지역: entry['지역'],
          Magnet: entry['Magnet'],
          충진일: entry['충진일'],
          예약여부: 'Y',
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('✅ 예약 완료!');
        // 👉 예약여부만 변경해 로컬 상태도 반영
        entry['예약여부'] = 'Y';
        setDailySchedules([...dailySchedules]); // 리렌더 유도
      } else {
        console.error(result);
        alert('예약 실패: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류 발생!');
    }
  };  

  useEffect(() => {
    const marks = {};

    heliumData.forEach(entry => {
      const date = entry['충진일'];
      const isReserved = entry['예약여부'] === 'Y';

      if (!marks[date]) {
        marks[date] = {
          dots: [],
          marked: true,
        };
      }

      marks[date].dots.push({
        key: entry['고객사'],
        color: isReserved ? 'green' : 'red',
      });
    });

    setMarkedDates(marks);
  }, [heliumData]);

  const handleDayPress = (day) => {
    const date = day.dateString;
    setSelectedDate(date);
    const filtered = heliumData.filter(entry => entry['충진일'] === date);
    setDailySchedules(filtered);
  };

  return (
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
                {entry['예약여부'] !== 'Y' && (
                  <Button title="예약하기" onPress={() => handleReservation(entry)} />
                )}

              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default HeScheduleCalendar;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  detailBox: { marginTop: 15, padding: 10, backgroundColor: '#f2f2f2', borderRadius: 10 },
  dateTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  scrollArea: { maxHeight: 200 },
  entryBox: { marginBottom: 10, padding: 8, backgroundColor: 'white', borderRadius: 8 },
  customer: { fontWeight: 'bold' },
});
