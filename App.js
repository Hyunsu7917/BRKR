import React, { useEffect } from "react";
import { Alert, Linking } from "react-native";
import Constants from "expo-constants";
import { NavigationContainer } from "@react-navigation/native";
import { SelectionProvider } from "./context/SelectionContext";
import MainNavigator from "./components/MainNavigator";
import * as Updates from 'expo-updates';

export default function App() {
  useEffect(() => {
    console.log("✅ 현재 앱 runtimeVersion:", Updates.runtimeVersion);
    console.log("🆔 OTA 업데이트 ID:", Updates.updateId);
    console.log("📦 OTA 적용 여부:", Updates.isEmbeddedLaunch ? '기본 번들' : 'OTA 적용됨');
  }, []);
  
  useEffect(() => {
    // Expo OTA 업데이트 체크
    const checkExpoUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert("업데이트 있음", "앱을 다시 시작합니다.");
          await Updates.reloadAsync();
        }
      } catch (err) {
        console.log("OTA 업데이트 확인 실패:", err);
      }
    };
    checkExpoUpdate();

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
