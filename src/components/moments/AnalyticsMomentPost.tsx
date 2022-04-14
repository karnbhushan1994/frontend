import React, { useContext, useEffect, useState } from 'react';

import { useIsFocused } from '@react-navigation/native';
import { Image, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
// @ts-ignore
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';
import Video from 'react-native-video';

import { MomentContextType, MomentPostType } from 'types';
import { isIPhoneX, MediaContentDisplayRatio, normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

import { icons } from '../../assets/icons';

interface MomentPostProps {
  moment: MomentPostType;
  // we support showing this screen before user logs in
  momentContext: React.Context<MomentContextType>;
  individualScroll?: boolean;
  index?: number;
  isRefreshing?: boolean;
  videoSource: any;
}

const AnalyticsMomentPost: React.FC<MomentPostProps> = ({
  moment,
  momentContext,
  individualScroll,
  index,
  isRefreshing,
  videoSource,
}) => {
  const screenIsFocused = useIsFocused();

  const [fadeValue, setFadeValue] = useState<Animated.Value<number>>(new Animated.Value(0));
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  const { currentVisibleMomentId, isDiscoverMoment } = useContext(momentContext);
  const mediaHeight = SCREEN_WIDTH / aspectRatio;
  const [isVideoPaused] = useState<boolean>(false);
  const videoProgress = useSharedValue(0);
  const [timesWatched, setTimesWatched] = useState<number>(0);

  // update play/pause icon based on video pause state
  useEffect(() => {
    setFadeValue(new Animated.Value(isVideoPaused ? 1 : 0));
  }, [isVideoPaused]);

  const pauseMoment = () =>
    moment?.moment_id !== currentVisibleMomentId || isVideoPaused || !screenIsFocused;

  const momentMedia = (
    <View>
      <Video
        source={videoSource}
        ignoreSilentSwitch={'ignore'}
        volume={1}
        style={[styles.video, { height: mediaHeight }]}
        resizeMode="contain"
        repeat={true}
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
  );

  return (
    <>
      <StatusBar barStyle={'light-content'} />
      {individualScroll && index !== undefined && index === 0 && (
        <View style={styles.titleContainer}>
          <Text
            numberOfLines={3}
            style={[
              styles.multilineHeaderTitle,
              {
                fontSize: moment?.moment_category.length > 18 ? normalize(14) : normalize(16),
              },
            ]}>
            {!isRefreshing ? (isDiscoverMoment ? 'Discover Moments' : moment?.moment_category) : ''}
          </Text>
        </View>
      )}
      <View style={styles.background}>
        <TouchableWithoutFeedback
          onPress={() => {
            // if (videoSource) {
            //   setIsVideoPaused(!isVideoPaused);
            // }
          }}>
          <View style={styles.mediaContainer}>{momentMedia}</View>
        </TouchableWithoutFeedback>
      </View>
      {isRefreshing && (
        <View style={styles.loadingImg}>
          {/* <TaggLoadingIndicator viewStyle={styles.loaderViewStyle} iconStyle={styles.image} /> */}
          <Image source={require('assets/gifs/loading-animation.gif')} style={styles.image} />
          <Text style={styles.loadingTextStyle}>Refreshing Page</Text>
        </View>
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
    width: 48,
    aspectRatio: 1,
    borderRadius: 100,
    marginLeft: '3%',
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
  momentPosterContainer: {
    width: SCREEN_WIDTH * 0.9,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
    bottom: SCREEN_HEIGHT * 0.16,
    width: 50,
    height: isIPhoneX() ? 120 : 115,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: {
    fontWeight: '500',
    fontSize: normalize(11),
    lineHeight: normalize(13),
    letterSpacing: normalize(0.05),
    textAlign: 'center',
    color: 'white',
    marginTop: normalize(5),
  },
  countContainer: {
    minWidth: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: SCREEN_WIDTH * 0.8,
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

  image: { height: 50, width: 120, justifyContent: 'center' },
  loadingImg: {
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    top: 80,
    alignSelf: 'center',
  },
  loadingTextStyle: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  loaderViewStyle: {
    backgroundColor: 'transparent',
  },
});

export default AnalyticsMomentPost;
