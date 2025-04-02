import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, LongPressGestureHandler } from 'react-native-gesture-handler';
import { ICON_SPECS } from '@/constants/iconData';

const DraggableGridItem = ({
  item,
  iconSource,
  zoomLevel = 1,
  onDelete,
  roomWidth,
  displayRoomWidth,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const [showButtons, setShowButtons] = useState(false);

  const original = ICON_SPECS[item.label] || { width: 800, height: 800 };

  // ✅ 정밀 비율 계산 유지
  const scaleRatio = (displayRoomWidth / roomWidth) * zoomLevel;
  const scaledWidth = original.width * scaleRatio;
  const scaledHeight = original.height * scaleRatio;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

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

  const handlePress = () => {
    setShowButtons(true);
    setTimeout(() => setShowButtons(false), 2000);
  };

  const handleRotate = () => {
    rotation.value = withTiming((rotation.value + 45) % 360);
  };

  return (
    <LongPressGestureHandler onActivated={handlePress} minDurationMs={200}>
      <Animated.View
        style={[styles.gridItem, animatedStyle, { width: scaledWidth, height: scaledHeight }]}
      >
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={{ flex: 1, width: '100%', height: '100%' }}>
            <Image
              source={iconSource}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
            <Text style={styles.label}>{item.label}</Text>

            {showButtons && (
              <>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => onDelete?.(item.id)}
                >
                  <Text>❌</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rotateButton}
                  onPress={handleRotate}
                >
                  <Text style={{ fontSize: 12 }}>🔄</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    bottom: -12,
    fontSize: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    padding: 2,
    borderRadius: 4,
    elevation: 2,
  },
  rotateButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 2,
    borderRadius: 4,
    elevation: 2,
  },
});

export default DraggableGridItem;
