import React from 'react';

import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { TAGG_LIGHT_GREY_3 } from '../../../constants';
import ColorSelectorButton from './ColorSelectorButton';

interface GradientBarProps {
  selectedColors: string[];
  colorIndex: number;
  setColorIndex: (value: number) => void;
}
const GradientBar: React.FC<GradientBarProps> = ({ selectedColors, colorIndex, setColorIndex }) => (
  <>
    <View style={styles.mainView}>
      {selectedColors.map((_, index) => (
        <ColorSelectorButton
          colorBoxNumber={index}
          color={selectedColors[index]}
          colorIndex={colorIndex}
          setColorIndex={setColorIndex}
        />
      ))}
    </View>
    <LinearGradient
      colors={selectedColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBar}
    />
  </>
);

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  gradientBar: {
    width: '100%',
    height: 24,
    borderColor: TAGG_LIGHT_GREY_3,
    borderWidth: 1,
  },
});

export default GradientBar;
