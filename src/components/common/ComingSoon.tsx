import * as React from 'react';

import { StyleSheet, View, Text, Image } from 'react-native';

import { images } from 'assets/images';
import { BackgroundGradientType } from 'types';
import { SCREEN_WIDTH } from 'utils';

import { Background } from '../onboarding';

const ComingSoon: React.FC = () => (
  <Background style={styles.container} gradientType={BackgroundGradientType.Light}>
    <View style={styles.textContainer}>
      <Text style={styles.header}>Coming Soon</Text>
      <Text style={styles.subtext}>Stay tuned! We are working on constructing this page</Text>
    </View>
    <Image source={images.main.coming_soon} style={styles.image} />
  </Background>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  textContainer: {
    marginTop: '30%',
  },
  header: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '4%',
    marginHorizontal: '10%',
  },
  subtext: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '5%',
    marginHorizontal: '10%',
  },
});
export default ComingSoon;
