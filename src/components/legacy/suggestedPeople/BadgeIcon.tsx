import React from 'react';

import { useNavigation } from '@react-navigation/core';
import { Image, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {
  AnalyticCategory,
  AnalyticVerb,
  ScreenType,
} from '../../../types';
import {normalize, track} from '../../../utils';

interface BadgeIconProps {
  badge: BadgeDisplayType;
  screenType: ScreenType;
  style?: StyleProp<ViewStyle>;
}

const BadgeIcon: React.FC<BadgeIconProps> = ({ badge, screenType, style }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.badgeButton, style]}
      onPress={() => {
        track('BadgeIcon', AnalyticVerb.Pressed, AnalyticCategory.Profile, {
          badge: badge.name,
        });
        navigation.navigate('MutualBadgeHolders', {
          badge,
          screenType,
        });
      }}>
      <LinearGradient
        colors={['#4E3629', '#EC2027']}
        useAngle={true}
        angle={154.72}
        angleCenter={{ x: 0.5, y: 0.5 }}
        style={styles.badgeBackground}>
        <Image source={badge.image} style={styles.icon} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badgeBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeButton: {
    width: normalize(30),
    height: normalize(30),
    borderRadius: 30,
  },
  icon: {
    width: '60%',
    height: '60%',
  },
});

export default BadgeIcon;
