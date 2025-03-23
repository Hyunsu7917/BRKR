import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";


const MenuScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>메뉴</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SitePlanScreen")}>
        <Text style={styles.buttonText}>Site Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("KoreaInventoryScreen")}>
        <Text style={styles.buttonText}>국내 재고 조회</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => console.log("고객 정보 조회 (준비 중)")}>
        <Text style={styles.buttonText}>고객 정보 조회</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("HomeScreen")}>
        <Text style={styles.buttonText}>돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0A5D80",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default MenuScreen;
