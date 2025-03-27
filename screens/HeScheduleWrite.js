import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import axios from "axios"; 

export default function HeScheduleWrite() {
  const route = useRoute();
  const { row = {}, index } = route.params || {};

  const [customer, setCustomer] = useState(row["고객사"] || "");
  const [region, setRegion] = useState(row["지역"] || "");
  const [chargeDate, setChargeDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [interval, setInterval] = useState(Number(row["충진주기(개월)"]) || 6);
  const [nextChargeDate, setNextChargeDate] = useState("");

  useEffect(() => {
    if (chargeDate && interval) {
      const calculated = dayjs(chargeDate).add(interval, "month").format("YYYY-MM-DD");
      setNextChargeDate(calculated);
    }
  }, [chargeDate, interval]);

  const handleSetToday = () => {
    setChargeDate(dayjs().format("YYYY-MM-DD"));
  };

  const handleSave = async () => {
    try {
      const payload = {
        고객사: customer,
        지역: region,
        충진일: chargeDate,
        다음충진일: nextChargeDate,
      };
  
      const res = await axios.post("http://https://brkr-server.onrender.com/api/he/save", payload);
  
      if (res.data.success) {
        alert("✅ 저장 완료!");
        navigation.goBack(); // 이전 화면으로
      } else {
        alert("❌ 저장 실패!");
      }
    } catch (err) {
      console.error("저장 중 오류:", err);
      alert("💥 서버 오류!");
    }
  };

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
      <TextInput
        keyboardType="numeric"
        value={String(interval)}
        onChangeText={(val) => setInterval(Number(val))}
        style={styles.input}
      />

      <Text>👉 다음충진일: {nextChargeDate}</Text>

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
