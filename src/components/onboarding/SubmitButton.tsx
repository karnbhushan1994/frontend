import React from 'react';

import { TouchableOpacity, TouchableOpacityProps, Text, StyleSheet, View } from 'react-native';

interface SubmitButtonProps extends TouchableOpacityProps {
  text: string;
  color: string;
}

/*
 * A button component that creates a TouchableOpacity in the style of our onboarding buttons. It takes in props to define the text in the TouchableOpacity as well as the background color.
 */
const SubmitButton: React.FC<SubmitButtonProps> = (props: SubmitButtonProps) => {
  const { color, text } = props;
  return (
    <View {...props}>
      <TouchableOpacity {...props} style={[styles.button, { backgroundColor: color }]}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 144,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  text: {
    fontSize: 16,
    color: '#78a0ef',
    fontWeight: 'bold',
  },
});

export default SubmitButton;
