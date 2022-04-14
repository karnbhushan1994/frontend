import React from 'react';

import LottieView from 'lottie-react-native';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { tutorialGIFs } from 'assets/profileTutorialVideos/lotties';
import { updateProfileTutorialStage } from 'store/actions';
import { ProfileTutorialStage } from 'types';
import { isIPhoneX, normalize, SCREEN_HEIGHT } from 'utils';

import { icons, tutorialTitles } from '../../../assets/profileTutorialVideos/index';

const ShareProfileScreen: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <LinearGradient colors={['#BEFFCC', '#77B6C3']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <StatusBar barStyle="light-content" translucent={false} />
      <View style={styles.mainView}>
        <LottieView style={styles.gif} source={tutorialGIFs.shareProfile} autoPlay loop />
        <SvgXml xml={tutorialTitles.ShareProfile} color={'white'} style={styles.title} />
        <Text style={styles.subText}>
          {
            'Link your profile anywhere and let\neveryone see how unique and\ndynamic your brand is 💫'
          }
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            dispatch(updateProfileTutorialStage(ProfileTutorialStage.SHOW_STEWIE_GRIFFIN));
          }}>
          <SvgXml
            xml={icons.NextArrow}
            width={normalize(62)}
            height={isIPhoneX() ? 62 : 52}
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
    marginBottom: isIPhoneX() ? '3%' : 0,
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
  },
  button: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: isIPhoneX() ? '10%' : '6%',
    bottom: isIPhoneX() ? '17%' : '11%',
    zIndex: 10,
  },
});
export default ShareProfileScreen;
