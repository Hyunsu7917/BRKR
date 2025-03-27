import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import TableHe from "../components/TableHe"; 
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";


// 📍 formatDate 함수: 컴포넌트 위에 위치
const formatDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return "";
  return dateStr.slice(0, 10);
};

export default function HeScheduleRegisterScreen() {
  const [month1, setMonth1] = useState(""); // 충진일 기준
  const [month2, setMonth2] = useState(""); // 다음충진일 기준
  const [regionInput, setRegionInput] = useState("");
  const [customer, setCustomer] = useState("");
  const [results, setResults] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [allCustomers, setAllCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerInput, setCustomerInput] = useState("");
  const [allRows, setAllRows] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigation = useNavigation();



  const toggleRegionSelection = (region) => {
    if (region === "선택 안함") {
      setSelectedRegions([]);
      return;
    }
  
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  // 🔹 초기 로딩
  useEffect(() => {
    axios.get("https://brkr-server.onrender.com/excel/he/schedule")
      .then((res) => {
        const data = res.data;
        setAllRows(data);
  
        const uniqueRegions = ["· 선택 안함", ...new Set(data.map((row) => row["지역"]).filter(Boolean))];
        setRegionList(uniqueRegions);
  
        const uniqueCustomers = [
          ...new Set(data.map((row) => row["고객사"]).filter(Boolean)),
        ];
        setAllCustomers(uniqueCustomers);
        
      })
      .catch((err) => console.error("🔥 초기 로딩 에러:", err));
  }, []);
  

  // 🔹 고객사 자동완성 필터링
  useEffect(() => {
    const searchTerm = customerInput.toLowerCase();
    const filtered = allCustomers.filter((name) =>
      typeof name === "string" &&
      name.toLowerCase().includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  }, [customerInput, allCustomers]);

  useEffect(() => {
    // 고객사 입력이 지워졌을 경우, customer도 비워줌
    if (customerInput.trim() === "") {
      setCustomer("");
    }
  
    const isEmpty =
      month1.trim() === "" &&
      month2.trim() === "" &&
      selectedRegions.length === 0 &&
      customerInput.trim() === "" &&
      customer.trim() === "";

  
    if (isEmpty) {
      setResults([]);
    }
  }, [month1, month2, selectedRegions, customer, customerInput]);

  
  
  
  
  // 🔍 검색 실행
  const handleSearch = async () => {
    try {
      const res = await axios.get("https://brkr-server.onrender.com/excel/he/schedule");
      const all = res.data;
      setAllRows(all);
  
      // 🔸 모든 필터가 비어 있으면 결과 초기화
      if (month1 === "" && month2 === "" && selectedRegions.length === 0 && customer.length === 0) {
        setResults([]);
        return;
      }
  
      const filtered = all.filter((row) => {
        const chargeDate = typeof row["충진일"] === "string" ? row["충진일"] : "";
        const nextChargeDate = typeof row["다음충진일"] === "string" ? row["다음충진일"] : "";
        const region = row["지역"] || "";
        const customerName = row["고객사"] || "";
  
        // 🔸 충진일 필터
        const chargeMonthMatch = month1
          ? (chargeDate.split("-")[1] || "").padStart(2, "0") === month1.padStart(2, "0")
          : true;
  
        // 🔸 다음충진일 필터
        const nextChargeMonthMatch = month2
          ? (nextChargeDate.split("-")[1] || "").padStart(2, "0") === month2.padStart(2, "0")
          : true;
  
        // 🔸 지역 필터 (다중 선택)
        const regionMatch =
          selectedRegions.length === 0 || selectedRegions.includes(region);
  
        // 🔸 고객사 필터 (부분 포함)
        const customerMatch =
          customer.length === 0 ||
          (typeof customerName === "string" &&
            customerName.toLowerCase().includes(customer.toLowerCase()));
  
        // 🔸 모든 조건 일치해야 필터 통과
        return chargeMonthMatch && nextChargeMonthMatch && regionMatch && customerMatch;
      });
  
      setResults(filtered);
    } catch (err) {
      console.error("🔴 검색 에러:", err);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled">
          
          {/* 월 입력 */}
          <TextInput
            value={month1}
            onChangeText={setMonth1}
            placeholder="충진일 (예: 03)"
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
              backgroundColor: "white", // 배경 하얗게
            }}
          />

          <TextInput
            value={month2}
            onChangeText={setMonth2}
            placeholder="다음충진일 (예: 03)"
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
              backgroundColor: "white", // 배경 하얗게
            }}
          />
            
          {/* 지역 입력창 (터치 시 드롭다운 열림) */}
          <TextInput
            style={styles.input}
            value={regionInput}
            onChangeText={text => {
              setRegionInput(text);
              setShowRegionDropdown(true); // 입력 중 드롭다운 열림
            }}
            placeholder="지역 (선택 입력)"
            onFocus={() => setShowRegionDropdown(true)} // 포커스 시 드롭다운 열림
          />

          {/* 선택된 지역 태그 박스 */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
            {selectedRegions.map((region, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#e0e0e0',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  margin: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text>{region}</Text>
                <TouchableOpacity
                  onPress={() => {
                    toggleRegionSelection(region);
                    setRegionInput(""); // ❌ 선택 해제 시 드롭다운 닫음
                  }}
                >
                  <Text style={{ marginLeft: 6, color: 'red' }}>❌</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* 지역 드롭다운 */}
          {showRegionDropdown && (
            <View style={[styles.dropdownList, { maxHeight: 160 }]}>
              <ScrollView keyboardShouldPersistTaps="handled">
                {regionList
                  .filter(r => r.includes(regionInput))
                  .map((region, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        toggleRegionSelection(region);
                        setRegionInput("");
                        // 드롭다운 유지!
                      }}
                    >
                      <Text style={styles.dropdownItem}>· {region}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>

              {/* ✅ 닫기 버튼 추가 */}
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  alignItems: 'center',
                  borderTopWidth: 1,
                  borderColor: '#ccc',
                  backgroundColor: '#f5f5f5',
                }}
                onPress={() => setShowRegionDropdown(false)}
              >
                <Text style={{ color: 'blue' }}>⏹ 닫기</Text>
              </TouchableOpacity>
            </View>
          )}



  
          {/* 고객사 입력창 */}
          <TextInput
            style={styles.input}
            value={customerInput}
            onChangeText={setCustomerInput}
            placeholder="고객사"
            onFocus={() => setShowRegionDropdown(false)}
          />
  
          {/* 고객사 자동완성 박스 */}
          {customerInput.length > 0 && (
            <View style={styles.autoCompleteBox}>
              <ScrollView keyboardShouldPersistTaps="handled">
                {filteredCustomers.map((item, index) => (
                  <TouchableOpacity
                    key={`${item}_${index}`}
                    onPress={() => {
                      setCustomer(item);
                      setCustomerInput(item);
                    }}
                  >
                    <Text style={styles.autoCompleteItem}>· {item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

  
          {/* 검색 버튼 */}
          <TouchableOpacity onPress={handleSearch} style={styles.button}>
            <Text style={styles.buttonText}>검색</Text>
          </TouchableOpacity>
  
          {/* 검색 결과 */}
          {/* 🔍 검색 결과 */}
          {results.length === 0 ? (
            <Text style={styles.noResult}>검색 결과가 없습니다.</Text>
          ) : (
            <View>
              {/* ✅ 헤더 한 번 + 테이블 전체 렌더링 */}
              <TableHe
                rows={results.map((row, index) => ({
                  ...row,
                  index,
                  "충진일": formatDate(row["충진일"]),
                  "다음충진일": formatDate(row["다음충진일"]),
                }))}
                onRowSelect={setSelectedIndex}
                selectedIndex={selectedIndex}
              />
              
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>   
      {results.length > 0 && (
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 30,
            right: 20,
            backgroundColor: "#007bff",
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 30,
            elevation: 5,
          }}
          onPress={() => {
            if (selectedIndex !== null) {
              navigation.navigate("HeScheduleWrite", {
                row: results[selectedIndex],
                index: selectedIndex,
              });
            } else {
              alert("기록할 항목을 선택해주세요!");
            }
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>기록 저장</Text>
        </TouchableOpacity>
      )}

    </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 5,
  },
  dropdownText: {
    color: "#444",
  },
  dropdownList: {
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 8,
    borderRadius: 6,
  },
  dropdownItem: {
    paddingVertical: 4,
    fontSize: 14,
  },
  autoCompleteBox: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  autoCompleteItem: {
    fontSize: 14,
    paddingVertical: 4,
    color: "#1e40af",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noResult: {
    marginTop: 20,
    textAlign: "center",
    color: "gray",
  },
});
