import React, { useState } from "react";
import { View, Text } from "react-native";
import MainNavigator from "./src/components/MainNavigator"; // ✅ 네비게이션 관리 파일

export default function App() {
  const [screen, setScreen] = useState("home");

  return (
    <View style={{ flex: 1 }}>
      <MainNavigator screen={screen} setScreen={setScreen} />
    </View>
  );
}
