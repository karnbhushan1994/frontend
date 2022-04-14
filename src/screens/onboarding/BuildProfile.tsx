import React from 'react';

import { RouteProp, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';

import { Image, ScrollView, StyleSheet, Text } from 'react-native';

import { Images } from 'assets';

import { Background } from '../../components';
import Button from '../../components/button';
import {
  BUILD_PROFILE_SUBTITLE,
  BUILD_PROFILE_TITLE,
  LIGHT_PURPLE_WHITE,
  LIGTH_GREEN,
  NEXT,
  WHITE,
} from '../../constants';
import { OnboardingStackParams } from '../../routes';
import { BackgroundGradientType } from '../../types';
import { normalize } from '../../utils';
import { onBoardingStyles } from './Styles';

type BuildProfileNavigationProps = StackNavigationProp<OnboardingStackParams, 'BuildProfile'>;
type BuildProfileRouteProps = RouteProp<OnboardingStackParams, 'BuildProfile'>;

interface BuildProfileProps {
  route: BuildProfileRouteProps;
  navigation: BuildProfileNavigationProps;
}

const BuildProfile: React.FC<BuildProfileProps> = ({ route }): React.ReactElement => {
  const navigation = useNavigation();

  const handleNavigate = async () => {
    navigation.navigate('AppTutorialScreen', {
      interests: route.params.interests,
    });
  };
  return (
    <Background style={onBoardingStyles.container} gradientType={BackgroundGradientType.Light}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Text style={styles.title}>{BUILD_PROFILE_TITLE}</Text>
        <Text style={styles.subTitle}>{BUILD_PROFILE_SUBTITLE}</Text>
        <Image source={Images.Onboarding.BuildProfileIllustration} style={styles.image} />
        <Button
          onPress={handleNavigate}
          title={NEXT}
          style={styles.button}
          labelStyle={styles.disableLabel}
          buttonStyle={[styles.label]}
        />
      </ScrollView>
    </Background>
  );
};
const styles = StyleSheet.create({
  title: { color: WHITE, fontWeight: 'bold', fontSize: normalize(34) },
  container: {
    paddingTop: normalize(0),
    paddingLeft: normalize(15),
    paddingRight: normalize(15),
  },
  subTitle: {
    fontWeight: '600',
    color: LIGHT_PURPLE_WHITE,
    fontSize: normalize(18),
    marginTop: normalize(10),
  },
  image: { width: '100%', height: 400, resizeMode: 'contain' },
  scrollView: { height: '60%', marginTop: normalize(20) },
  button: { width: '40%', alignSelf: 'center', marginTop: normalize(40) },
  disableLabel: { color: '#FFFFFF' },
  label: { width: '100%', borderRadius: 5 },
  disableButton: { backgroundColor: LIGTH_GREEN },
});

export default BuildProfile;
