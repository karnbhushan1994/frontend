import React from 'react';

import { useNavigation } from '@react-navigation/core';
import LottieView from 'lottie-react-native';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

import { isIPhoneX, normalize, SCREEN_HEIGHT } from 'utils';

import { icons, tutorialTitles } from '../../../assets/profileTutorialVideos/index';
import { tutorialGIFs } from '../../../assets/profileTutorialVideos/lotties/index';

const TaggsTutorialScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#A4FFDE', '#00C2D2']} end={{ x: 0, y: 0 }} start={{ x: 0, y: 0 }}>
      <StatusBar barStyle="light-content" translucent={false} />
      <View style={styles.mainView}>
        <LottieView style={styles.gif} source={tutorialGIFs.addTagg} autoPlay loop />
        <SvgXml
          xml={tutorialTitles.Taggs}
          width={350}
          height={isIPhoneX() ? 62 : 52}
          style={styles.title}
        />
        <Text style={styles.subText}>
          Taggs are branding tools that allow you to show all you want!
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EditTaggsTutorialScreen');
          }}
          style={styles.button}>
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
  mainView: {
    height: SCREEN_HEIGHT,
    top: '5%',
  },
  gif: {
    width: normalize(169),
    height: isIPhoneX() ? normalize(375) : normalize(350),
    alignSelf: 'center',
  },
  title: {
    marginBottom: '5%',
    alignSelf: 'center',
    zIndex: 2,
    marginTop: '10%',
  },
  subText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: isIPhoneX() ? normalize(20) : normalize(18),
    lineHeight: normalize(28),
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: '5%',
    zIndex: 2,
  },
  button: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: isIPhoneX() ? '10%' : '6%',
    bottom: isIPhoneX() ? '18%' : '11%',
    zIndex: 10,
  },
});
export default TaggsTutorialScreen;
