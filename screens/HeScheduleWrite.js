import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import axios from "axios"; 
import { useNavigation } from "@react-navigation/native";
import { checkManualMode } from '@/utils/checkManualMode';

export default function HeScheduleWrite() {
  const route = useRoute();
  const navigation = useNavigation();
  const { row = {}, index } = route.params || {};

  const [customer, setCustomer] = useState(row["고객사"] || "");
  const [region, setRegion] = useState(row["지역"] || "");
  const [chargeDate, setChargeDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [interval, setInterval] = useState("");
  const [locked, setLocked] = useState(false);
  const [nextChargeDate, setNextChargeDate] = useState("");
  const [magnet, setMagnet] = useState(row["Magnet"] || "");
  const [chargeCycle, setChargeCycle] = useState(
    Number(row["충진주기(개월)"]) || 6
  );
  const [heliumAmount, setHeliumAmount] = useState('');

  useEffect(() => {
    if (chargeDate && interval) {
      const calculated = dayjs(chargeDate).add(interval, "month").format("YYYY-MM-DD");
      setNextChargeDate(calculated);
    }
  }, [chargeDate, interval]);

  useEffect(() => {
    if (row["충진주기(개월)"]) {
      setInterval(String(row["충진주기(개월)"]));
    } else {
      setInterval("6"); // 디폴트
    }
  }, []);  

  const handleSetToday = () => {
    setChargeDate(dayjs().format("YYYY-MM-DD"));
  };

  const handleSave = async () => {
     const isLocked = await checkManualMode();
        
        if (isLocked) {
          Alert.alert("잠시만요!", "⚠️ 현재 서버에서 파일을 수동 수정 중입니다.");
          return;
        }    

    try {
      const payload = {
        고객사: customer,
        지역: region,
        Magnet: magnet,
        충진일: chargeDate,
        다음충진일: nextChargeDate,
        "충진주기(개월)": chargeCycle,
      };
  
      const res = await axios.post("https://brkr-server.onrender.com/api/he/save", [payload]); // ✅ 배열로 감싸기
  
      if (res.data.success) {
        alert("✅ 저장 완료!");
        navigation.goBack(); // ✅ 저장 후 이전 화면으로 이동
      } else {
        alert("❌ 저장 실패");
      }
    } catch (err) {
      console.error("저장 중 오류:", err);
      alert("⚠️ 서버 오류!");
    }
  };
  
  useEffect(() => {
      const checkLock = async () => {
        const isLocked = await checkManualMode();
        setLocked(isLocked);
        if (isLocked) {
          Alert.alert("잠시만요!", "⚠️ 현재 서버에서 파일을 수동 수정 중입니다.");
        }
      };
      checkLock();
    }, []);
  

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>고객사</Text>
      <TextInput value={customer} onChangeText={setCustomer} style={styles.input} />

      <Text>지역</Text>
      <TextInput value={region} onChangeText={setRegion} style={styles.input} />

      <Text>충진일</Text>
      <TextInput value={chargeDate} onChangeText={setChargeDate} style={styles.input} />
      <TouchableOpacity onPress={handleSetToday}>
        <Text style={{ color: "blue", marginBottom: 10 }}>📅 오늘 날짜 입력</Text>
      </TouchableOpacity>

      <Text>충진주기 (개월)</Text>
      <Text style={{ marginTop: 16 }}>충진주기 (개월)</Text>
      <TextInput
        value={interval.toString()}
        onChangeText={(text) => setInterval(Number(text))}
        keyboardType="numeric"
        placeholder="충진주기 (개월)"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 4,
          marginTop: 4,
        }}
      />


      <Text>👉 다음충진일: {nextChargeDate}</Text>
      <TextInput
        placeholder="사용량 (ℓ)"
        keyboardType="numeric"
        value={heliumAmount}
        onChangeText={setHeliumAmount}
      />


      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "#007bff",
          padding: 14,
          marginTop: 24,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>저장</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
};
