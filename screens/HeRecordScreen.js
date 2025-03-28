import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HeRecordScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>헬륨 충진 기록</Text>

      <View style={styles.buttonBox}>
        <Button
          title="일정 조회 및 등록"
          onPress={() => navigation.navigate("HeScheduleRegisterScreen")}
        />
      </View>

      <View style={styles.buttonBox}>
        <Button
          title="스케줄 확인"
          onPress={() => navigation.navigate("HeScheduleCalendarScreen")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  buttonBox: {
    marginBottom: 20,
    width: "60%",
  },
});
