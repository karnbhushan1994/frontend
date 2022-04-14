import React from 'react';

import { ImageStyle, StyleProp, StyleSheet, ViewProps } from 'react-native';
import { Image, Text, View } from 'react-native-animatable';

import { UniversityType } from 'types';
import { getUniversityBadge, getUniversityClass, normalize } from 'utils';

export interface UniversityIconProps extends ViewProps {
  university: UniversityType;
  university_class?: number;
  imageStyle?: StyleProp<ImageStyle>;
  needsShadow?: boolean;
  layout?: { left: number; top: number; width: number; height: number } | null;
}

/**
 * Component to display university icon and class
 */
const UniversityIcon: React.FC<UniversityIconProps> = ({
  style,
  university,
  university_class,
  imageStyle,
  needsShadow = false,
}) => (
  <View style={[styles.container, style]}>
    <View style={needsShadow && styles.shadowStyle}>
      <Image source={getUniversityBadge(university, 'Crest')} style={[styles.icon, imageStyle]} />
    </View>
    {university_class && (
      <Text style={styles.univClass}>{getUniversityClass(university_class)}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  univClass: {
    fontSize: normalize(14),
    fontWeight: '500',
  },
  icon: {
    width: normalize(12),
    height: normalize(13),
  },
  shadowStyle: {
    padding: 5,
    borderRadius: 30,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    backgroundColor: 'white',
  },
});

export default UniversityIcon;
