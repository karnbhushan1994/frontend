import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useScrollToTop } from '@react-navigation/native';
import { LayoutChangeEvent, RefreshControl, StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { MomentUploadProgressBar } from 'components';
import { blockUnblockUser, loadFriendsData, updateUserXFriends } from 'store/actions';
import { EMPTY_PROFILE_PREVIEW_LIST, NO_PROFILE, NO_USER } from 'store/initialStates';
import { ScreenType } from 'types';
import { fetchUserX, getUserAsProfilePreviewType, userLogin } from 'utils';

import { RootState } from '../../../store/rootReducer';
import TaggsBar from '../../taggs/TaggsBar';
import Cover from '../Cover';
import ProfileBody from '../ProfileBody';
import ProfileCutout from '../ProfileCutout';
import ProfileHeader from '../ProfileHeader';
import PublicProfile from '../PublicProfile';

interface ContentProps {
  userXId: string | undefined;
  screenType: ScreenType;
}
const Content: React.FC<ContentProps> = ({ userXId, screenType }) => {
  const dispatch = useDispatch();
  const { user = NO_USER, profile = NO_PROFILE } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );
  const { blockedUsers = EMPTY_PROFILE_PREVIEW_LIST } = useSelector(
    (state: RootState) => state.blocked,
  );
  const { user: loggedInUser = NO_USER } = useSelector((state: RootState) => state.user);
  const state: RootState = useStore().getState();

  /*
   * Used to imperatively scroll to the top when presenting the moment tutorial.
   */
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  /*
   * If scrolling is enabled. Set to false before scrolling up for the tutorial.
   */
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);
  const y = useSharedValue<number>(0);

  /**
   * States
   */
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [profileBodyHeight, setProfileBodyHeight] = useState(0);
  const [socialsBarHeight, setSocialsBarHeight] = useState(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    const refrestState = async () => {
      setRefreshing(true);
      if (!userXId) {
        await userLogin(dispatch, loggedInUser);
      } else {
        await fetchUserX(dispatch, user, screenType);
      }
    };
    refrestState().then(() => {
      setRefreshing(false);
    });
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    setProfileBodyHeight(height);
  };

  const onSocialsBarLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    setSocialsBarHeight(height);
  };

  useEffect(() => {
    const isActuallyBlocked = blockedUsers.some(cur_user => user.username === cur_user.username);
    if (isBlocked !== isActuallyBlocked) {
      setIsBlocked(isActuallyBlocked);
    }
  }, [blockedUsers, user]);

  /**
   * Handles a click on the block / unblock button.
   * loadFriends updates friends list for the logged in user
   * updateUserXFriends updates friends list for the user.
   */
  const handleBlockUnblock = async (callback?: () => void) => {
    dispatch(blockUnblockUser(loggedInUser, getUserAsProfilePreviewType(user, profile), isBlocked));
    dispatch(loadFriendsData(loggedInUser.userId));
    dispatch(updateUserXFriends(user.userId, state));
    if (callback) {
      callback();
    }
  };

  const scrollHandler = useAnimatedScrollHandler(event => {
    y.value = event.contentOffset.y;
  });

  useScrollToTop(scrollViewRef);

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
      onScroll={scrollHandler}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={1}
      // own profile has the moment upload component but other profiles don't
      stickyHeaderIndices={userXId ? [4] : [5]}
      scrollEnabled={scrollEnabled}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {!userXId && <MomentUploadProgressBar />}
      <Cover {...{ userXId, screenType }} />
      <ProfileCutout />
      <ProfileHeader
        {...{
          userXId,
          screenType,
          handleBlockUnblock,
          isBlocked,
        }}
      />
      <ProfileBody
        {...{
          onLayout,
          userXId,
          screenType,
          handleBlockUnblock,
          isBlocked,
        }}
      />
      <TaggsBar {...{ y, profileBodyHeight, userXId, screenType }} onLayout={onSocialsBarLayout} />
      <PublicProfile
        {...{
          y,
          userXId,
          screenType,
          setScrollEnabled,
          profileBodyHeight,
          socialsBarHeight,
          scrollViewRef,
        }}
      />
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default Content;
