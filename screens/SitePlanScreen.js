import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useSelection } from "../context/SelectionContext";
import { SafeAreaView } from "react-native-safe-area-context";

const sitePlanOptions = {
  Magnet: ["400core", "400evo", "500evo", "600evo", "700evo"],
  Console: ["Onebay", "Twobay", "Nanobay"],
  Autosampler: ["SampleCase 24", "SampleCase Plus", "SampleCase Heated & Cooled", "SampleJet"],
  Accessories: ["BCU1", "BCU2", "MAS3", "N2Evaporator", "N2Seperator"],
  Utilities: ["UPS", "Compressor", "Air-dryer"],
};

export default function SitePlanScreen() {
  const navigation = useNavigation();
  const { selections, setSelections } = useSelection();

  // 단일 선택 (Picker용)
  const handleSingleSelect = (category, value) => {
    setSelections((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // 멀티 선택 (Button 토글용)
  const handleMultiToggle = (category, value) => {
    setSelections((prev) => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Site Plan</Text>

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
                      (selections[category] || []).includes(option) && styles.selectedButton,
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
                  selectedValue={selections[category] || ""}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
    backgroundColor: "#ccc",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});
