import React, { useEffect, useRef } from 'react';

import chroma from 'chroma-js';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { normalizeValue } from './utils';

interface SaturationSelectorProps {
  hue: number;
  saturation: number;
  value: number;
  selectorWidth: number;
  selectorHeight: number;
  sliderSize: number;
  onPickerChange: (v1?: number, v2?: number, v3?: number) => void;
}

const SaturationSelector: React.FC<SaturationSelectorProps> = ({
  hue,
  saturation,
  value,
  selectorWidth,
  selectorHeight,
  sliderSize,
  onPickerChange,
}) => {
  const dragStartValue = useRef<{
    saturation: number;
    value: number;
  }>({
    saturation: saturation,
    value: value,
  });

  const currentValues = useRef<{
    saturation: number;
    value: number;
  }>({
    saturation: saturation,
    value: value,
  });

  useEffect(() => {
    currentValues.current.saturation = saturation;
    currentValues.current.value = value;
  }, [saturation, value]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (_, gestureState: PanResponderGestureState) => {
        dragStartValue.current.saturation = currentValues.current.saturation;
        dragStartValue.current.value = currentValues.current.value;
        fireDragEvent(gestureState);
      },
      onPanResponderMove: (_, gestureState: PanResponderGestureState) => {
        fireDragEvent(gestureState);
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        fireDragEvent(gestureState);
      },
      onPanResponderTerminate: (_, gestureState: PanResponderGestureState) => {
        fireDragEvent(gestureState);
      },
      onShouldBlockNativeResponder: () => true,
    }),
  ).current;

  const computeSatValDrag = (gestureState: PanResponderGestureState) => {
    const { dx, dy } = gestureState;
    const diffx = dx / selectorWidth;
    const diffy = dy / selectorHeight;
    return {
      newSaturation: normalizeValue(dragStartValue.current.saturation + diffx),
      newValue: normalizeValue(dragStartValue.current.value - diffy),
    };
  };

  const computeSatValPress = (event: GestureResponderEvent) => {
    const { nativeEvent } = event;
    const { locationX, locationY } = nativeEvent;
    return {
      newSaturation: normalizeValue(locationX / selectorWidth),
      newValue: 1 - normalizeValue(locationY / selectorHeight),
    };
  };

  const fireDragEvent = (gestureState: PanResponderGestureState) => {
    if (onPickerChange) {
      const { newSaturation, newValue } = computeSatValDrag(gestureState);
      onPickerChange(hue, newSaturation, newValue);
    }
  };

  const firePressEvent = (event: GestureResponderEvent) => {
    if (onPickerChange) {
      const { newSaturation, newValue } = computeSatValPress(event);
      // setDragStartValue({saturation: newSaturation, value: newValue});
      onPickerChange(hue, newSaturation, newValue);
    }
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            height: selectorHeight + sliderSize,
            width: selectorWidth + sliderSize,
          },
        ]}>
        <TouchableWithoutFeedback onPress={firePressEvent}>
          <LinearGradient
            style={[styles.linearGradient, { width: selectorWidth, height: selectorHeight }]}
            colors={['#fff', chroma.hsl(hue, 1, 0.5).hex()]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <LinearGradient colors={['rgba(0,0,0,0)', '#000']}>
              <View
                style={(styles.linearGradient, { width: selectorWidth, height: selectorHeight })}
              />
            </LinearGradient>
          </LinearGradient>
        </TouchableWithoutFeedback>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.slider,
            {
              width: sliderSize,
              height: sliderSize,
              borderRadius: sliderSize / 2,
              borderWidth: sliderSize / 10,
              backgroundColor: chroma.hsv(hue, saturation, value).hex(),
              transform: [
                { translateX: selectorWidth * saturation },
                { translateY: selectorHeight * (1 - value) },
              ],
            },
          ]}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    top: 0,
    left: 0,
    position: 'absolute',
    borderColor: '#fff',
  },
  linearGradient: {
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default SaturationSelector;
