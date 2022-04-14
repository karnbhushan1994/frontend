import React from 'react';

import { Image, ImageProps, TextStyle, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles';

interface Props {
  onPress: () => void;
  title?: string;
  buttonStyles?: ViewStyle;
  buttonTextStyles?: TextStyle;
  disabled?: boolean;
  looked?: boolean;
  buttonStartIcon?: ImageProps;
}

export const ButtonWithGradientBackground: React.FC<Props> = ({
  onPress,
  title,
  buttonStyles,
  disabled,
  buttonStartIcon,
  looked,
  buttonTextStyles,
}) => (
  <>
    {disabled ? (
      <View style={[styles.disabled, buttonStyles ? buttonStyles : {}]}>
        {buttonStartIcon ? (
          <Image
            source={buttonStartIcon}
            style={[styles.disableIcon, looked && styles.marginLeftAuto]}
            resizeMode={'contain'}
          />
        ) : null}
        <Text style={[styles.buttonText, looked && styles.center]}>{title ? title : 'Add'}</Text>
      </View>
    ) : (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient
          colors={['#A634FF', '#6EE7E7']}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={[styles.linearGradient, buttonStyles ? buttonStyles : {}]}>
          <Text style={buttonTextStyles ? buttonTextStyles : styles.buttonText}>
            {title ? title : 'Add'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    )}
  </>
);
