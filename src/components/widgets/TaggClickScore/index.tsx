import React from 'react';

import { Image, View } from 'react-native';
import { Text } from 'react-native-animatable';

import LinearGradient from 'react-native-linear-gradient';

import { widgetLogo } from 'assets/widgets-logo';
import styles from 'components/widgets/TaggClickScore/styles';

interface TaggClickScoreProps {
  clickCountScore?: number;
}

export const TaggClickScore: React.FC<TaggClickScoreProps> = ({ clickCountScore }) => {
  if (!clickCountScore) {
    return <View />;
  }
  return (
    <>
      <View style={styles.countWrapper}>
        <Image source={widgetLogo.clickCount} style={styles.image} />
        <Text style={styles.countText}>{clickCountScore}</Text>
      </View>
      <LinearGradient
        style={styles.gradientWrapper}
        locations={[0.8, 0]}
        start={{ x: 0.5, y: 0.5 }}
        colors={['rgba(0,0,0,0.45)', 'rgba(0, 0, 0,0)']}
      />
    </>
  );
};
