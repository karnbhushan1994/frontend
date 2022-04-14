import React from 'react';

import { View, StyleSheet, ViewProps } from 'react-native';

interface CenteredViewProps extends ViewProps {}
/**
 * A centered view that grows to its parents size.
 * @param children - children of this component.
 */
const CenteredView: React.FC<CenteredViewProps> = ({ children, ...props }) => (
  <View style={styles.centeredView} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CenteredView;
