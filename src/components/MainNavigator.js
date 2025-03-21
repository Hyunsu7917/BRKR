import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const MainNavigator = ({ screen, setScreen }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {screen === "home" ? (
        <>
          <Text>🏠 홈 화면</Text>
          <TouchableOpacity onPress={() => setScreen("final")}>
            <Text>➡️ Final 화면으로 이동</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text>✅ Final 화면</Text>
          <TouchableOpacity onPress={() => setScreen("home")}>
            <Text>⬅️ 홈으로 이동</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default MainNavigator;
