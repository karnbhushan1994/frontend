import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RouteProp, useIsFocused, useNavigation } from '@react-navigation/native';

import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import InAppReview from 'react-native-in-app-review';

import { PERMISSIONS, checkMultiple, checkNotifications } from 'react-native-permissions';

import { useDispatch, useSelector, useStore } from 'react-redux';

import { icons } from 'assets/icons';
import {
  TabsGradient,
  TaggLoadingIndicator,
  UnwrapImageRewardPopup,
  UnwrapThumbnail,
} from 'components';
import { AppUpdate } from 'components/common';

import { MainStackParams } from 'routes/';
import { ExploreTutorialScreen, PostMomentPopup, SharePopup } from 'screens';
import {
  checkIfThumbnailUnlocked,
  getLoginCount,
  unlock_Thumbnail,
  updateUserProfileWidgetApi,
  visitedUserProfile,
} from 'services';
import { setTutorialType, setUserProfileTemplate, showTutorialPopup } from 'store/reducers';
import { RootState } from 'store/rootReducer';

import { ActionSheet } from '../../components/widgets/ActionSheet';
import { AsyncAnalyticsStatusTextList, HOMEPAGE } from '../../constants/constants';
import {
  acceptFriendRequest,
  checkAnalyticsStatusApi,
  declineFriendRequest,
  updateAnalyticStatus,
  updateUserXFriends,
  updateUserXProfileAllScreens,
  widgetsChanged,
} from '../../store/actions';
import {
  AnalyticCategory,
  AnalyticVerb,
  ASYNC_STORAGE_KEYS,
  ProfileContextType,
  ProfileHeaderContextType,
  ProfileTutorialStage,
  RewardType,
  ScreenType,
} from '../../types';
import {
  getUserAsProfilePreviewType,
  gradientColorFormation,
  SCREEN_WIDTH,
  track,
} from '../../utils';
import TemplateFoundationScreen from './TemplateFoundationScreen';
import TemplatePageScreen from './TemplatePageScreen';
import TutorialModal from './tutorialModal/TutorialModal';

export const ProfileContext = React.createContext({} as ProfileContextType);

export const ProfileHeaderContext = React.createContext({} as ProfileHeaderContextType);

type ProfileScreenRouteProps = RouteProp<MainStackParams, 'Profile'>;

const Tab = createMaterialTopTabNavigator();

interface ProfileOnboardingProps {
  route: ProfileScreenRouteProps;
}

