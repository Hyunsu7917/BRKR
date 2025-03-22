import React from "react";
import { View } from "react-native";
import MainNavigator from "./components/MainNavigator";
import { SelectionProvider } from "./context/SelectionContext"; // ✅ 경로 확인

export default function App() {
  return (
    <SelectionProvider>
      <View style={{ flex: 1 }}>
        <MainNavigator />
      </View>
    </SelectionProvider>
  );
}
