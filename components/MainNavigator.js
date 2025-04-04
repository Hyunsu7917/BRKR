import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import SitePlanScreen from "../screens/SitePlanScreen";
import SitePlan2Screen from "../screens/SitePlan2Screen";
import SummaryScreen from "../screens/SummaryScreen";
import ItemDetailScreen from "../screens/ItemDetailScreen";
import ConsoleAndAutosamplerScreen from "../screens/ConsoleAndAutosamplerScreen";
import CPPDetailScreen from "../screens/CPPDetailScreen";
import CRPDetailScreen from "../screens/CRPDetailScreen";
import KoreaInventoryScreen from "../screens/KoreaInventoryScreen";
import KoreaInventoryListScreen from "../screens/KoreaInventoryListScreen";
import KoreaUsageRecordScreen from "../screens/KoreaUsageRecordScreen";
import HeRecordScreen from "../screens/HeRecordScreen";
import HeScheduleRegisterScreen from "../screens/HeScheduleRegisterScreen";
import HeScheduleWrite from "../screens/HeScheduleWrite";
import HeScheduleCalendarScreen from "../screens/HeScheduleCalendarScreen";
import HeScheduleEditScreen from "../screens/HeScheduleEditScreen";
import HeUsageStatsScreen from "../screens/HeUsageStatsScreen";
import BlueprintEditorScreen from "../screens/BlueprintEditorScreen";
const Stack = createStackNavigator();

const MainNavigator = () => {
  return (    
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
        <Stack.Screen name="KoreaInventoryScreen" component={KoreaInventoryScreen} />
        <Stack.Screen name="KoreaInventoryListScreen" component={KoreaInventoryListScreen} />
        <Stack.Screen name="KoreaUsageRecordScreen" component={KoreaUsageRecordScreen} />    
        <Stack.Screen name="HeRecordScreen" component={HeRecordScreen} />   
        <Stack.Screen name="HeScheduleRegisterScreen" component={HeScheduleRegisterScreen} />
        <Stack.Screen name="HeScheduleWrite" component={HeScheduleWrite} />
        <Stack.Screen name="HeScheduleCalendarScreen" component={HeScheduleCalendarScreen} />
        <Stack.Screen name="HeScheduleEditScreen" component={HeScheduleEditScreen} /> 
        <Stack.Screen name="HeUsageStatsScreen" component={HeUsageStatsScreen} />    
        <Stack.Screen name="BlueprintEditorScreen" component={BlueprintEditorScreen} />             
      </Stack.Navigator>    
  );
};

export default MainNavigator;
