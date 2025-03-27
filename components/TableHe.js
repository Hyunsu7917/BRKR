// components/TableHe.js
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function TableHe(props) {
  const { rows = [], onRowSelect = () => {}, selectedIndex = null } = props;

  return (
    <ScrollView horizontal>
      <View>
        {/* Header */}
        <View style={{ flexDirection: "row", backgroundColor: "#eee", padding: 6 }}>
          <Text style={{ width: 80, fontWeight: "bold" }}>지역</Text>
          <Text style={{ width: 100, fontWeight: "bold" }}>고객사</Text>
          <Text style={{ width: 80, fontWeight: "bold" }}>Magnet</Text>
          <Text style={{ width: 100, fontWeight: "bold" }}>충진일</Text>
          <Text style={{ width: 110, fontWeight: "bold" }}>다음충진일</Text>
          <Text style={{ width: 80, fontWeight: "bold" }}>주기(개월)</Text>
        </View>

        {/* Rows */}
        {rows.map((row, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onRowSelect(row.index)} // ✅ 여기 중요
            style={{
              flexDirection: "row",
              padding: 6,
              backgroundColor: row.index === selectedIndex ? "#d0e8ff" : "white",
            }}
          >
            <Text style={{ width: 80 }}>{row["지역"]}</Text>
            <Text style={{ width: 100 }}>{row["고객사"]}</Text>
            <Text style={{ width: 80 }}>{row["Magnet"]}</Text>
            <Text style={{ width: 100 }}>{row["충진일"]}</Text>
            <Text style={{ width: 110 }}>{row["다음충진일"]}</Text>
            <Text style={{ width: 80 }}>{row["충진주기(개월)"]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}


const headerCell = {
  fontWeight: "bold",
  paddingHorizontal: 6,
  paddingVertical: 4,
};

const cell = {
  paddingHorizontal: 6,
  paddingVertical: 6,
};
