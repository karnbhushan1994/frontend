import * as React from 'react';

import { Image, ImageStyle, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

interface TaggLoadingIndicatorProps {
  fullscreen?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  text?: boolean;
  iconStyle?: StyleProp<ImageStyle>;
}

const TaggLoadingIndicator: React.FC<TaggLoadingIndicatorProps> = ({
  fullscreen = false,
  text,
  viewStyle,
  iconStyle,
}) => (
  <View
    style={[
      fullscreen ? styles.fullscreen : {},
      styles.container,
      text ? styles.vertical : styles.horizontal,
      viewStyle,
    ]}>
    {text ? <Text style={styles.text}>One sec! Moments are loading up</Text> : null}
    <Image
      source={require('assets/gifs/loading-animation.gif')}
      style={[styles.icon, text ? styles.imageWithText : styles.imageWithoutText, iconStyle]}
    />
  </View>
);

const styles = StyleSheet.create({
  fullscreen: {
    zIndex: 999,
    position: 'absolute',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  vertical: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    paddingHorizontal: 50,
  },
  imageWithText: { width: '2%', height: '10%' },
  imageWithoutText: { width: '20%', height: '20%' },
  icon: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '40%',
    aspectRatio: 1,
  },
  text: {
    zIndex: 99,
    color: '#fff',
    fontSize: 20,
    marginHorizontal: 40,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default TaggLoadingIndicator;
