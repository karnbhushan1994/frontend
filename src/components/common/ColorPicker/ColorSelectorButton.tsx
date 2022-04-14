import React from 'react';

import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { TAGG_LIGHT_BLUE, TAGG_LIGHT_GREY_3 } from '../../../constants';

interface ColorSelectorButtonProps {
  color: string;
  colorBoxNumber: number;
  colorIndex: number;
  setColorIndex: (value: number) => void;
}

const ColorSelectorButton: React.FC<ColorSelectorButtonProps> = ({
  color,
  colorBoxNumber,
  colorIndex,
  setColorIndex,
}) => (
  <View style={styles.mainView}>
    <TouchableOpacity
      style={[styles.button, colorIndex === colorBoxNumber ? styles.selected : styles.unselected]}
      onPress={() => setColorIndex(colorBoxNumber)}>
      <View
        style={[
          styles.colorDisplayView,
          {
            backgroundColor: color,
          },
        ]}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  mainView: { alignItems: 'center', justifyContent: 'center' },
  button: {
    width: 30,
    height: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderColor: TAGG_LIGHT_BLUE,
  },
  unselected: {
    borderColor: TAGG_LIGHT_GREY_3,
  },
  colorDisplayView: {
    width: 25,
    height: 25,
  },
});

export default ColorSelectorButton;
