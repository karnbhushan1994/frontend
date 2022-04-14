import React from 'react';

import { StyleSheet, TouchableWithoutFeedback, Keyboard, ViewProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientBackgroundProps extends ViewProps {}
const GradientBackground: React.FC<GradientBackgroundProps> = ({ children }) => (
  <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
    <LinearGradient
      locations={[0.89, 1]}
      colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
      style={styles.container}>
      {children}
    </LinearGradient>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
  },
});

export default GradientBackground;
