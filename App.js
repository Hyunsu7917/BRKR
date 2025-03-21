import React, { useState } from "react";
import { View } from "react-native";
import MainNavigator from "./components/MainNavigator";

export default function App() {
  const [screen, setScreen] = useState("home"); // 상태 정의

  return (
    <View style={{ flex: 1 }}>
      <MainNavigator screen={screen} setScreen={setScreen} />
    </View>
  );
}
