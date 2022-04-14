import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image, Linking, Modal, StatusBar, TouchableOpacity, View, AppState } from 'react-native';
import { Text } from 'react-native-animatable';

import LinearGradient from 'react-native-linear-gradient';
import SplashScreen from 'react-native-splash-screen';
import { SvgXml } from 'react-native-svg';
import { ToastType, useToast } from 'react-native-toast-notifications';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';

import { Images, Videos } from '../../../assets';
import frontarrowSvg from '../../../assets/icons/front-arrow-white.svg';
import { TaggToast, UpdateRequired } from '../../../components';
import Button from '../../../components/button';
import {
  ALREADY_ACCOUNT,
  CREATE_ACCOUNT,
  ERROR_MESSAGE,
  LOGIN_TITLE,
  SKIP_TITLE,
  SKIP_TIME,
  I_AGREE_FOR_POLICY,
  TERM_OF_SERVICES,
} from '../../../constants';
import { MainStackParams, OnboardingStackParams } from '../../../routes';
import { RootState } from '../../../store/rootReducer';
import { AnalyticCategory, AnalyticVerb, TaggToastType } from '../../../types';
import { handleDeepLinkNavigations, openTaggLink, track } from '../../../utils';
import { styles } from './Style';

type LandingPageNavigationProps = StackNavigationProp<OnboardingStackParams, 'LandingPage'>;

type LandingPageRouteProps = RouteProp<MainStackParams, 'LandingScreen'>;
interface LandingPageProps {
  navigation: LandingPageNavigationProps;
  route: LandingPageRouteProps;
}

const LandingPage: React.FC<LandingPageProps> = ({
  navigation,
  route,
}: LandingPageProps): React.ReactElement => {
  const focused = useIsFocused();
  const [videoPaused, toggleVideoPaused] = useState(false);
  const [appActive, setAppActive] = useState(false);

  const handleAppStateChange = (nextAppState: any) => {
    if (nextAppState === 'active') {
      setAppActive(true);
    } else {
      setAppActive(false);
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => AppState.removeEventListener('change', handleAppStateChange);
  }, []);

  useEffect(() => {
    appActive ? toggleVideoPaused(false) : toggleVideoPaused(true);
  }, [appActive]);

  const [watchedIntroVideo, setWatchedIntroVideo] = useState<boolean>(true);
  const [underFifteenSeconds, setunderFifteenSeconds] = useState<boolean>(true);
  const toast: ToastType = useToast();
  const { newVersionAvailable } = useSelector((state: RootState) => state.appInfo);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 100);
  });

  useEffect(() => {
    const handler = async (url: string) => {
      const success = await handleDeepLinkNavigations(url, navigation);
      if (!success) {
        TaggToast(toast, TaggToastType.Error, ERROR_MESSAGE);
      }
    };
    Linking.removeAllListeners('url');
    Linking.getInitialURL().then(url => {
      if (url) {
        handler(url);
      }
    });
    Linking.addEventListener('url', event => handler(event.url));
  }, []);

  /**
   * Gets from AsyncStorage value indicating if user has watched video or not
   * and sets state to decide if intro video must be played or not
   *  */
  useEffect(() => {
    AsyncStorage.getItem('watchedIntroVideo').then(value => {
      setWatchedIntroVideo(value === 'true');
    });
  }, []);

  const handleIntroVideoEnded = () => {
    setWatchedIntroVideo(true);

    AsyncStorage.setItem('watchedIntroVideo', 'true');
    if (route?.params?.invitationCode) {
      navigation.navigate('Phone', {
        login: true,
      });
    }
  };

  return (
    <>
      {!watchedIntroVideo && (
        <Modal>
          <Video
            onProgress={data => {
              if (data.currentTime >= SKIP_TIME) {
                setunderFifteenSeconds(false);
              } else {
                setunderFifteenSeconds(true);
              }
            }}
            paused={videoPaused}
            onEnd={handleIntroVideoEnded}
            resizeMode={'cover'}
            volume={1}
            ignoreSilentSwitch={'ignore'}
            playInBackground={false}
            source={Videos.tagg_load_screen}
            style={styles.video}
          />
          {!underFifteenSeconds && (
            <View style={styles.skipView}>
              <TouchableOpacity
                style={styles.skipTO}
                onPress={handleIntroVideoEnded}
                disabled={underFifteenSeconds}>
                <Text style={styles.skipButton}>{SKIP_TITLE}</Text>
                <SvgXml height="20" width="20" xml={frontarrowSvg} />
              </TouchableOpacity>
            </View>
          )}
        </Modal>
      )}
      <UpdateRequired visible={newVersionAvailable} />
      {watchedIntroVideo && (
        <Video
          volume={0}
          resizeMode={'cover'}
          repeat={true}
          paused={!focused}
          playInBackground={false}
          source={Videos.moments_login_video}
          style={styles.video}
        />
      )}
      <StatusBar barStyle={'light-content'} />
      <LinearGradient
        style={styles.linearGradient}
        colors={['transparent', '#0F0F0F']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1.0 }}>
        <View style={styles.mainView}>
          <View style={styles.logoView}>
            <Image source={Images.LandingPageBg.Logo} style={styles.logo} />
          </View>
          <View style={styles.buttonsView}>
            <View style={styles.innerButtons}>
              <Button
                onPress={() => {
                  track('SignUpButton', AnalyticVerb.Pressed, AnalyticCategory.Onboarding);
                  navigation.navigate('Phone', {
                    login: false,
                  });
                }}
                applyGradient={true}
                GRADIENT_MAP={0}
                title={CREATE_ACCOUNT}
              />
              {/* <Button
                Icon={Images.LandingPageBg.Fb_Icon}
                applyGradient={false}
                title={FB_BUTTON_TITLE}
              />
              <Button
                Icon={Images.LandingPageBg.Google_Icon}
                applyGradient={false}
                title={GOOGLE_BUTTON_TITLE}
              /> */}
              <TouchableOpacity
                onPress={() => {
                  track('LoginButton', AnalyticVerb.Pressed, AnalyticCategory.Login);
                  navigation.navigate('Phone', {
                    login: true,
                  });
                }}
                style={styles.login}>
                <Text style={styles.loginText}>
                  {ALREADY_ACCOUNT}
                  <Text style={styles.loginStyle}>{LOGIN_TITLE}</Text>
                </Text>
              </TouchableOpacity>
              <View style={styles.policyTextView}>
                <Text style={styles.privacyPolicy}>
                  {I_AGREE_FOR_POLICY}
                  <Text
                    onPress={() => {
                      openTaggLink('https://www.tagg.id/terms-of-service');
                    }}
                    style={styles.loginStyle}>
                    {TERM_OF_SERVICES}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

export default LandingPage;
