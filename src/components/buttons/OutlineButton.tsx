import React, { FC, useContext } from 'react';

import { StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import GradientText from 'components/GradientText';

import { ProfileContext } from 'screens/profile/ProfileScreen';
import { gradientColorFormation, normalize } from 'utils';

import { HOMEPAGE } from '../../constants/constants';

const OutlineButton: FC<{
  title?: string;
  icon?: Element;
  selected: boolean;
  onPress: () => void;
}> = props => {
  const { primaryColor, secondaryColor } = useContext(ProfileContext);
  const { title, icon, onPress, selected } = props;
  const colorData = selected
    ? gradientColorFormation(secondaryColor)
    : gradientColorFormation(primaryColor);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      {selected ? (
        <LinearGradient colors={colorData} style={[styles.outlineButton, styles.outLineSpace]}>
          {title ? (
            <GradientText
              colors={gradientColorFormation(selected ? primaryColor : secondaryColor)}
              style={[styles.outlineButtonText]}>
              {title === HOMEPAGE ? 'Home' : title}
            </GradientText>
          ) : (
            <View style={styles.iconPadding}>{icon}</View>
          )}
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={gradientColorFormation(secondaryColor)}
          style={[styles.outlineButton, { borderColor: secondaryColor }]}>
          <LinearGradient
            colors={gradientColorFormation(primaryColor)}
            style={styles.innerContainer}>
            {title ? (
              <GradientText
                colors={gradientColorFormation(secondaryColor)}
                style={[styles.outlineButtonText]}>
                {title === HOMEPAGE ? 'Home' : title}
              </GradientText>
            ) : (
              <View style={styles.iconPadding}>{icon}</View>
            )}
          </LinearGradient>
        </LinearGradient>
      )}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  outlineButton: {
    height: '100%',
    justifyContent: 'center',
    padding: 3,
    marginRight: 10,
    borderRadius: 999,
    // borderWidth: 3,
  },
  outlineButtonText: {
    fontSize: normalize(13),
    fontWeight: 'bold',
  },
  innerContainer: {
    alignItems: 'center',
    height: '100%',
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  iconPadding: {
    paddingHorizontal: 8,
  },
  outLineSpace: { paddingHorizontal: 10 },
});

export default OutlineButton;
