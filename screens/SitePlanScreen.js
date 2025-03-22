// ✅ 수정된 SitePlanScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const sitePlanOptions = {
  Magnet: ["400core", "400evo", "500evo", "600evo", "700evo"],
  Console: ["Onebay", "Twobay", "Nanobay"],
  Autosampler: ["SampleCase 24", "SampleCase Plus", "SampleCase H&C", "SampleJet"],
  Accessories: ["BCU1", "BCU2", "MAS3", "N2Evaporator", "N2Seperator"],
  Utilities: ["UPS", "Compressor", "Air-dryer"],
};

export default function SitePlanScreen() {
  const navigation = useNavigation(); // ✅ navigation 객체 가져오기
  const { selections, setSelections } = useSelection();

  const handleSingleSelect = (category, value) => {
    setSelections((prev) => ({ ...prev, [category]: value }));
  };

  const handleMultiToggle = (category, value) => {
    setSelections((prev) => {
      const updated = prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value];
      return { ...prev, [category]: updated };
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {Object.keys(sitePlanOptions).map((category) => (
        <View key={category} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category}</Text>
          {category === "Accessories" || category === "Utilities" ? (
            <View style={styles.buttonGroup}>
              {sitePlanOptions[category].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    selections[category].includes(option) && styles.selectedButton,
                  ]}
                  onPress={() => handleMultiToggle(category, option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selections[category]}
                onValueChange={(value) => handleSingleSelect(category, value)}
              >
                <Picker.Item label="선택" value="" />
                {sitePlanOptions[category].map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          )}
        </View>
      ))}

      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <Text>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("SitePlan2Screen")}>
          <Text>다음</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionText: {
    color: "#000",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  navButton: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
});
