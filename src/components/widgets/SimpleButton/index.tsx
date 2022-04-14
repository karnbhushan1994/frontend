import React from 'react';

import { ActivityIndicator, Image, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { images } from 'assets/images';

import styles from './styles';

interface Props {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loader?: boolean;
  containerStyles?: ViewStyle | ViewStyle[];
}

const SimpleButton: React.FC<Props> = ({ onPress, title, disabled, containerStyles, loader }) => (
  <TouchableOpacity
    disabled={disabled}
    style={[styles.container, containerStyles, disabled && styles.disabled]}
    onPress={onPress}>
    {loader ? (
      <ActivityIndicator />
    ) : (
      <>
        {title == 'showCoinInText' ? (
          <Text style={styles.title}>
            Unlock <Image source={images.main.score_coin} style={styles.coin} /> 30
          </Text>
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </>
    )}
  </TouchableOpacity>
);

export default SimpleButton;
