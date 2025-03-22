import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const sitePlanOptions = {
  Magnet: ["400core", "400evo", "500evo", "600evo", "700evo"],
  Console: ["Onebay", "Twobay", "Nanobay"],
  Autosampler: ["SampleCase 24", "SampleCase Plus", "SampleCase H&C", "SampleJet"],
  Accessories: ["BCU1", "BCU2", "MAS3", "N2Evaporator", "N2Seperator"],
  Utilities: ["UPS", "Compressor", "Air-dryer"],
};

export default function SitePlan() {
  const [selectedOptions, setSelectedOptions] = useState({
    Magnet: "",
    Console: "",
    Autosampler: "",
    Accessories: [],
    Utilities: [],
  });

  const handleSelectChange = (category, value) => {
    setSelectedOptions((prev) => ({ ...prev, [category]: value }));
  };

  const handleMultiSelect = (category, value) => {
    setSelectedOptions((prev) => {
      const updated = prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value];
      return { ...prev, [category]: updated };
    });
  };

  return (
    <View className="p-6 flex flex-col gap-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          {Object.keys(sitePlanOptions).map((category) => (
            <View key={category} className="flex items-center justify-between">
              <span className="font-semibold">{category}</span>
              {category === "Accessories" || category === "Utilities" ? (
                <View className="flex gap-2">
                  {sitePlanOptions[category].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions[category].includes(option) ? "default" : "outline"}
                      onClick={() => handleMultiSelect(category, option)}
                    >
                      {option}
                    </Button>
                  ))}
                </View>
              ) : (
                <Select onValueChange={(value) => handleSelectChange(category, value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {sitePlanOptions[category].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </View>
          ))}
        </CardContent>
      </Card>
      <View className="flex justify-between">
      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <Text>이전</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("SitePlan2Screen")}>
          <Text>다음</Text>
        </TouchableOpacity>
      </View>

      </View>
    </View>
  );
}


