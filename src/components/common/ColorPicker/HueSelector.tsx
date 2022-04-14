import React, { useEffect, useRef, useState } from 'react';

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

interface HuePickerProps {
  hueColors: string[];
  hue: number;
  selectorWidth: number;
  selectorHeight: number;
  sliderSize: number;
  onPickerChange: (v1?: number, v2?: number, v3?: number) => void;
}

const HueSelector: React.FC<HuePickerProps> = ({
  hueColors,
  hue,
  selectorWidth,
  selectorHeight,
  sliderSize,
  onPickerChange,
}) => {
  const currentHue = useRef<number>(hue);
  const dragStartValue = useRef<number>(hue);
  const [sliderY, setSliderY] = useState<Animated.Value>(
    new Animated.Value(((selectorWidth + sliderSize / 2) * hue) / 360),
  );

  useEffect(() => {
    currentHue.current = hue;
  }, [hue]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        dragStartValue.current = currentHue.current;
        fireDragEvent(gestureState);
      },
      onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        fireDragEvent(gestureState);
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        fireDragEvent(gestureState);
      },
      onPanResponderTerminate: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        fireDragEvent(gestureState);
      },
      onShouldBlockNativeResponder: () => true,
    }),
  ).current;

  useEffect(() => {
    setSliderY(new Animated.Value(((selectorWidth - sliderSize / 2) * hue) / 360));
  }, [hue, selectorWidth]);

  // Function to calculate the current hue when a drag event occurs
  const computeHueValueDrag = (gestureState: PanResponderGestureState) => {
    const { dx } = gestureState;
    const diff = dx / selectorWidth;
    const updatedHue = normalizeValue(dragStartValue.current / 360 + diff) * 360;
    return updatedHue;
  };

  // Function to calculate the current hue when a press event occurs
  const computeHueValuePress = (event: any) => {
    const { nativeEvent } = event;
    const { locationX } = nativeEvent;
    const updatedHue = normalizeValue(locationX / selectorWidth) * 360;
    return updatedHue;
  };

  const fireDragEvent = (gestureState: PanResponderGestureState) => {
    if (onPickerChange) {
      onPickerChange(computeHueValueDrag(gestureState));
    }
  };

  const firePressEvent = (event: any) => {
    if (onPickerChange) {
      onPickerChange(computeHueValuePress(event));
    }
  };

  return (
    <View style={[styles.mainView, { width: selectorWidth + sliderSize / 2 }]}>
      <TouchableWithoutFeedback
        onPress={firePressEvent}
        style={{ width: selectorWidth, height: selectorHeight }}>
        <LinearGradient
          colors={hueColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: selectorWidth,
            borderRadius: sliderSize,
          }}>
          <View
            style={{
              width: selectorWidth,
              height: selectorHeight,
            }}
          />
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
            backgroundColor: chroma.hsl(hue, 1, 0.5).hex(),
            transform: [
              {
                translateX: sliderY,
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderColor: '#fff',
    borderWidth: 2,
  },
});

export default HueSelector;
