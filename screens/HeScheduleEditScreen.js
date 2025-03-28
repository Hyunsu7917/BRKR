import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const HeScheduleEditScreen = ({ route, navigation }) => {
  const { mode, date, 고객사 = '', 지역 = '', Magnet = '' } = route.params || {};

  const [cust, setCust] = useState(고객사);
  const [region, setRegion] = useState(지역);
  const [magnet, setMagnet] = useState(Magnet);
  const [chargeDate, setChargeDate] = useState(new Date(date || new Date()));
  const [cycle, setCycle] = useState('');
  const [reserved, setReserved] = useState('Y');

  const handleSave = async () => {
    const formattedDate = chargeDate.toISOString().split('T')[0];

    const payload = {
      고객사: cust,
      지역: region,
      Magnet: magnet,
      충진일: formattedDate,
      다음충진일: '', // 자동 계산도 가능
      '충진주기(개월)': cycle,
      예약여부: reserved,
    };

    try {
      const res = await fetch('https://your-server-url.com/api/set-helium-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        Alert.alert('✅ 저장 완료');
        navigation.goBack();
      } else {
        Alert.alert('❌ 저장 실패', result.message);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('서버 오류 발생');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>고객사</Text>
      <TextInput value={cust} onChangeText={setCust} style={styles.input} />

      <Text style={styles.label}>지역</Text>
      <TextInput value={region} onChangeText={setRegion} style={styles.input} />

      <Text style={styles.label}>Magnet</Text>
      <TextInput value={magnet} onChangeText={setMagnet} style={styles.input} />

      <Text style={styles.label}>충진일</Text>
      <DateTimePicker
        value={chargeDate}
        mode="date"
        display="default"
        onChange={(event, selected) => selected && setChargeDate(selected)}
      />

      <Text style={styles.label}>충진주기 (개월)</Text>
      <TextInput value={cycle} onChangeText={setCycle} keyboardType="numeric" style={styles.input} />

      <Text style={styles.label}>예약여부 (Y/N)</Text>
      <TextInput value={reserved} onChangeText={setReserved} style={styles.input} />

      <Button title="💾 저장하기" onPress={handleSave} />
    </View>
  );
};

export default HeScheduleEditScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5 },
});
