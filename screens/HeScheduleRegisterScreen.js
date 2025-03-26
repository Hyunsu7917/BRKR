import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { Table, Row } from "../components/TableView";

export default function HeScheduleRegisterScreen() {
  const [month, setMonth] = useState("");
  const [region, setRegion] = useState("");
  const [customer, setCustomer] = useState("");
  const [results, setResults] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerInput, setCustomerInput] = useState("");
  const [allCustomers, setAllCustomers] = useState([]);
  const [allRows, setAllRows] = useState([]);
  


  useEffect(() => {
    axios.get("https://brkr-server.onrender.com/excel/he/schedule")
      .then(res => {
        const data = res.data;
        const uniqueRegions = [...new Set(data.map(row => row["지역"]))];
        const uniqueCustomers = [...new Set(data.map(row => row["고객사"]))];
        setRegionList(["선택 안함", ...uniqueRegions]);
        setAllCustomers(uniqueCustomers);
      })
      .catch(err => console.error("📛 초기 로딩 에러:", err));
  }, []);

  useEffect(() => {
    const searchTerm = (customer || "").toLowerCase();
    const filtered = allCustomers.filter(name =>
      (name || '').toLowerCase().includes(searchTerm)
    );
    
    setFilteredCustomers(filtered);
  }, [customerInput, allCustomers]);

  const filtered = allRows.filter((row) => {
    const regionValue = typeof row["지역"] === "string" ? row["지역"] : "";
    const customerValue = typeof row["고객사"] === "string" ? row["고객사"] : "";
    const chargeDate = typeof row["충진일"] === "string" ? row["충진일"] : "";
  
    const regionMatch = region
      ? regionValue.toLowerCase().includes(region.toLowerCase())
      : true;
  
    const customerMatch = customer
      ? customerValue.toLowerCase().includes(customer.toLowerCase())
      : true;
  
    const monthMatch = month
      ? chargeDate.split("-")[1] === month.padStart(2, "0")
      : true;
  
    return regionMatch && customerMatch && monthMatch;
  });
  
  
  
  

  const handleSearch = async () => {
    try {
      const res = await axios.get("https://brkr-server.onrender.com/excel/he/schedule");
      const all = res.data;
      const filtered = all.filter(row => {
        const matchMonth = month ? row["충진일"].slice(5, 7) === month.padStart(2, "0") : true;
        const matchRegion = region && region !== "선택 안함" ? row["지역"] === region : true;
        const matchCustomer = customer ? row["고객사"].includes(customer) : true;
        return matchMonth && matchRegion && matchCustomer;
      });

      const grouped = filtered.reduce((acc, row) => {
        const dateKey = row["충진일"].slice(8, 10);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(row);
        return acc;
      }, {});

      const tableData = Object.entries(grouped).map(([day, rows]) => [
        day,
        rows.map(r => `지역: ${r["지역"]}, 고객사: ${r["고객사"]}, Magnet: ${r["Magnet"]}`).join("\n")
      ]);
      setResults(tableData);
    } catch (err) {
      console.error("❌ 검색 에러:", err);
      setResults([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>헬륨 충진 스케줄 확인</Text>

          <TextInput
            placeholder="월 (예: 03)"
            value={month}
            onChangeText={setMonth}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity style={styles.dropdownButton}>
            <Text style={styles.dropdownText}>{region || "지역 (선택 입력)"}</Text>
          </TouchableOpacity>
          <ScrollView style={styles.dropdownList} nestedScrollEnabled>
            {regionList.map((r, idx) => (
              <TouchableOpacity key={idx} onPress={() => setRegion(r)}>
                <Text style={styles.dropdownItem}>ㆍ{r}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            placeholder="고객사"
            value={customerInput}
            onChangeText={text => {
              setCustomerInput(text);
              setCustomer(text);
            }}
            style={styles.input}
          />

          <View style={styles.autoCompleteBox}>
            <ScrollView>
              {filteredCustomers.map((name, idx) => (
                <Text
                  key={idx}
                  style={styles.autoCompleteItem}
                  onPress={() => {
                    setCustomerInput(name);
                    setCustomer(name);
                    setFilteredCustomers([]);
                  }}
                >
                  · {name}
                </Text>
              ))}
            </ScrollView>
          </View>


          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>검색</Text>
          </TouchableOpacity>

          <ScrollView style={{ marginTop: 20 }}>
            {results.length === 0 ? (
              <Text style={styles.noResult}>검색 결과가 없습니다.</Text>
            ) : (
              <Table data={results} headers={["일", "내용"]} />
            )}
          </ScrollView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
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
  suggestionBox: {
    maxHeight: 160,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  suggestionItem: {
    paddingVertical: 5,
    color: "#0046d6",
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
  autoCompleteBox: {
    maxHeight: 150, // 👈 딱 보기 좋은 높이
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
  
});