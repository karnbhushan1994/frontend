import React from 'react';

import { useNavigation } from '@react-navigation/core';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

import { isIPhoneX, normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

import { icons, tutorialTitles } from '../../../assets/profileTutorialVideos/index';

const ProfileWelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#8F00FF', '#6EE7E7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <StatusBar barStyle="light-content" translucent={false} />
      <View style={styles.mainView}>
        <SvgXml xml={icons.FireEmoji} style={styles.fireEmoji} />
        <SvgXml xml={icons.KissEmoji} style={styles.kissEmoji} />
        <SvgXml xml={icons.StarryEyesEmoji} style={styles.starryEyesEmoji} />
        <SvgXml xml={icons.TongueOutEmoji} style={styles.tongueOutEmoji} />
        <Image
          source={icons.LaughEmoji}
          resizeMethod={'resize'}
          resizeMode={'contain'}
          width={10}
          height={10}
          style={styles.laughEmoji}
        />
        <SvgXml xml={tutorialTitles.Welcome} style={styles.title} />
        <Text style={styles.subText}>
          {
            "Sharing whatever content you're\npassionate about allows you to uncover\nthe beauty of being your favorite self\nat all times!"
          }
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TaggsTutorialScreen')}>
          <SvgXml
            xml={icons.NextArrow}
            width={normalize(62)}
            height={normalize(62)}
            color={'white'}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fireEmoji: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.01,
    left: SCREEN_WIDTH * 0.1,
  },
  laughEmoji: {
    position: 'absolute',
    bottom: isIPhoneX() ? SCREEN_HEIGHT * 0.3 : SCREEN_HEIGHT * 0.2,
    right: SCREEN_WIDTH * 0.05,
    width: 120,
    height: 120,
  },
  kissEmoji: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.13,
    right: SCREEN_WIDTH * 0.08,
  },
  starryEyesEmoji: {
    position: 'absolute',
    bottom: isIPhoneX() ? SCREEN_HEIGHT * 0.18 : SCREEN_HEIGHT * 0.09,
    left: isIPhoneX() ? SCREEN_WIDTH * 0.1 : SCREEN_WIDTH * 0.05,
  },
  tongueOutEmoji: {
    position: 'absolute',
    bottom: isIPhoneX() ? SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT * 0.34,
    left: isIPhoneX() ? SCREEN_WIDTH * 0.1 : SCREEN_WIDTH * 0.19,
  },
  mainView: {
    height: SCREEN_HEIGHT,
    top: '3%',
  },
  emojis: {
    position: 'absolute',
    top: isIPhoneX() ? SCREEN_HEIGHT * -0.32 : SCREEN_HEIGHT * -0.53,
    left: isIPhoneX() ? SCREEN_WIDTH * -0.3 : SCREEN_WIDTH * -0.43,
  },
  title: { marginBottom: '5%', alignSelf: 'center', top: '25%', zIndex: 2 },
  subText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: normalize(20),
    lineHeight: normalize(28),
    textAlign: 'center',
    alignSelf: 'center',
    top: '25%',
    paddingHorizontal: '2%',
    zIndex: 2,
  },
  button: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: isIPhoneX() ? '10%' : '6%',
    bottom: isIPhoneX() ? '15%' : '9%',
    zIndex: 2,
  },
});

export default ProfileWelcomeScreen;
