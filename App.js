import React, { useEffect } from "react";
import { Alert, Linking } from "react-native";
import Constants from "expo-constants";
import { NavigationContainer } from "@react-navigation/native";
import { SelectionProvider } from "./context/SelectionContext";
import MainNavigator from "./components/MainNavigator";

export default function App() {
  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const res = await fetch("https://brkr-server.onrender.com/latest-version.json");
        const latest = await res.json();

        const currentVersion = Constants.expoConfig?.version; 

        if (latest.version !== currentVersion) {
          Alert.alert(
            "업데이트 알림",
            "새로운 버전이 있습니다. 업데이트하시겠습니까?",
            [
              { text: "나중에", style: "cancel" },
              {
                text: "업데이트",
                onPress: () => {
                  Linking.openURL(latest.apkUrl); 
                },
              },
            ]
          );
        }
      } catch (err) {
        console.warn("업데이트 확인 실패:", err);
      }
    };

    checkForUpdate();
  }, []);

  return (
    <SelectionProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </SelectionProvider>
  );
}
