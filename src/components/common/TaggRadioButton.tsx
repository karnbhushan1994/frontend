import React from 'react';

import { GestureResponderEvent, StyleSheet, TouchableOpacity, View } from 'react-native';

import { RADIO_BUTTON_GREY, TAGG_LIGHT_BLUE_2 } from '../../constants/constants';

interface TaggRadioButtonProps {
  pressed: boolean;
  onPress: (event: GestureResponderEvent) => void;
}
const TaggRadioButton: React.FC<TaggRadioButtonProps> = ({ pressed, onPress }) => {
  const activeOuterStyle = {
    borderColor: pressed ? TAGG_LIGHT_BLUE_2 : RADIO_BUTTON_GREY,
  };

  const activeInnerStyle = {
    backgroundColor: pressed ? TAGG_LIGHT_BLUE_2 : 'white',
  };
  return (
    <TouchableOpacity style={[styles.outer, activeOuterStyle]} onPress={onPress}>
      {pressed && <View style={[styles.inner, activeInnerStyle]} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderRadius: 20,

    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 14,
    height: 14,
    borderRadius: 8,
  },
});

export default TaggRadioButton;
