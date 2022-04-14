import React, { FC } from 'react';

import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { normalize, SCREEN_WIDTH } from 'utils';

import { BACKGROUND_GRADIENT_MAP, TAGG_LIGHT_BLUE, TAGG_PURPLE } from '../../constants';

interface TaggSquareButtonProps extends TouchableOpacityProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  buttonStyle: 'normal' | 'large' | 'gradient' | 'customText';
  buttonColor: 'purple' | 'white' | 'blue';
  labelColor: 'white' | 'blue';
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  icon?: Element;
}

const TaggSquareButton: React.FC<TaggSquareButtonProps> = props => {
  const buttonColor = (() => {
    switch (props.buttonColor) {
      case 'purple':
        return { backgroundColor: TAGG_PURPLE };
      case 'blue':
        return { backgroundColor: TAGG_LIGHT_BLUE };
      case 'white':
      default:
        return { backgroundColor: 'white' };
    }
  })();
  const labelColor = (() => {
    switch (props.labelColor) {
      case 'white':
        return { color: 'white' };
      case 'blue':
      default:
        return { color: '#78A0EF' };
    }
  })();
  switch (props.buttonStyle) {
    case 'large':
      return (
        <TouchableOpacity
          {...props}
          onPress={props.onPress}
          style={[styles.largeButton, buttonColor, props.style]}>
          {props.icon}
          <Text style={[styles.largeLabel, labelColor, props.labelStyle]}>{props.title}</Text>
        </TouchableOpacity>
      );
    case 'gradient':
      return (
        <TouchableOpacity {...props} onPress={props.onPress} style={props.style}>
          <LinearGradient
            style={styles.gradientButton}
            colors={BACKGROUND_GRADIENT_MAP[0]}
            useAngle
            angle={90}>
            {props.icon}
            <Text style={[styles.gradientLabel, props.labelStyle]}>{props.title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    case 'customText':
      return (
        <TouchableOpacity
          {...props}
          onPress={props.onPress}
          style={[styles.largeButton, buttonColor, props.style]}>
          {props.children}
        </TouchableOpacity>
      );
    case 'normal':
    default:
      return (
        <TouchableOpacity
          {...props}
          onPress={props.onPress}
          style={[styles.normalButton, buttonColor, props.style]}>
          {props.icon}
          <Text style={[styles.normalLabel, labelColor, props.labelStyle]}>{props.title}</Text>
        </TouchableOpacity>
      );
  }
};

const styles = StyleSheet.create({
  largeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    height: '10%',
    borderRadius: 5,
  },
  largeLabel: {
    fontSize: normalize(26),
    fontWeight: '500',
    color: '#eee',
  },
  normalButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.45,
    aspectRatio: 3.7,
    borderRadius: 5,
    marginBottom: '5%',
  },
  normalLabel: {
    fontSize: normalize(20),
    fontWeight: '500',
  },
  gradientButton: {
    flexDirection: 'row',
    marginTop: '8%',
    borderRadius: 5,
    paddingVertical: '5%',
    aspectRatio: 3.3,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
  gradientLabel: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: normalize(17),
  },
});

export default TaggSquareButton;
