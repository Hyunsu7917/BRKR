// components/DraggableGridItem.js
import React from 'react';
import { Image, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const DraggableGridItem = ({ item, iconSource }) => {
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.gridItem, style, {
        width: 80 * scaleX,
        height: 80 * scaleY,
        }]}>
        <Image source={iconSource} style={styles.icon} />
        <Text style={styles.label}>{item.label}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  item: { position: 'absolute', alignItems: 'center' },
  icon: { width: 50, height: 50, resizeMode: 'contain' },
  label: { fontSize: 10 },
});

export default DraggableGridItem;
