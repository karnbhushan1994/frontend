import React from 'react';

import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';

import { normalize } from 'utils';

import { TAGG_LIGHT_BLUE } from '../../constants';

interface BasicButtonProps {
  title: string;
  onPress: () => void;
  solid?: boolean;
  externalStyles?: Record<string, StyleProp<ViewStyle | TextStyle>>;
}
const BasicButton: React.FC<BasicButtonProps> = ({ title, onPress, solid, externalStyles }) => (
  <View style={[styles.container, externalStyles?.container]}>
    <TouchableOpacity
      style={[styles.genericButtonStyle, solid ? styles.solidButton : styles.outlineButton]}
      onPress={onPress}>
      <Text
        style={[
          styles.buttonTitle,
          externalStyles?.buttonTitle,
          solid ? styles.solidButtonTitleColor : styles.outlineButtonTitleColor,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  genericButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    padding: 0,
    width: '100%',
    height: '100%',
  },
  solidButton: {
    padding: 0,
    backgroundColor: TAGG_LIGHT_BLUE,
  },
  outlineButton: {
    borderWidth: 2,
    backgroundColor: 'white',
    borderColor: TAGG_LIGHT_BLUE,
  },
  solidButtonTitleColor: {
    color: 'white',
  },
  outlineButtonTitleColor: {
    color: TAGG_LIGHT_BLUE,
  },
  buttonTitle: {
    fontSize: normalize(15),
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default BasicButton;
