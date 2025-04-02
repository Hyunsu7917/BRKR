import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { iconMap } from '@/constants/iconMap';
import { ICON_SPECS } from '@/constants/iconData';
import DraggableGridItem from '@/components/DraggableGridItem';
import { AntDesign } from '@expo/vector-icons';

export default function BlueprintEditorScreen() {
  const [roomWidth, setRoomWidth] = useState(3500); // mm
  const [roomHeight, setRoomHeight] = useState(4500); // mm
  const [gridItems, setGridItems] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);

  const displayRoomWidth = 350; // px
  const displayRoomHeight = (roomHeight / roomWidth) * displayRoomWidth; // 비율 유지

  const addItem = (icon, label) => {
    setGridItems(prev => [...prev, { icon, label, id: Date.now() + Math.random() }]);
  };
  const removeItem = (id) => {
    setGridItems((prev) => prev.filter((item) => item.id !== id));
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📐 도면 만들기 (Snap to Grid)</Text>

      {/* 가로 세로 입력 */}
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

      {/* 아이콘 목록 */}
      <View style={styles.iconRow}>
        {Object.entries(iconMap).map(([key, source], index) => (
          <TouchableOpacity key={index} onPress={() => addItem(key, key)}>
            <Image source={source} style={styles.iconImage} />
            <Text style={styles.iconLabel}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.layoutLabel}>📐 배치도</Text>

      {/* 줌 컨트롤 */}
      <View style={styles.zoomControls}>
        <TouchableOpacity onPress={() => setZoomLevel(prev => Math.max(0.1, prev - 0.1))}>
          <AntDesign name="minus" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setZoomLevel(prev => prev + 0.1)}>
          <AntDesign name="plus" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal contentContainerStyle={{ minWidth: displayRoomWidth * zoomLevel }}>
        <ScrollView contentContainerStyle={{ minHeight: displayRoomHeight * zoomLevel }}>
          <View
            style={{
              width: displayRoomWidth * zoomLevel,
              height: displayRoomHeight * zoomLevel,
              backgroundColor: '#ddd',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {gridItems.map((item) => (
              <DraggableGridItem
                key={item.id}
                item={item}
                iconSource={iconMap[item.icon]}
                zoomLevel={zoomLevel}
                roomWidth={roomWidth}
                roomHeight={roomHeight}
                displayRoomWidth={displayRoomWidth * zoomLevel}
                displayRoomHeight={displayRoomHeight * zoomLevel}
                onDelete={() => removeItem(item.id)}
              />
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  inputRow: { flexDirection: 'row', marginTop: 10 },
  inputBox: { flex: 1, marginRight: 10 },
  inputLabel: { fontSize: 12 },
  input: { borderWidth: 1, padding: 5 },
  iconRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  iconImage: { width: 40, height: 40 },
  iconLabel: { fontSize: 10, textAlign: 'center' },
  layoutLabel: { marginTop: 10, marginBottom: 5 },
  zoomControls: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
});
