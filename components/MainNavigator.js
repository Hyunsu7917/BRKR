import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import SitePlanScreen from "../screens/SitePlanScreen";
import SitePlan2Screen from "../screens/SitePlan2Screen";
import SummaryScreen from "../screens/SummaryScreen";
import ItemDetailScreen from "../screens/ItemDetailScreen";
import ConsoleAndAutosamplerScreen from "../screens/ConsoleAndAutosamplerScreen";
import CPPDetailScreen from "../screens/CPPDetailScreen";
import CRPDetailScreen from "../screens/CRPDetailScreen";

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} />
        <Stack.Screen name="SitePlanScreen" component={SitePlanScreen} />
        <Stack.Screen name="SitePlan2Screen" component={SitePlan2Screen} />
        <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
        <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
        <Stack.Screen name="ConsoleAndAutosamplerScreen" component={ConsoleAndAutosamplerScreen} />
        <Stack.Screen name="CPPDetailScreen" component={CPPDetailScreen} />
        <Stack.Screen name="CRPDetailScreen" component={CRPDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