const ProfileScreen: React.FC<ProfileOnboardingProps> = ({ route }) => {
  const { screenType, userXId, redirectToPage, showShareModalParm } = route.params;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const state = useStore().getState();
  const ownProfile = userXId === undefined;
  const { name, biography, tagg_score, is_blocked } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId].profile
      : state.user.profile,
  );
  const userId = useSelector((state: RootState) => (userXId ? '' : state.user.user.userId));
  const { username } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId].user
      : state.user.user,
  );
  const {
    avatar,
    cover,
    profile,
    user,
    widgetsDragChanged,
    analyticsStatus = '',
  } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );
  const { moments = [] } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.moments,
  );
  const { momentCategories = [] } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId]
      : state.momentCategories,
  );
  const { environment } = useSelector((state: RootState) => state.appInfo);
  const {
    skin: {
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      template_type: templateChoice,
      bio_text_color: bioTextColor,
      bio_color_start: bioColorStart,
      bio_color_end: bioColorEnd,
    },
    widgetStore,
  } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId].profileTemplate
      : state.user.profileTemplate,
  );
  const [showShareModal, setshowShareModal] = useState<boolean>(false);
  const [unwarpReward, setunwarpReward] = useState<boolean>(false);
  const { userId: loggedInUserId } = useSelector((state: RootState) => state.user.user);
  const [draggingWidgets, setDraggingWidgets] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeTab, setActiveTab] = useState(HOMEPAGE);
  const { profile_tutorial_stage, newRewardsReceived } = useSelector(
    (state: RootState) => state.user.profile,
  );
  const [showPostMomentPopup, setShowPostMomentPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [unwrapCount, setUnwrapCount] = useState<any>(0);
  const [unwarpRewardThumbnail, setunwarpRewardThumbnail] = useState<boolean>(false);

  useEffect(() => {
    if (
      !!newRewardsReceived &&
      newRewardsReceived != null &&
      newRewardsReceived.includes(RewardType.FIRST_MOMENT_POSTED)
    ) {
      navigation.navigate('UnwrapReward', {
        rewardUnwrapping: RewardType.FIRST_MOMENT_POSTED,
        screenType,
      });
    }
  }, [newRewardsReceived]);

  useEffect(() => {
    AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ANALYTICS_ENABLED).then(res => {
      if (res && res === AsyncAnalyticsStatusTextList.ANALYTICS_ENABLED) {
        dispatch(updateAnalyticStatus(res || ''));
      } else if (res && res === AsyncAnalyticsStatusTextList.PROFILE_LINK_COPIED) {
        dispatch(checkAnalyticsStatusApi(res));
      } else {
        dispatch(checkAnalyticsStatusApi());
      }
    });
  }, []);

  useEffect(() => {
    if (analyticsStatus === AsyncAnalyticsStatusTextList.PROFILE_LINK_COPIED) {
      setTimeout(() => {
        navigation.navigate('UnwrapReward', {
          rewardUnwrapping: RewardType.SHARE_PROFILE_TO_ENABLE_ANALYTICS,
          screenType,
        });
      }, 500);
    }
  }, [analyticsStatus]);

  useEffect(() => {
    track('ProfileScreen', AnalyticVerb.Visited, AnalyticCategory.Profile, {
      ownProfile,
      userXId,
      activeTab,
    });
    if (userXId) {
      visitedUserProfile(userXId, loggedInUserId);
    }
  }, []);

  useEffect(() => {
    renderRateMe();
  }, []);

  const getToken = async () => {
    if (userId) {
      const token = await AsyncStorage.getItem('token');
      return token;
    }
    return '';
  };

  const helperLoginCount = async (token: string | null) => {
    if (userId && token !== null) {
      const count = await getLoginCount(userId, token);
      return count;
    }
  };

  const renderRateMe = async () => {
    const token = await getToken();
    const count = await helperLoginCount(token);
    if (count === 3) {
      if (InAppReview.isAvailable()) {
        InAppReview.RequestInAppReview()
          .then(hasFlowFinishedSuccessfully => {
            if (hasFlowFinishedSuccessfully) {
              console.log(
                'InAppReview in ios has launched successfully',
                hasFlowFinishedSuccessfully,
              );
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };
  const onPressAcceptFriendRequest = async () => {
    if (userXId) {
      await dispatch(acceptFriendRequest(getUserAsProfilePreviewType(user, profile)));
      await dispatch(updateUserXFriends(userXId, state));
      dispatch(updateUserXProfileAllScreens(userXId, state));
    }
  };
  const onPressDeclineFriendRequest = async () => {
    if (userXId) {
      await dispatch(declineFriendRequest(userXId));
      dispatch(updateUserXProfileAllScreens(userXId, state));
    }
  };
  const checkPermission = () => {
    checkMultiple([PERMISSIONS.IOS.CONTACTS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]).then(
      async statuses => {
        if (statuses[PERMISSIONS.IOS.CONTACTS] != 'granted') {
          await AsyncStorage.setItem('backToProfile', 'backToProfile');
          navigation.navigate('Permissions');
        }
        if (statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] != 'granted') {
          await AsyncStorage.setItem('backToProfile', 'backToProfile');
          navigation.navigate('Permissions');
        }
      },
    );
    checkNotifications().then(async ({ status }) => {
      if (status != 'granted') {
        await AsyncStorage.setItem('backToProfile', 'backToProfile');
        navigation.navigate('Permissions');
      }
    });
  };
  useEffect(() => {
    setTimeout(() => {
      checkPermission();
    }, 6000);
  });
  const is_thumbnailAvialable = async () => {
    const isAvaliableThumnail = await checkIfThumbnailUnlocked();
    if (isAvaliableThumnail.tagg_thumb_image_unlocked) {
      //openImage();
    } else {
      if (isAvaliableThumnail.widget_count) {
        setunwarpRewardThumbnail(true);
      } else {
        // seIsDiablePopupBtn(true);
        // setIsLockVisible(true);
      }
    }
  };
  useEffect(() => {
    if (unwrapCount == 3) {
      callUnwrap();
    }
  }, [unwarpRewardThumbnail]);
  const callUnwrap = async () => {
    const res = await unlock_Thumbnail();
    if (res.tagg_thumb_image_unlocked) {
      console.log('sucesss', res);
    }
  };
  useEffect(() => {
    if (isFocused && screenType === ScreenType.Profile) {
      is_thumbnailAvialable();
      navigation.getParent()?.setOptions({
        tabBarVisible: isEdit || userXId ? false : true,
      });
    } else if (isFocused && screenType === ScreenType.DiscoverMoments) {
      navigation.getParent()?.setOptions({
        tabBarVisible: false,
      });
    }
  }, [isFocused, isEdit, userXId]);

  useEffect(() => {
    if (activeTab && activeTab !== HOMEPAGE) {
      navigation.setOptions({
        gestureEnabled: false,
      });
    } else {
      navigation.setOptions({
        gestureEnabled: true,
      });
    }
  }, [isFocused, activeTab]);

  const returnPages = (item: string) => {
    if (item !== HOMEPAGE) {
      if (ownProfile) {
        return (
          <Tab.Screen
            key={item}
            name={item}
            component={TemplatePageScreen}
            initialParams={{ title: item, setActiveTab }}
          />
        );
      } else {
        for (let i = 0; i < moments.length; i++) {
          if (moments[i].moment_category === item) {
            return (
              <Tab.Screen
                key={item}
                name={item}
                component={TemplatePageScreen}
                initialParams={{ title: item, setActiveTab }}
              />
            );
          }
        }
      }
    }
  };

  const onDonePress = async () => {
    setIsEdit(false);
    if (widgetsDragChanged !== true) {
      return;
    }
    setLoading(true);
    let newWidgetArray = widgetStore?.__TaggUserHomePage__?.map(({ id }, index) => ({
      id,
      order: index,
    }));
    updateUserProfileWidgetApi(userId, newWidgetArray)
      .then(updatedWidgetsStore => {
        if (updatedWidgetsStore) {
          dispatch({
            type: setUserProfileTemplate.type,
            payload: {
              updatedWidgetsStore,
            },
          });
        }
      })
      .finally(() => {
        setLoading(false);
        dispatch(widgetsChanged(false));
      });
  };

  React.useEffect(() => {
    if (redirectToPage) {
      setActiveTab(redirectToPage);
      navigation.navigate(redirectToPage);
    }
  }, [redirectToPage]);

  React.useEffect(() => {
    if (profile_tutorial_stage === ProfileTutorialStage.SHOW_POST_MOMENT_2 && !userXId) {
      setShowPostMomentPopup(true);
    }
  }, [profile_tutorial_stage]);

  useEffect(() => {
    setshowShareModal(false);
    if (showShareModalParm != undefined) {
      setTimeout(() => {
        setshowShareModal(showShareModalParm);
      }, 1200);
    }
  }, [route.params]);

  //---------- tutorial popup flow ----------
  const [popupType, setPopupType] = useState<string>('');
  const { showTutorial, tutorialType } = useSelector((state: RootState) => state.profileTutorial);
  const zIndex = popupType === 'addTagg' ? 1 : 0;

  const playTutorialFlow = profile_tutorial_stage => {
    if (profile_tutorial_stage === ProfileTutorialStage.SHOW_STEWIE_GRIFFIN && ownProfile) {
      setPopupType('addTagg');
      navigation.getParent()?.setOptions({
        tabBarVisible: false,
      });
      dispatch(showTutorialPopup(true));
    }
  };

  useEffect(() => {
    playTutorialFlow(profile_tutorial_stage);
  }, [profile_tutorial_stage]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppUpdate />
      <ProfileContext.Provider
        value={{
          screenType,
          ownProfile,
          userXId,
          templateChoice,
          moments,
          setIsEdit,
          isEdit,
          environment,
          primaryColor,
          secondaryColor,
          draggingWidgets,
          setDraggingWidgets,
          widgetStore,
          setScrollPosition,
          scrollPosition,
          setActiveTab,
          is_blocked,
        }}>
        <ProfileHeaderContext.Provider
          value={{
            name,
            tagg_score,
            biography,
            username,
            profile,
            avatar,
            cover,
            onPressAcceptFriendRequest,
            onPressDeclineFriendRequest,
            bioTextColor,
            bioColorStart,
            bioColorEnd,
          }}>
          {isEdit && (
            <View style={styles.editStateContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('EditPageScreen', {
                    screenType: activeTab,
                    momentCategories,
                  })
                }>
                <Image source={icons.Gear} style={styles.icon} />
                <Text style={styles.text}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => onDonePress()}>
                <Text style={styles.text}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
          <Tab.Navigator
            style={{
              // paddingTop: HeaderHeight,
              backgroundColor: gradientColorFormation(primaryColor)[0],
            }}
            tabBar={() => null}
            initialLayout={{ width: SCREEN_WIDTH }}
            swipeEnabled={true}>
            <Tab.Screen
              key={0}
              name={HOMEPAGE}
              component={TemplateFoundationScreen}
              initialParams={{ setActiveTab }}
            />
            {!is_blocked && momentCategories.map(item => returnPages(item))}
          </Tab.Navigator>
          <ExploreTutorialScreen />
          <PostMomentPopup
            visible={showPostMomentPopup}
            setVisible={setShowPostMomentPopup}
            screenType={screenType}
          />
          <SharePopup
            visible={showShareModal ? showShareModal : false}
            setVisible={setshowShareModal}
          />
          <UnwrapImageRewardPopup visible={unwarpReward} setVisible={setunwarpReward} />
          <UnwrapThumbnail
            visible={unwarpRewardThumbnail}
            setVisible={setunwarpRewardThumbnail}
            setCount={setUnwrapCount}
          />
          {ownProfile && activeTab === HOMEPAGE ? (
            <ActionSheet
              screenType={activeTab}
              activeTab={activeTab}
              momentCategories={momentCategories}
              style={{ zIndex }}
              onPress={async () => {
                dispatch(showTutorialPopup(false));
                if (popupType === 'addTagg') {
                  setPopupType('share');
                  dispatch(setTutorialType('share'));
                  navigation.getParent()?.setOptions({
                    tabBarVisible: false,
                  });
                  dispatch(showTutorialPopup(true));
                } else {
                  navigation.getParent()?.setOptions({
                    tabBarVisible: true,
                  });
                }
              }}
            />
          ) : (
            <></>
          )}
          <TutorialModal
            visible={showTutorial}
            onDismiss={() => {
              navigation.getParent()?.setOptions({
                tabBarVisible: true,
              });
              dispatch(showTutorialPopup(false));
              dispatch(setTutorialType(''));
              setPopupType('');
            }}
            type={tutorialType}
            templateType={templateChoice}
          />
          {loading ? <TaggLoadingIndicator fullscreen /> : null}
        </ProfileHeaderContext.Provider>
      </ProfileContext.Provider>
      <TabsGradient />
    </>
  );
};

const styles = StyleSheet.create({
  editStateContainer: {
    width: '100%',
    top: 50,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99999,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 15,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  icon: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
    marginRight: 5,
  },
});

export default ProfileScreen;
