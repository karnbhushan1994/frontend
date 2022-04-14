import React from 'react';

import { ImageStyle, StyleProp, StyleSheet, ViewProps } from 'react-native';
import { Image, Text, View } from 'react-native-animatable';

import { images } from 'assets/images';
import { UniversityType } from 'types';
import { getUniversityClass, normalize } from 'utils';

export interface UniversityIconClickedProps extends ViewProps {
  university: UniversityType;
  university_class?: number;
  imageStyle?: StyleProp<ImageStyle>;
}

/**
 * Component to display university icon and class
 */
const UniversityIconClicked: React.FC<UniversityIconClickedProps> = ({
  style,
  university,
  university_class,
  imageStyle,
}) => {
  var universityIcon;
  switch (university) {
    case UniversityType.Cornell:
      universityIcon = images.universities.cornellClicked;
      break;
    case UniversityType.Brown:
      universityIcon = images.universities.brownClicked;
      break;
    default:
      universityIcon = images.universities.brownClicked;
      break;
  }

  return (
    <View style={[styles.container, style]}>
      <Image source={universityIcon} style={[styles.icon, imageStyle]} />
      {university_class && (
        <Text style={styles.univClass}>{getUniversityClass(university_class)}</Text>
      )}
    </View>
  );
};

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
    width: normalize(17),
    height: normalize(19),
  },
});

export default UniversityIconClicked;
