import React from 'react';

import { View, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface RadioCheckboxProps extends TouchableOpacityProps {
  checked: boolean;
}
const RadioCheckbox: React.FC<RadioCheckboxProps> = ({ checked, ...props }) => (
  <TouchableOpacity {...props}>
    <View style={styles.outerCircle}>{checked && <View style={styles.innerCircle} />}</View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  outerCircle: {
    width: 23,
    height: 23,
    borderRadius: 11.5,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#04ffff',
  },
});

export default RadioCheckbox;
