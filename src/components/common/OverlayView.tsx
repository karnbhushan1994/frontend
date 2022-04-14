import React from 'react';

import { View, StyleSheet } from 'react-native';

/**
 * A blurred & darkened view that grows to its parents size. Designed to be used with overlaid components.
 * @param children - children of this component.
 */
const OverlayView: React.FC = ({ children }) => <View style={styles.overlayView}>{children}</View>;

const styles = StyleSheet.create({
  overlayView: {
    flex: 1,
    backgroundColor: '#00000080',
  },
});

export default OverlayView;
