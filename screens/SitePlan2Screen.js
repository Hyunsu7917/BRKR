import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const sitePlanOptions = {
  Probe: ["iProbe", "RTProbe", "CP-MAS", "HR-MAS", "TXI", "없음"],
  CPP: ["없음", "Prodigy"],
  CPPAcc: ["LN2dewar", "Prodigy Unit", "없음"],
  CRP: ["없음", "CRP"],
  CRPAcc: ["CU", "Outdoor", "Indoor", "Water Cooled", "BSNL", "없음"],
  HeTransferline: [
    "3 m indoor line / 10 m outdoor line",
    "3 m indoor line / 20 m outdoor line",
    "3 m indoor line / 30 m outdoor line",
    "6 m indoor line / 10 m outdoor line",
    "6 m indoor line / 20 m outdoor line",
    "6 m indoor line / 30 m outdoor line",
    "10 m indoor line / 10 m outdoor line",
    "10 m indoor line / 20 m outdoor line",
    "10 m indoor line / 30 m outdoor line",
    "20 m indoor line / 10 m outdoor line",
    "20 m indoor line / 20 m outdoor line",
    "30 m indoor line / 10 m outdoor line"
  ],
};

export default function SitePlan2Screen({ navigation }) {
  const [selectedOptions, setSelectedOptions] = useState({
    Probe: [],
    CPP: "없음",
    CPPAcc: [],
    CRP: "없음",
    CRPAcc: [],
    HeTransferline: "없음",
  });

  const handleSingleSelect = (category, value) => {
    setSelectedOptions((prev) => ({ ...prev, [category]: value }));
  };

  const handleMultiToggle = (category, value) => {
    setSelectedOptions((prev) => {
      const updated = prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value];
      return { ...prev, [category]: updated };
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Site Plan 2</Text>

      {/* Probe (Multi-select) */}
      <Text style={styles.label}>Probe</Text>
      <View style={styles.buttonGroup}>
        {sitePlanOptions.Probe.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.optionButton, selectedOptions.Probe.includes(option) && styles.selectedButton]}
            onPress={() => handleMultiToggle("Probe", option)}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CPP */}
      <Text style={styles.label}>CPP</Text>
      <Picker
        selectedValue={selectedOptions.CPP}
        onValueChange={(value) => handleSingleSelect("CPP", value)}
        style={styles.picker}
      >
        {sitePlanOptions.CPP.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>

      {/* CPP Acc (multi, conditional) */}
      {selectedOptions.CPP !== "없음" && (
        <>
          <Text style={styles.label}>CPP Acc</Text>
          <View style={styles.buttonGroup}>
            {sitePlanOptions.CPPAcc.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, selectedOptions.CPPAcc.includes(option) && styles.selectedButton]}
                onPress={() => handleMultiToggle("CPPAcc", option)}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* CRP */}
      <Text style={styles.label}>CRP</Text>
      <Picker
        selectedValue={selectedOptions.CRP}
        onValueChange={(value) => handleSingleSelect("CRP", value)}
        style={styles.picker}
      >
        {sitePlanOptions.CRP.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>

      {/* CRP Acc (multi, conditional) */}
      {selectedOptions.CRP !== "없음" && (
        <>
          <Text style={styles.label}>CRP Acc</Text>
          <View style={styles.buttonGroup}>
            {sitePlanOptions.CRPAcc.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, selectedOptions.CRPAcc.includes(option) && styles.selectedButton]}
                onPress={() => handleMultiToggle("CRPAcc", option)}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* He Transfer Line (conditional dropdown) */}
          <Text style={styles.label}>He Transfer Line</Text>
          <Picker
            selectedValue={selectedOptions.HeTransferline}
            onValueChange={(value) => handleSingleSelect("HeTransferline", value)}
            style={styles.picker}
          >
            <Picker.Item label="없음" value="없음" />
            {sitePlanOptions.HeTransferline.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </>
      )}

      {/* Navigation Buttons */}
      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <Text>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("SummaryScreen")}> 
          <Text>다음</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  picker: {
    marginBottom: 16,
    backgroundColor: "#eee",
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  optionButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
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
