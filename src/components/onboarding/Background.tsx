import React from 'react';

import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { BackgroundGradientType } from 'types';

import { BACKGROUND_GRADIENT_MAP, BACKGROUND_GRADIENT_STYLE } from '../../constants';
import { CenteredView } from '../common';

interface BackgroundProps extends ViewProps {
  centered?: boolean;
  gradientType: BackgroundGradientType;
}
const Background: React.FC<BackgroundProps> = props => {
  const { centered, gradientType, children } = props;
  return (
    <LinearGradient
      colors={BACKGROUND_GRADIENT_MAP[gradientType]}
      start={BACKGROUND_GRADIENT_STYLE.start}
      end={BACKGROUND_GRADIENT_STYLE.end}
      style={styles.container}>
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        {centered ? (
          <CenteredView style={styles.container} {...props}>
            {children}
          </CenteredView>
        ) : (
          <SafeAreaView {...props}>{children}</SafeAreaView>
        )}
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Background;
