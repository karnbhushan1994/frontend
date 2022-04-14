import React from 'react';

import MaskedView from '@react-native-community/masked-view';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import { normalize, SCREEN_WIDTH } from 'utils';

import { TAGG_LIGHT_BLUE_2, TAGG_PURPLE } from '../../constants';

interface GradientBorderButtonProps {
  text: string;
  darkStyle: boolean;
  onPress: () => void;
}

const GradientBorderButton: React.FC<GradientBorderButtonProps> = ({
  text,
  darkStyle,
  onPress,
}) => {
  const labelColor = darkStyle ? 'white' : '#828282';
  const borderWidth = darkStyle ? 2 : 1;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <MaskedView
        maskElement={
          <View style={[styles.gradientContainer, styles.maskBorder, { borderWidth }]} />
        }>
        <LinearGradient
          colors={[TAGG_PURPLE, TAGG_LIGHT_BLUE_2]}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={styles.gradientContainer}
        />
      </MaskedView>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: labelColor }]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  gradientContainer: {
    width: SCREEN_WIDTH / 2 - 40,
    height: 43,
    borderRadius: 20,
  },
  label: {
    fontWeight: '500',
    fontSize: normalize(14),
    textAlign: 'center',
  },
  maskBorder: {
    borderRadius: 20,
  },
  textContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH / 2 - 40,
    height: 43,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GradientBorderButton;
