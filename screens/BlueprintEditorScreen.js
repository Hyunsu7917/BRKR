import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockIcons = [
  { name: 'Prodigy' },
  { name: 'Magnet' },
  { name: 'LN2 Dewar' },
  { name: 'Autosampler' },
  { name: 'Console' },
];

const BlueprintEditorScreen = () => {
  const [roomWidth, setRoomWidth] = useState('500');
  const [roomHeight, setRoomHeight] = useState('400');
  const [items, setItems] = useState([]);

  const handleAddItem = (icon) => {
    const id = Date.now();
    const newItem = {
      id,
      name: icon.name,
      x: 10,
      y: 10,
    };
    setItems([...items, newItem]);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>도면 만들기</Text>

      {/* Room Size Input */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <TextInput
          placeholder="방 가로 (cm)"
          value={roomWidth}
          onChangeText={setRoomWidth}
          keyboardType="numeric"
          style={{ borderWidth: 1, padding: 8, flex: 1, borderRadius: 8 }}
        />
        <TextInput
          placeholder="방 세로 (cm)"
          value={roomHeight}
          onChangeText={setRoomHeight}
          keyboardType="numeric"
          style={{ borderWidth: 1, padding: 8, flex: 1, borderRadius: 8 }}
        />
      </View>

      {/* Icon Picker */}
      <ScrollView horizontal style={{ marginBottom: 16 }}>
        {mockIcons.map((icon) => (
          <TouchableOpacity
            key={icon.name}
            style={{ backgroundColor: '#ddd', padding: 10, borderRadius: 8, marginRight: 8 }}
            onPress={() => handleAddItem(icon)}
          >
            <Text>{icon.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Canvas Area */}
      <View
        style={{
          flex: 1,
          borderWidth: 2,
          borderColor: '#999',
          borderRadius: 8,
          backgroundColor: '#f0f0f0',
          padding: 12,
        }}
      >
        <Text style={{ marginBottom: 8 }}>도면 캔버스 ({roomWidth} x {roomHeight})</Text>
        {items.map((item) => (
          <View
            key={item.id}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              backgroundColor: '#add8e6',
              padding: 8,
              borderRadius: 4,
            }}
          >
            <Text>{item.name}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default BlueprintEditorScreen;
