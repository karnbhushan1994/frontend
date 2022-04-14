import React from 'react';

import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

const TabsGradient: React.FC = () => (
  <LinearGradient
    locations={[0, 1]}
    colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
    style={styles.gradient}
  />
);
const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
    top: (SCREEN_HEIGHT / 10) * 9,
    height: SCREEN_HEIGHT / 10,
    width: SCREEN_WIDTH,
  },
});
export default TabsGradient;
