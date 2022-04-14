import React from 'react';

import { useNavigation } from '@react-navigation/core';
import LottieView from 'lottie-react-native';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

import { tutorialGIFs } from 'assets/profileTutorialVideos/lotties';

import { isIPhoneX, normalize, SCREEN_HEIGHT } from 'utils';

import { icons, tutorialTitles } from '../../../assets/profileTutorialVideos/index';

const EditTaggsTutorialScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#8A39F2', '#E73AE5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <StatusBar barStyle="light-content" translucent={false} />
      <View style={styles.mainView}>
        <LottieView style={styles.gif} source={tutorialGIFs.editTagg} autoPlay loop />
        <SvgXml
          xml={tutorialTitles.EditTaggs}
          color={'white'}
          width={350}
          height={isIPhoneX() ? 62 : 52}
          style={styles.title}
        />
        <Text style={styles.subText}>Once you’ve created a tagg, here is how you can edit it!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PagesTutorialScreen')}>
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
  mainView: { height: SCREEN_HEIGHT, top: '5%' },
  gif: {
    width: normalize(169),
    height: isIPhoneX() ? normalize(375) : normalize(350),
    alignSelf: 'center',
  },
  title: {
    marginBottom: '5%',
    alignSelf: 'center',
    zIndex: 2,
    marginTop: '15%',
  },
  subText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: isIPhoneX() ? normalize(20) : normalize(18),
    lineHeight: normalize(28),
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: '7%',
    zIndex: 2,
  },
  button: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: isIPhoneX() ? '10%' : '6%',
    bottom: isIPhoneX() ? '17%' : '11%',
    zIndex: 10,
  },
});
export default EditTaggsTutorialScreen;
