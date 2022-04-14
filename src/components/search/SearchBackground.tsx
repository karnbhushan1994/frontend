import React from 'react';

import { StyleSheet, ViewProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface SearchBackgroundProps extends ViewProps {}
const SearchBackground: React.FC<SearchBackgroundProps> = ({ style, children }) => (
  <LinearGradient
    useAngle={true}
    angle={167}
    colors={['#421566', '#385D5E']}
    style={[styles.container, style]}>
    {children}
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SearchBackground;
