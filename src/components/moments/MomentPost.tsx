import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
// @ts-ignore
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Pinchable from 'react-native-pinchable';
import Animated, {
  Easing,
  EasingNode,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';
import Video from 'react-native-video';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { tutorialGIFs } from 'assets/profileTutorialVideos';

import { setUserProfileTemplate } from 'store/reducers';
import {
  AnalyticCategory,
  AnalyticVerb,
  MomentContextType,
  MomentPostType,
  MomentTagType,
  ScreenType,
  UserType,
} from 'types';
import {
  formatCount,
  isIPhoneX,
  isUrlAVideo,
  MediaContentDisplayRatio,
  navigateToProfile,
  normalize,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  track,
} from 'utils';
import { mentionPartTypes, renderTextWithMentions } from 'utils/comments';
import logger from 'utils/logger';

import { icons } from '../../assets/icons';
import { images } from '../../assets/images';
import { headerBarOptions, multilineHeaderTitle } from '../../routes';
import {
  deleteMomentTag,
  getMomentCoin,
  getWidgetStore,
  loadMomentTags,
  updateMomentViewed,
} from '../../services';
import { loadUserMoments } from '../../store/actions';
import { RootState } from '../../store/rootReducer';
import CommentsCount from '../comments/CommentsCount';
import { Avatar, MomentTags, TaggLoadingIndicator } from '../common';
import GradientProgressBar from '../common/GradientProgressBar';
import { MomentMoreInfoDrawer } from '../profile';
import ShareMomentDrawer from './ShareMomentDrawer';
import TaggedUsersDrawer from './TaggedUsersDrawer';

interface MomentPostProps {
  moment: MomentPostType;
  // we support showing this screen before user logs in
  screenType: ScreenType | undefined;
  incrementMomentShareCount: () => void;
  momentContext: React.Context<MomentContextType>;
  individualScroll?: boolean;
  index?: number;
  isRefreshing?: boolean;
  setLongPressed(visible: boolean): void;
  onItemChange: MomentPostProps | any;
  userXId?: string | undefined;
  needToOpenCommentDrawer: boolean;
}

const MomentPost: React.FC<MomentPostProps> = ({
  moment,
  screenType,
  incrementMomentShareCount,
  momentContext,
  individualScroll,
  index,
  isRefreshing,
  setLongPressed,
  onItemChange,
  userXId,
  needToOpenCommentDrawer,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { userId: loggedInUserId, username: loggedInUsername } = useSelector(
    (state: RootState) => state.user.user,
  );
  const state = useStore().getState();
  const isOwnProfile = moment.user.username === loggedInUsername;

  const screenIsFocused = useIsFocused();
  const [showLottie, setShowLottie] = React.useState(false);
  const [dontDisplayLottieAnymore, setDontShowDisplayLottieAnymore] = React.useState(false);

  const [tags, setTags] = useState<MomentTagType[]>([]);
  const [tagsVisible, setTagsVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [taggedUsersVisible, setTaggedUsersVisible] = useState(false);

  const [fadeValue, setFadeValue] = useState<Animated.Value<number>>(new Animated.Value(0));
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [momentTagId, setMomentTagId] = useState<string>('');

  const imageRef = useRef(null);
  const videoRef = useRef<Video>(null);
  const { currentVisibleMomentId, isDiscoverMoment } = useContext(momentContext);
  const isVideo = isUrlAVideo(moment.moment_url);
  const mediaHeight = SCREEN_WIDTH / aspectRatio;
  const [isVideoPaused, setIsVideoPaused] = useState<boolean>(false);
  const videoProgress = useSharedValue(0);
  const [shareMoment, setShareMoment] = useState<boolean>(false);
  const [timer, setTimer] = useState<number | undefined>();
  const [timesWatched, setTimesWatched] = useState<number>(0);
  const [userEngagement, setUserEngagement] = useState({
    clicked_on_profile: false,
    clicked_on_comments: false,
    clicked_on_share: false,
  });
  const [momentCoin, setMomentCoin] = useState<number>(0);

  // update play/pause icon based on video pause state
  useEffect(() => {
    setFadeValue(new Animated.Value(isVideoPaused ? 1 : 0));
  }, [isVideoPaused]);

  /*
   * Load tags on initial render to pass tags data to moment header and content
   */
  useEffect(() => {
    loadMomentTags(moment.moment_id).then(response => {
      setTags(response ? response : []);
    });
  }, [moment]);

  /*
   * Check if loggedInUser has been tagged in the picture and set the id
   */
  useEffect(() => {
    const getMomentTagId = () => {
      const ownTag: MomentTagType[] = tags.filter(tag => tag.user.id === loggedInUserId);
      if (ownTag?.length > 0) {
        setMomentTagId(ownTag[0].id);
      } else {
        setMomentTagId('');
      }
    };
    getMomentTagId();
  }, [tags]);

  useEffect(() => {
    if (typeof setLongPressed !== 'undefined') {
      setLongPressed(drawerVisible);
    }
  }, [drawerVisible]);

  /*
   * Remove tag and update the current tags
   */
  const removeTag = async () => {
    const success = await deleteMomentTag(momentTagId);
    if (success) {
      const filteredTags = tags.filter(tag => tag.user.id !== loggedInUserId);
      setTags(filteredTags);
    }
  };

  useEffect(() => {
    if (!individualScroll) {
      if (moment.moment_category.length > 20) {
        navigation.setOptions({
          ...headerBarOptions('white', ''),
          ...multilineHeaderTitle(moment.moment_category),
        });
      } else {
        navigation.setOptions({
          ...multilineHeaderTitle(moment.moment_category),
        });
      }
    }
  }, [moment.moment_id]);

  /*
   *  Determines if an image is 9:16 to set aspect ratio of current image and
   * determine if image must be displayed in full screen or not
   */
  useEffect(() => {
    if (!isVideo) {
      Image.getSize(
        moment.moment_url,
        (w, h) => {
          setAspectRatio(w / h);
        },
        err => logger.log(err),
      );
    }
  }, []);

  /*
   * To animate tags display
   */
  useEffect(() => {
    const fade = async () => {
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 250,
        easing: EasingNode.linear,
      }).start();
    };
    fade();
  }, [fadeValue]);

  useEffect(() => {
    setShowLottie(false);
    setShowLottie(true);

    if (moment.moment_id !== currentVisibleMomentId) {
      videoRef.current?.seek(0);
    }

    if (isOwnProfile) {
      setShowLottie(false);
    }

    if (userXId) {
      setShowLottie(false);
    }
  }, [currentVisibleMomentId]);

  useEffect(() => {
    if (moment.moment_id === currentVisibleMomentId && screenIsFocused) {
      setTimer(new Date().getTime());
    } else {
      if (timer !== undefined) {
        const endTime = new Date().getTime();
        const durationViewed = endTime - timer;
        if (loggedInUserId !== moment.user.id) {
          updateMomentViewed({
            moment_id: moment.moment_id,
            viewer_id: loggedInUserId,
            view_duration: Math.ceil(durationViewed / 1000),
            ...userEngagement,
          });
        }

        track('Moment', AnalyticVerb.Viewed, AnalyticCategory.Moment, {
          momentId: moment.moment_id,
          duration: durationViewed,
          timesWatched,
          isVideo,
        });
        setTimesWatched(0);
        setTimer(undefined);
      }
    }
  }, [currentVisibleMomentId, screenIsFocused]);
  const getCoins = async () => {
    const res = await getMomentCoin(moment.moment_id);
    const coin = res.Moment_coins;
    setMomentCoin(coin);
  };

  useEffect(() => {
    getCoins();
  }, [currentVisibleMomentId, screenIsFocused]);

  const momentPosterPreview = useMemo(
    () => (
      <View style={styles.momentPosterContainer}>
        <TouchableOpacity
          onPress={() => {
            setShowLottie(false);
            setDontShowDisplayLottieAnymore(true);
            setUserEngagement({
              ...userEngagement,
              clicked_on_profile: true,
            });
            track('ViewProfile', AnalyticVerb.Pressed, AnalyticCategory.Moment, {
              momentId: moment.moment_id,
              userProfile: moment.user.id,
            });
            if (screenType) {
              navigateToProfile(state, dispatch, navigation, screenType, {
                userId: moment.user.id,
                username: moment.user.username,
              });
            }
          }}
          disabled={!screenType}
          style={styles.header}>
          <View style={styles.avatarContainer}>
            {showLottie && (
              <View style={styles.lottieContainer}>
                <LottieView source={tutorialGIFs.pulsatingLong} autoPlay loop />
              </View>
            )}
            <Avatar style={styles.avatar} uri={moment.user.thumbnail_url} userIcon={true} />
          </View>
          <View style={styles.profilePreviewContainer}>
            <Text style={styles.headerText}>{moment.user.username}</Text>
            <Text style={styles.viewCount}>{`${formatCount(moment.view_count)} Views`}</Text>
          </View>
        </TouchableOpacity>
      </View>
    ),
    [moment.user, moment.view_count, showLottie],
  );

  const progress = useDerivedValue(
    () => (isRefreshing ? withTiming(1, { duration: 1000 }) : withTiming(0)),
    [isRefreshing],
  );
  const fadeRefreshing = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0, 1]);
    return { opacity };
  });
  const titleFade = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [1, 0]);
    return { opacity };
  });

  const pauseMoment = () =>
    moment.moment_id !== currentVisibleMomentId || isVideoPaused || !screenIsFocused;
  useEffect(() => {
    // if (!isVideo && !isOwnProfile && !userXId) {
    //   setShowLottie(true);
    // setTimeout(() => {
    //   setShowLottie(false);
    // }, 4500);
    // }
  }, [onItemChange]);

  const momentMedia = isVideo ? (
    <View ref={imageRef}>
      <Video
        ref={videoRef}
        source={{
          uri: moment.moment_url,
        }}
        ignoreSilentSwitch={'ignore'}
        volume={1}
        style={[styles.video, { height: mediaHeight }]}
        resizeMode="cover"
        repeat={true}
        minLoadRetryCount={5}
        onError={response => {
          console.log('video load error');
          console.log(moment.moment_url);
          console.log(response.error);
        }}
        onLoad={response => {
          const { width, height } = response.naturalSize;
          setAspectRatio(width / height);
        }}
        paused={pauseMoment()}
        onProgress={({ currentTime, seekableDuration }) => {
          const localProgress = currentTime / seekableDuration;
          if (!isNaN(localProgress)) {
            videoProgress.value = withTiming(localProgress, {
              duration: 250,
              easing: Easing.linear,
            });
          }
          if (dontDisplayLottieAnymore !== true) {
            if (currentTime >= 4 && showLottie) {
              setShowLottie(true);
            } else if (isOwnProfile) {
              setShowLottie(false);
            } else if (userXId) {
              setShowLottie(false);
            }
          }
        }}
        onEnd={() => {
          setTimesWatched(timesWatched + 1);
          videoProgress.value = 0;
        }}
      />
      {isVideoPaused && (
        <Animated.View
          style={[
            styles.pauseContainer,
            {
              opacity: fadeValue,
            },
          ]}>
          <SvgXml xml={icons.PauseIcon} width={100} height={100} />
        </Animated.View>
      )}
    </View>
  ) : (
    <Image
      source={{ uri: moment.moment_url }}
      style={{
        height: mediaHeight,
      }}
      ref={imageRef}
    />
  );

  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <TaggedUsersDrawer
        users={tags.map(tag => tag.user)}
        isOpen={taggedUsersVisible}
        setIsOpen={setTaggedUsersVisible}
      />
      {individualScroll && index !== undefined && index === 0 && (
        <View style={[styles.titleContainer, titleFade]}>
          <Text
            numberOfLines={3}
            style={[
              styles.multilineHeaderTitle,
              {
                fontSize: moment.moment_category.length > 18 ? normalize(14) : normalize(16),
              },
            ]}>
            {!isRefreshing ? (isDiscoverMoment ? 'Discover Moments' : moment.moment_category) : ''}
          </Text>
        </View>
      )}
      {screenType && (
        <MomentMoreInfoDrawer
          isDiscoverMomentPost={isDiscoverMoment}
          isOpen={drawerVisible}
          setIsOpen={setDrawerVisible}
          isOwnProfile={isOwnProfile}
          momentTagId={momentTagId}
          removeTag={removeTag}
          dismissScreenAndUpdate={() => {
            dispatch(loadUserMoments(loggedInUserId));
            getWidgetStore(loggedInUserId).then(widgetStore =>
              dispatch({
                type: setUserProfileTemplate.type,
                payload: {
                  widgetStore,
                },
              }),
            );
            navigation.goBack();
          }}
          screenType={screenType}
          moment={moment}
          tags={tags}
        />
      )}
      <View style={styles.background}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (isVideo) {
              setIsVideoPaused(!isVideoPaused);
            } else {
              setTagsVisible(!tagsVisible);
              setFadeValue(new Animated.Value(0));
            }
          }}
          onLongPress={() => {
            const options = {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            };
            ReactNativeHapticFeedback.trigger('impactLight', options);
            setDrawerVisible(true);
          }}>
          {isVideo ? (
            <View style={styles.mediaContainer}>{momentMedia}</View>
          ) : (
            <Pinchable>
              <View style={styles.mediaContainer}>{momentMedia}</View>
              {tagsVisible && !isVideo && (
                <Animated.View style={[styles.tagsContainer, { opacity: fadeValue }]}>
                  <MomentTags
                    editing={false}
                    tags={tags}
                    setTags={() => null}
                    imageRef={imageRef}
                  />
                </Animated.View>
              )}
            </Pinchable>
          )}
        </TouchableWithoutFeedback>
        <View style={styles.bottomContainer} pointerEvents={'box-none'}>
          {tags.length > 0 && (
            <TouchableOpacity
              style={styles.tagIconContainer}
              disabled={!isVideo}
              onPress={() => {
                track('ViewTags', AnalyticVerb.Pressed, AnalyticCategory.Moment, {
                  momentId: moment.moment_id,
                });
                setTaggedUsersVisible(prevState => !prevState);
              }}>
              <Image source={images.main.tag_indicate} style={styles.tagIcon} />
            </TouchableOpacity>
          )}
          {screenType && (
            <ShareMomentDrawer
              screenType={screenType}
              isOpen={shareMoment}
              setIsOpen={setShareMoment}
              moment={moment}
              isVideo={isVideo}
              incrementMomentShareCount={incrementMomentShareCount}
              momentContext={momentContext}
            />
          )}
          <View style={styles.buttonsVerticalContainer}>
            <TouchableOpacity
              style={styles.countContainer}
              disabled={!screenType}
              onPress={() => {}}>
              <Image source={icons.MomentCoin} style={styles.momentCoin} />
              <Text style={styles.count}>{momentCoin !== 0 ? momentCoin : 'Coins'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.countContainer}
              disabled={!screenType}
              onPress={() => {
                track('ShareButton', AnalyticVerb.Pressed, AnalyticCategory.Moment, {
                  momentId: moment.moment_id,
                });
                setShareMoment(true);
                setUserEngagement({
                  ...userEngagement,
                  clicked_on_share: true,
                });
              }}>
              <Image source={icons.MomentShare} style={styles.momentShare} />
              <Text style={styles.count}>
                {moment && moment.share_count !== 0 ? moment.share_count : 'Share'}
              </Text>
            </TouchableOpacity>
            <CommentsCount
              momentId={moment.moment_id}
              count={moment.comments_count ?? 0}
              screenType={screenType}
              momentuserid={moment.user.id}
              isOwnProfile={isOwnProfile}
              moment={moment}
              onPressCallback={() => {
                setUserEngagement({
                  ...userEngagement,
                  clicked_on_comments: true,
                });
              }}
              isOpenDrawer={needToOpenCommentDrawer}
            />
          </View>
          {momentPosterPreview}
          {moment.caption !== '' &&
            renderTextWithMentions({
              value: moment.caption,
              styles: styles.captionText,
              partTypes: mentionPartTypes('white', 'caption'),
              onPress: (userLocal: UserType) => {
                if (screenType) {
                  track('AMentionInCaption', AnalyticVerb.Pressed, AnalyticCategory.Moment, {
                    momentId: moment.moment_id,
                    captionOwner: moment.user.id,
                    mentionedUser: userLocal.userId,
                  });
                  navigateToProfile(state, dispatch, navigation, screenType, userLocal);
                }
              },
            })}
          <View>
            {isVideo && (
              <GradientProgressBar
                style={styles.progressBar}
                progress={videoProgress}
                toColor={'#fff'}
                fromColor={'#fff'}
                unfilledColor={'#808080'}
              />
            )}
          </View>
        </View>
      </View>
      {isRefreshing && (
        <Animated.View style={[styles.loadingImg, fadeRefreshing]}>
          <TaggLoadingIndicator viewStyle={styles.loaderViewStyle} iconStyle={styles.image} />
          <Text style={styles.loadingTextStyle}>Refreshing Page</Text>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    height: SCREEN_WIDTH / MediaContentDisplayRatio,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarContainer: {
    width: 78,
    marginLeft: '3%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieContainer: { zIndex: -1, position: 'absolute', right: -5, left: -5, top: -5, bottom: -5 },
  text: {
    marginHorizontal: '5%',
    color: 'white',
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 10,
  },
  captionText: {
    position: 'relative',
    marginHorizontal: '5%',
    color: '#ffffff',
    fontWeight: '500',
    fontSize: normalize(13),
    lineHeight: normalize(15.51),
    letterSpacing: normalize(0.6),
    marginBottom: normalize(5),
    width: SCREEN_WIDTH * 0.79,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: normalize(5),
  },
  tagIconContainer: {
    width: normalize(30),
    height: normalize(30),
    bottom: normalize(20),
    left: '5%',
  },
  tagIcon: {
    width: '100%',
    height: '100%',
  },
  avatar: {
    width: 49,
    aspectRatio: 1,
    borderRadius: 100,
    margin: 10,
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  viewCount: {
    height: normalize(12),
    left: 0,
    top: '8%',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 13,
    letterSpacing: 0.08,
    textAlign: 'left',
    color: '#fff',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: normalize(15),
    alignSelf: 'flex-start',
  },
  momentCoin: {
    width: 39,
    height: 39,
    resizeMode: 'contain',
  },
  momentPosterContainer: {
    width: SCREEN_WIDTH * 0.9,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  momentShare: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  bottomContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: isIPhoneX() ? SCREEN_HEIGHT - SCREEN_WIDTH / MediaContentDisplayRatio : '16%',
  },
  tagsContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  background: {
    backgroundColor: 'black',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  pauseContainer: {
    position: 'absolute',
    left: '40%',
    top: '40%',
  },
  progressBar: {
    width: SCREEN_WIDTH * 0.99,
    height: 3,
    marginHorizontal: 2,
  },
  profilePreviewContainer: {
    paddingHorizontal: '3%',
  },
  buttonsVerticalContainer: {
    position: 'absolute',
    right: '2%',
    minWidth: 25,
    bottom: SCREEN_HEIGHT * 0.25,
    width: 50,
    height: isIPhoneX() ? 120 : 115,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: {
    fontWeight: '600',
    fontSize: normalize(12),
    lineHeight: normalize(16),
    letterSpacing: normalize(0.05),
    textAlign: 'center',
    color: 'white',
    marginTop: normalize(4),
  },
  countContainer: {
    minWidth: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(24),
  },
  multilineHeaderTitle: {
    width: SCREEN_WIDTH * 0.7,
    textAlign: 'center',
    lineHeight: normalize(21.48),
    letterSpacing: normalize(1.3),
    fontWeight: '700',
    color: 'white',
  },
  titleContainer: {
    position: 'absolute',
    alignSelf: 'flex-start',
    width: SCREEN_WIDTH * 0.84,
    left: SCREEN_WIDTH * 0.1,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    top: isIPhoneX() ? 56 : 30,
  },
  video: {
    // scale up (zoom in) a 9:16 video to fill a 9:17.5 screen
    width: isIPhoneX() ? SCREEN_WIDTH * (17.5 / 16) : SCREEN_WIDTH,
    alignSelf: 'center',
  },

  image: { width: 80, top: 28 },
  loadingImg: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 24,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  loadingTextStyle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  loaderViewStyle: {
    backgroundColor: 'transparent',
  },
  notification: {},
});

export default MomentPost;
