import React, { FC } from 'react';

import { StyleSheet, ViewProps, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { normalize } from 'utils';

interface GradientProgressBarProps extends ViewProps {
  progress: Animated.SharedValue<number>;
  toColor: string;
  fromColor: string;
  unfilledColor: string;
}

const GradientProgressBar: FC<GradientProgressBarProps> = ({
  style,
  progress,
  toColor,
  fromColor,
  unfilledColor,
}) => {
  const animatedProgressStyle = useAnimatedStyle<ViewStyle>(() => ({
    width: `${(1 - progress.value) * 100}%`,
  }));
  return (
    <LinearGradient style={[styles.bar, style]} useAngle={true} colors={[fromColor, toColor]}>
      <Animated.View
        style={[
          styles.blank,
          animatedProgressStyle,
          {
            backgroundColor: unfilledColor,
          },
        ]}
      />
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 6.5,
  },
  bar: {
    height: normalize(10),
    borderRadius: 6.5,
    opacity: 1,
  },
  blank: {
    alignSelf: 'flex-end',
    height: normalize(10),
    width: '80%',
  },
});

export default GradientProgressBar;
