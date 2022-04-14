import * as React from 'react';

import { StackNavigationProp } from '@react-navigation/stack';
import { Image, StyleSheet, Text, View } from 'react-native';

import { images } from 'assets/images';
import { Background, TaggSquareButton } from 'components';
import { OnboardingStackParams } from 'routes';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from 'types';
import { SCREEN_WIDTH, track } from 'utils';

type WelcomeScreenNavigationProps = StackNavigationProp<OnboardingStackParams, 'WelcomeScreen'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProps;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => (
  <Background style={styles.container} gradientType={BackgroundGradientType.Light}>
    <Image source={images.main.welcome} style={styles.image} />

    <View>
      <Text style={styles.header}>Welcome to TAGG!</Text>
      <Text style={styles.subtext}>
        Tagg is the new social networking platform for you! It will help you create your own
        personalized digital space where you can express who you are, along with all the moments
        that comprehensively define you!
      </Text>
    </View>
    <TaggSquareButton
      onPress={() => {
        track('NextButton', AnalyticVerb.Pressed, AnalyticCategory.Onboarding);
        navigation.navigate('BasicInfoOnboarding', { isPhoneVerified: false });
      }}
      title={'Next'}
      buttonStyle={'large'}
      buttonColor={'purple'}
      labelColor={'white'}
      style={styles.nextButton}
    />
  </Background>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    /**
     * Set primary axis to column
     * Align items to centre along that primary axis and the secondary axis as well
     */
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
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
    marginBottom: '15%',
    marginHorizontal: '10%',
  },
  nextButton: {
    marginBottom: '15%',
  },
});
export default WelcomeScreen;
