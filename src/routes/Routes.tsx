import { HOMEPAGE } from 'constants';

import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';

import NetInfo from '@react-native-community/netinfo';

import messaging from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';

import Banner from 'components/Banner';
import OfflineBannerComponent from 'components/offlineBanner';

import { makeAction } from 'makeAction';
import { navigate } from 'RootNavigation';

import { ActiveScreenProps, ASYNC_STORAGE_KEYS, InternetBanner, ProfileTutorialStage } from 'types';

import { fcmService } from '../services';
import {
  updateNewNotificationReceived,
  updateNewVersionAvailable,
  updateProfileTutorialStage,
} from '../store/actions';
import { RootState } from '../store/rootReducer';
import { haveUnreadNotifications, userLogin } from '../utils';

import OnboardingStackBaseScreen from './onboarding/OnboardingStackBaseScreen';

import NavigationBar from './tabs';

const Routes: React.FC<ActiveScreenProps> = ({ activeScreen }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state: RootState) => state.user.user);
  const { avatar } = useSelector((state: RootState) => state.user);
  const { newVersionAvailable } = useSelector((state: RootState) => state.appInfo);
  const { profile_tutorial_stage } = useSelector((state: RootState) => state.user.profile);
  const banner = useSelector((store: RootState) => store.banner);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const { newNotificationReceived } = useSelector((state: RootState) => state.user);

  /**
   * Function to log user in and determine if tutorial
   * needs to be displayed before user enters the app
   * showTutorial is set everytime profile_tutorial_stage is updated
   *
   * NOTE:
   * SplashScreen is the actual react-native's splash screen.
   * We can hide / show it depending on our application needs.
   */
  const triggerUserLogin = async () => {
    const shouldShowTutorial = async () => {
      setShowTutorial(
        (await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.PROFILE_TUTORIAL_STAGE)) === '0',
      );
      if (showTutorial) {
        dispatch(updateProfileTutorialStage(ProfileTutorialStage.SHOW_STEWIE_GRIFFIN));
      }
    };
    await shouldShowTutorial();
    if (!userId) {
      userLogin(dispatch, { userId: '', username: '' });
    } else {
      SplashScreen.hide();
    }
  };

  useEffect(() => {
    messaging().onMessage(() => {
      dispatch(updateNewNotificationReceived(true));
    });

    triggerUserLogin();
  }, [dispatch, userId, profile_tutorial_stage]);

  useEffect(() => {
    if (userId) {
      fcmService.setUpPushNotifications();
      fcmService.sendFcmTokenToServer();
    }
  });
  useEffect(() => {
    haveUnreadNotifications(notifications).then(haveUnread => {
      if (haveUnread) {
        dispatch(updateNewNotificationReceived(true));
      } else {
        dispatch(updateNewNotificationReceived(false));
      }
    });
  }, [notifications]);

  useEffect(() => {
    dispatch(updateNewVersionAvailable());
  }, []);
  useEffect(() => {
    NetInfo.fetch().then(state => {
      console.log(state);
      NetInfo.addEventListener(state => {
        dispatch(makeAction(InternetBanner.SHOW, !state.isInternetReachable));
      });
    });
  }, []);
  return userId && !newVersionAvailable ? (
    <>
      <Banner
        show={banner.show}
        bannerImg={{ uri: avatar }}
        actionText={banner.text}
        point={banner.point}
        onPress={() => navigate(HOMEPAGE)}
      />
      <NavigationBar activeScreen={activeScreen} count={newNotificationReceived} />
      <OfflineBannerComponent />
    </>
  ) : (
    <>
      <OnboardingStackBaseScreen />
      <OfflineBannerComponent />
    </>
  );
};

export default Routes;
