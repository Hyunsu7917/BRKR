// BlueprintEditorScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const icons = [
  { icon: 'Magnet', label: 'Magnet' },
  { icon: 'Nanobay', label: 'Nanobay' },
  { icon: 'Onebay', label: 'Onebay' },
  { icon: 'Twobay', label: 'Twobay' },
  { icon: 'SampleCase', label: 'SampleCase' },
  { icon: 'LN2Dewar', label: 'LN2 Dewar' },
  { icon: 'ProdigyUnit', label: 'Prodigy unit' },
  { icon: 'CryoPlatform', label: 'CryoPlatform' },
  { icon: 'HeCylinder', label: 'He Cylinder' },
  { icon: 'IndoorUnit', label: 'Indoor unit' },
  { icon: 'HPPR', label: 'HPPR' },
  { icon: 'BCU', label: 'BCU' },
  { icon: 'Workstation', label: 'Workstation Desk' },
];

const iconMap = {
  Magnet: require('@/assets/blueprint-icons/Magnet.png'),
  Nanobay: require('@/assets/blueprint-icons/Nanobay.png'),
  Onebay: require('@/assets/blueprint-icons/Onebay.png'),
  Twobay: require('@/assets/blueprint-icons/Twobay.png'),
  SampleCase: require('@/assets/blueprint-icons/Samplecase.png'),
  LN2Dewar: require('@/assets/blueprint-icons/LN2Dewar.png'),
  ProdigyUnit: require('@/assets/blueprint-icons/ProdigyUnit.png'),
  CryoPlatform: require('@/assets/blueprint-icons/CryoPlatform.png'),
  HeCylinder: require('@/assets/blueprint-icons/HeCylinder.png'),
  IndoorUnit: require('@/assets/blueprint-icons/IndoorUnit.png'),
  HPPR: require('@/assets/blueprint-icons/HPPR.png'),
  BCU: require('@/assets/blueprint-icons/BCU.png'),
  Workstation: require('@/assets/blueprint-icons/WorkstationDesk.png'),
};

// 상단은 그대로 유지

export default function BlueprintEditorScreen() {
    const [roomWidth, setRoomWidth] = useState(700);
    const [roomHeight, setRoomHeight] = useState(500);
    const [gridItems, setGridItems] = useState([]);
  
    const addItem = (icon, label) => {
      setGridItems(prev => [...prev, { icon, label, id: Date.now() + Math.random() }]);
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📐 도면 만들기 (Snap to Grid)</Text>
  
        <View style={styles.inputRow}>
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>가로</Text>
            <TextInput
              value={roomWidth.toString()}
              onChangeText={text => setRoomWidth(Number(text))}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>세로</Text>
            <TextInput
              value={roomHeight.toString()}
              onChangeText={text => setRoomHeight(Number(text))}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        </View>
  
        <View style={styles.iconRow}>
          {icons.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => addItem(item.icon, item.label)}>
              <Image source={iconMap[item.icon]} style={styles.iconImage} />
              <Text style={styles.iconLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
  
        <Text style={styles.layoutLabel}>📐 배치도</Text>
  
        <ScrollView horizontal contentContainerStyle={{ minWidth: roomWidth }}>
          <ScrollView contentContainerStyle={{ minHeight: roomHeight }}>
            <View style={[styles.gridContainer, { width: roomWidth, height: roomHeight }]}>
              {gridItems.map((item, index) => {
                const translateX = useSharedValue(0);
                const translateY = useSharedValue(0);
  
                const gestureHandler = useAnimatedGestureHandler({
                  onStart: (_, ctx) => {
                    ctx.startX = translateX.value;
                    ctx.startY = translateY.value;
                  },
                  onActive: (event, ctx) => {
                    translateX.value = ctx.startX + event.translationX;
                    translateY.value = ctx.startY + event.translationY;
                  },
                });
  
                const style = useAnimatedStyle(() => ({
                  transform: [
                    { translateX: translateX.value },
                    { translateY: translateY.value },
                  ],
                }));
  
                return (
                  <PanGestureHandler key={item.id} onGestureEvent={gestureHandler}>
                    <Animated.View style={[styles.gridItem, style]}>
                      <Image source={iconMap[item.icon]} style={styles.iconImage} />
                      <Text style={styles.iconLabel}>{item.label}</Text>
                    </Animated.View>
                  </PanGestureHandler>
                );
              })}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
  

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 10, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  inputRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  inputBox: { alignItems: 'center', marginHorizontal: 5 },
  inputLabel: { fontSize: 12, color: '#888' },
  input: { borderWidth: 1, padding: 5, minWidth: 60, textAlign: 'center', borderRadius: 4 },
  iconRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginBottom: 10 },
  iconImage: { width: 50, height: 50, resizeMode: 'contain' },
  iconLabel: { fontSize: 10, textAlign: 'center' },
  layoutLabel: { textAlign: 'center', fontWeight: 'bold', marginBottom: 5, color: '#555' },
  gridContainer: { backgroundColor: '#ddd', position: 'relative' },
  gridItem: { position: 'absolute', alignItems: 'center' },
});