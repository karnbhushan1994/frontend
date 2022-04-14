import React from 'react';

import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { TAGGS_GRADIENT } from '../../constants';

import Avatar from './Avatar';

type AvatarTitleProps = {
  avatar: string | undefined;
};
const AvatarTitle: React.FC<AvatarTitleProps> = ({ avatar }) => (
  <View style={styles.container}>
    <LinearGradient
      colors={[TAGGS_GRADIENT.start, TAGGS_GRADIENT.end]}
      useAngle={true}
      angle={154.72}
      angleCenter={{ x: 0.5, y: 0.5 }}
      style={styles.gradient}
    />
    <Avatar style={styles.avatar} uri={avatar} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: '82%',
    height: '82%',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    position: 'absolute',
    width: '73%',
    height: '73%',
    borderRadius: 1000,
  },
});

export default AvatarTitle;
