import * as React from 'react';

import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { getToggleButtonText, normalize, SCREEN_WIDTH } from 'utils';

import { TAGG_LIGHT_BLUE } from '../../constants';

type ToggleButtonProps = {
  toggleState: boolean;
  handleToggle: Function;
  buttonType: string;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({ toggleState, handleToggle, buttonType }) => {
  const buttonColor = toggleState ? styles.buttonColorToggled : styles.buttonColor;
  const textColor = toggleState ? styles.textColorToggled : styles.textColor;
  return (
    <TouchableOpacity style={[styles.button, buttonColor]} onPress={() => handleToggle()}>
      <Text style={[styles.text, textColor]}>{getToggleButtonText(buttonType, toggleState)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.42,
    height: SCREEN_WIDTH * 0.08,
    borderColor: TAGG_LIGHT_BLUE,
    borderWidth: 2,
    borderRadius: 3,
    marginRight: '2%',
  },
  text: {
    fontWeight: '700',
    fontSize: normalize(15),
    letterSpacing: 1,
  },
  buttonColor: {
    backgroundColor: TAGG_LIGHT_BLUE,
  },
  textColor: { color: 'white' },
  buttonColorToggled: { backgroundColor: 'white' },
  textColorToggled: { color: TAGG_LIGHT_BLUE },
});
export default ToggleButton;
