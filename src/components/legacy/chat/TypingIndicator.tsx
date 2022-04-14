import React from 'react';

import { View, Image, StyleSheet } from 'react-native';

import { SCREEN_WIDTH } from 'utils';

const TypingIndicator: React.FC = () => (
  <View style={styles.typingIndicatorContainer}>
    <Image source={require('assets/gifs/loading-animation.gif')} style={styles.image} />
  </View>
);

const styles = StyleSheet.create({
  typingIndicatorContainer: {
    backgroundColor: '#E4F0F2',
    width: 88,
    height: 32,
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: SCREEN_WIDTH * 0.09,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { width: 88, height: 49 },
});

export default TypingIndicator;
