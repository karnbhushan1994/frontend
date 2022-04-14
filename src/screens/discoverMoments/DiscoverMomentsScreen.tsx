import React, { useCallback, useEffect, useRef, useState } from 'react';

import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Animated, FlatList, Linking, StyleSheet, View, ViewToken } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';

import { HomeOffline } from 'components/common/HomeOffline';
import { NoMoreMomentsScreen, PostMomentPopup } from 'screens';
import { RootState } from 'store/rootReducer';
import {
  BackgroundGradientType,
  MomentContextType,
  MomentPostType,
  ProfileTutorialStage,
  ScreenType,
  TaggToastType,
} from 'types';
import {
  handleDeepLinkNavigations,
  incrementMomentShareCount,
  isIPhoneX,
  normalize,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from 'utils';

import {
  Background,
  MomentPost,
  NotificationBell,
  TabsGradient,
  TaggLoadingIndicator,
  TaggToast,
} from '../../components';
import { ERROR_MOMENT_UNAVAILABLE } from '../../constants/strings';
import { MainStackParams } from '../../routes';
import { getLimitedDiscoverMoments, updateDmViewStage } from '../../services';

export const MomentContext = React.createContext({} as MomentContextType);

type DiscoverMomentsScreenRouteProp = RouteProp<MainStackParams, 'DiscoverMoments'>;

interface DiscoverMomentsScreenProps {
  route: DiscoverMomentsScreenRouteProp;
}

let previousLocationY = 0;
const pullLength = 100;

const DiscoverMomentsScreen: React.FC<DiscoverMomentsScreenProps> = () => {
  const scrollRef = useRef<FlatList<MomentPostType>>(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const screenType = ScreenType.DiscoverMoments;
  const { profile_tutorial_stage } = useSelector((state: RootState) => state.user.profile);
  const [moments, setMoments] = useState<MomentPostType[]>([]);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [shouldResetData, setShouldResetData] = useState(false);
  const [hideStatusBar, setHideStatusBar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewableItems, setViewableItems] = useState<ViewToken[]>([]);
  const [showPostMomentModal, setShowPosMomentModal] = useState<boolean>(false);
  const [isLongPressed, setIsLongPressed] = useState(false);

  const { userId: loggedInUserId } = useSelector((state: RootState) => state.user.user);
  // To display error message when moment unavailable
  const toast = useToast();

  const stausBarRef = useRef(hideStatusBar);

  const [currentVisibleMomentId, setCurrentVisibleMomentId] = useState<string | undefined>();

  // https://stackoverflow.com/a/57502343
  const viewabilityConfigCallback = useRef((info: { viewableItems: ViewToken[] }) => {
    setViewableItems(info.viewableItems);
  });
  const netinfo = useSelector((store: RootState) => store.internetState);

  // There is probably a better place to place this logic, e.g. Routes, or App.
  // However, we don't have any stack navigator over there so navigation to
  // SingleMomentScreen is not possible.
  // Have tried designing an extra layer of navigation in our app but things
  // got very tricky.
  // Just going to settle with this approach for now.

  useEffect(() => {
    const handler = async (url: string) => {
      const success = await handleDeepLinkNavigations(url, navigation, screenType);
      if (!success) {
        TaggToast(toast, TaggToastType.Error, ERROR_MOMENT_UNAVAILABLE);
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

  // set loading to false once there are people to display
  useEffect(() => {
    moments.length ? setLoading(false) : setLoading(true);
  }, [moments]);

  useEffect(() => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== null && moments.length > 0) {
        setCurrentVisibleMomentId(moments[index].moment_id);
      }
    }
  }, [viewableItems]);

  useEffect(() => {
    if (viewableItems.length > 0) {
      setHideStatusBar(viewableItems[0].index !== 0);
      stausBarRef.current = viewableItems[0].index !== 0;
    }
  }, [viewableItems]);

  // loads data and append it to users based on current page
  useEffect(() => {
    loadMore();
  }, [page]);

  useEffect(() => {
    if (shouldResetData) {
      if (page !== 0) {
        setPage(0);
      } else {
        loadMore();
      }
    }
  }, [shouldResetData]);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarVisible: true,
      });
    }, [navigation]),
  );

  const loadMore = async () => {
    // Update dm view state to retrieve moments
    updateDmViewStage(loggedInUserId, 0);
    const newMoments = await getLimitedDiscoverMoments(loggedInUserId);
    if (shouldResetData) {
      setMoments([]);
    }
    setMoments(shouldResetData ? newMoments : moments.concat(newMoments));
    setShouldResetData(false);
  };

  const onLongPressMethod = (isPressed: boolean): void => {
    setIsLongPressed(isPressed);
  };

  const isCloseToTop = (nativeEvent: any) => {
    const { locationY } = nativeEvent;
    if (previousLocationY === 0) {
      previousLocationY = locationY;
    } else {
      const onTop = locationY - previousLocationY >= pullLength;
      if (onTop) {
        onRefresh();
        previousLocationY = 0;
      }
    }
  };

  const onRefresh = () => {
    callVibrationheptic();
    setRefreshing(false);
  };

  /**
   * Display post a moment popup if on the right tutorial stage
   * and moment has appeared
   */
  useEffect(() => {
    if (moments.length > 0) {
      if (profile_tutorial_stage === ProfileTutorialStage.SHOW_POST_MOMENT_1) {
        setTimeout(() => {
          setShowPosMomentModal(true);
        }, 500);
      }
    }
  }, [moments]);
  const callVibrationheptic = () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);
  };

  const progress = useDerivedValue(
    () => (refreshing ? withSpring(1) : withSpring(0)),
    [refreshing],
  );
  const iconFade = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [1, 0]);
    return { opacity };
  });
  return (
    <>
      {netinfo.show ? (
        <HomeOffline />
      ) : (
        <>
          <PostMomentPopup
            visible={showPostMomentModal}
            setVisible={setShowPosMomentModal}
            screenType={screenType}
          />
          <View
            style={[styles.notification, { top: isIPhoneX() ? insets.top + 5 : insets.top + 10 }]}>
            <NotificationBell screenType={screenType} style={iconFade} />
          </View>
          {loading ? (
            <>
              <TaggLoadingIndicator fullscreen text />
              <Background gradientType={BackgroundGradientType.Dark} />
            </>
          ) : (
            <MomentContext.Provider
              value={{
                currentVisibleMomentId,
                isDiscoverMoment: true,
              }}>
              <FlatList
                ref={scrollRef}
                bounces={false}
                data={moments}
                windowSize={1}
                renderItem={({ item, index }) => (
                  <Animated.View
                    style={[styles.flatlistItem, {}]}
                    onMoveShouldSetResponder={({ nativeEvent }) =>
                      index === 0 && !isLongPressed ? isCloseToTop(nativeEvent) : null
                    }
                    onTouchEndCapture={() => (previousLocationY = 0)}>
                    {item.moment_id === 'reached-limit-on-discover-moments' ? (
                      <NoMoreMomentsScreen />
                    ) : (
                      <MomentPost
                        moment={item}
                        screenType={screenType}
                        incrementMomentShareCount={() => {
                          if (currentVisibleMomentId) {
                            incrementMomentShareCount(currentVisibleMomentId, moments, setMoments);
                          }
                        }}
                        momentContext={MomentContext}
                        individualScroll={true}
                        index={index}
                        isRefreshing={refreshing}
                        setLongPressed={onLongPressMethod}
                        onItemChange={viewableItems}
                        needToOpenCommentDrawer={false}
                      />
                    )}
                  </Animated.View>
                )}
                keyExtractor={(item, index) => item?.moment_id + index}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={0}
                onViewableItemsChanged={viewabilityConfigCallback.current}
                getItemLayout={(data, index) => ({
                  length: SCREEN_HEIGHT,
                  offset: SCREEN_HEIGHT * index,
                  index,
                })}
                onEndReached={() => updateDmViewStage(loggedInUserId, 1)}
                onEndReachedThreshold={2}
                pagingEnabled
                onScrollEndDrag={() => {
                  callVibrationheptic();
                }}
                onScrollBeginDrag={() => {
                  callVibrationheptic();
                }}
                keyboardShouldPersistTaps="always"
              />
              <TabsGradient />
            </MomentContext.Provider>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    zIndex: 999,
    right: normalize(isIPhoneX() ? 15 : 10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flatlistItem: {
    backgroundColor: 'black',
    zIndex: 99999,
    flex: 1,
  },
  video: {
    // flex: 1,
    // width: '100%',
    // height: '100%',
    // position: 'absolute',
    // scale up (zoom in) a 9:16 video to fill a 9:17.5 screen
    width: isIPhoneX() ? SCREEN_WIDTH * (17.5 / 16) : SCREEN_WIDTH,
    alignSelf: 'center',
  },
  mediaContainer: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default DiscoverMomentsScreen;
