import React, { Fragment, useEffect } from 'react';

import { BlurView } from '@react-native-community/blur';
import { useNavigation } from '@react-navigation/native';
import { Image, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { isIPhoneX, normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';
import {images} from "assets/images";

const SuggestedPeopleWelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerBackImage: () => <Fragment />,
    });
  }, []);

  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <Image
        style={styles.backgroundImage}
        source={
          isIPhoneX()
            ? images.main.suggested_people_preview_large
            : images.main.suggested_people_preview_small
        }
        resizeMode={'cover'}
      />
      <BlurView blurType={'light'} blurAmount={1}>
        <SafeAreaView style={styles.container}>
          <Image style={styles.logo} source={images.main.tagg_logo} />
          <Text style={styles.body}>
            Welcome to the suggested people's page where you can discover new people!{'\n\n'}Let's
            get you set up!
          </Text>
        </SafeAreaView>
      </BlurView>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('UpdateSPPicture', { editing: false })}>
        <SvgXml xml={icons.UpArrow} color={'white'} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
  },
  logo: {
    width: normalize(120),
    height: normalize(120),
    marginTop: '25%',
  },
  body: {
    fontSize: normalize(20),
    lineHeight: normalize(25),
    textAlign: 'center',
    fontWeight: '700',
    color: 'white',
    marginTop: '5%',
    width: SCREEN_WIDTH * 0.8,
  },
  nextButton: {
    position: 'absolute',
    color: 'white',
    transform: [{ rotate: '90deg' }],
    width: normalize(70),
    aspectRatio: 0.86,
    bottom: SCREEN_HEIGHT * 0.1,
    right: '5%',
  },
});
export default SuggestedPeopleWelcomeScreen;
