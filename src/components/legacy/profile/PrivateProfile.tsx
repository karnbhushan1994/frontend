import React from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';


import { PRIVATE_ACCOUNT } from '../../../constants/strings';
import { normalize, SCREEN_HEIGHT } from 'utils';
import {images} from "assets/images";

const PrivateProfile: React.FC = () => (
  <View style={styles.container}>
    <Image source={images.main.private_profile} />
    <View style={styles.privateAccountTextContainer}>
      <Text style={styles.privateAccountTextStyle}>{PRIVATE_ACCOUNT}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    height: SCREEN_HEIGHT * 0.4,
    paddingBottom: SCREEN_HEIGHT * 0.1,
  },
  privateAccountTextContainer: { marginTop: '8%' },
  privateAccountTextStyle: {
    fontWeight: '600',
    fontSize: normalize(18),
    lineHeight: normalize(25),
    color: '#828282',
  },
});

export default PrivateProfile;
