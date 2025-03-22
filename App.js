import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./components/MainNavigator";
import { SelectionProvider } from "./context/SelectionContext";

export default function App() {
  return (
    <SelectionProvider>
      <NavigationContainer> 
        <MainNavigator />
      </NavigationContainer>
    </SelectionProvider>
  );
}
