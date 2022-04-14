import React from 'react';

import { Image, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { images } from 'assets/images';
import { normalize } from 'utils';

interface ArrowButtonProps extends TouchableOpacityProps {
  direction: 'forward' | 'backward';
  disabled?: boolean;
  onboarding?: boolean;
}
const ArrowButton: React.FC<ArrowButtonProps> = props => {
  const { direction, disabled, onboarding, style } = props;
  let uri;

  if (direction === 'forward') {
    if (disabled) {
      uri = images.main.arrow_forward_disabled;
    } else {
      uri = images.main.arrow_forward_enabled;
    }
  } else {
    if (onboarding) {
      uri = images.main.onboarding_backarrow;
    } else {
      uri = images.main.arrow_backward;
    }
  }

  return (
    <TouchableOpacity style={[styles.defautSize, style]} {...props}>
      <Image style={styles.image} source={uri} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  defautSize: {
    width: normalize(29),
    height: normalize(25),
  },
});

export default ArrowButton;
