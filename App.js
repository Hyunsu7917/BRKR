import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SelectionProvider } from "./context/SelectionContext";
import MainNavigator from "./components/MainNavigator";

export default function App() {
  return (
    <SelectionProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </SelectionProvider>
  );
}
