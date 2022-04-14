import { TAGG_LIGHT_BLUE_2, TAGG_PURPLE, TAGG_LIGHT_BLUE_3 } from 'constants';

import React, { useContext, useEffect, useMemo } from 'react';

import { useNavigation } from '@react-navigation/core';

import { View, StyleSheet, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { human, systemWeights } from 'react-native-typography';
import { useDispatch, useSelector } from 'react-redux';

import { images } from 'assets/images';

import { GradientProgressBar } from 'components';
import GradientText from 'components/GradientText';
import { ProfileContext } from 'screens/profile/ProfileScreen';
import { checkMomentDoneProcessing } from 'services';
import { handleImageMomentUpload, handleVideoMomentUpload, loadUserMoments } from 'store/actions';
import { setMomentUploadProgressBar } from 'store/reducers';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, MomentUploadStatusType, ScreenType } from 'types';
import { gradientColorFormation, normalize, SCREEN_WIDTH, track } from 'utils';
import logger from 'utils/logger';

import MomentTile from '../moments/MomentTile';

interface MomentGridProps {
  category: string;
}

const MomentGrid: React.FC<MomentGridProps> = ({ category }) => {
  const { moments, screenType, userXId, secondaryColor, ownProfile } = useContext(ProfileContext);
  const { momentUploadProgressBar } = useSelector((state: RootState) => state.user);
  const { userId: loggedInUserId } = useSelector((state: RootState) => state.user.user);
  const progress = useSharedValue(0);
  let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
  const showLoading =
    momentUploadProgressBar?.status === MomentUploadStatusType.UploadingToS3 ||
    momentUploadProgressBar?.status === MomentUploadStatusType.WaitingForDoneProcessing;
  const localMoments = useMemo(
    () => moments.filter(item => item.moment_category === category),
    [moments],
  );

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const retryUpload = () => {
    if (!momentUploadProgressBar || !timeoutTimer) {
      return;
    }
    clearTimeout(timeoutTimer);
    const { type, uri, caption, category, tags } = momentUploadProgressBar.momentInfo;
    if (type === 'image') {
      dispatch(handleImageMomentUpload(uri, caption, category, tags));
    } else {
      dispatch(
        handleVideoMomentUpload(
          uri,
          momentUploadProgressBar.originalVideoDuration ?? 30,
          caption,
          category,
          tags,
        ),
      );
    }
  };
  useEffect(() => {
    if (momentUploadProgressBar) {
      track('MomentUploadProgressBar', AnalyticVerb.Updated, AnalyticCategory.MomentUpload, {
        status: momentUploadProgressBar.status,
      });
      if (momentUploadProgressBar.status === MomentUploadStatusType.Done) {
        track('UploadMoment', AnalyticVerb.Finished, AnalyticCategory.MomentUpload);
      }
    }
  }, [momentUploadProgressBar?.status]);
  useEffect(() => {
    let doneProcessing = false;
    const checkDone = async () => {
      if (
        momentUploadProgressBar &&
        (await checkMomentDoneProcessing(momentUploadProgressBar!.momentId))
      ) {
        doneProcessing = true;
        cancelAnimation(progress);
        // upload is done, but let's finish the progress bar animation in a velocity of 10%/s
        const finishProgressBarDuration = (1 - progress.value) * 10 * 1000;
        progress.value = withTiming(1, {
          duration: finishProgressBarDuration,
          easing: Easing.linear,
        });
        // change status to Done 1s after the progress bar animation is done
        setTimeout(() => {
          dispatch({
            type: setMomentUploadProgressBar.type,
            payload: {
              momentUploadProgressBar: {
                ...momentUploadProgressBar,
                status: MomentUploadStatusType.Done,
              },
            },
          });
        }, finishProgressBarDuration);
      }
    };
    if (momentUploadProgressBar?.status === MomentUploadStatusType.WaitingForDoneProcessing) {
      checkDone();
      const timer = setInterval(async () => {
        if (!doneProcessing) {
          checkDone();
        }
      }, 5 * 1000);
      // timeout if takes longer than 1 minute to process
      setTimeout(() => {
        clearInterval(timer);
        if (!doneProcessing) {
          logger.error('Check for done processing timed out');
          dispatch({
            type: setMomentUploadProgressBar.type,
            payload: {
              momentUploadProgressBar: {
                ...momentUploadProgressBar,
                status: MomentUploadStatusType.Error,
              },
            },
          });
        }
      }, 60 * 1000);
      return () => clearInterval(timer);
    }
  }, [momentUploadProgressBar?.status]);

  // UPLOADING_TO_S3, begin progress bar animation
  useEffect(() => {
    if (momentUploadProgressBar?.status === MomentUploadStatusType.UploadingToS3) {
      // e.g. 30s video => 30 * 3 = 60s
      const videoDuration = momentUploadProgressBar.originalVideoDuration ?? 30;
      const durationInSeconds = videoDuration * 3;
      progress.value = withTiming(1, {
        duration: durationInSeconds * 1000,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [momentUploadProgressBar?.status]);

  // ERROR, dismiss progress bar after some time, but allow retry
  useEffect(() => {
    if (momentUploadProgressBar?.status === MomentUploadStatusType.Error) {
      progress.value = 0;
      timeoutTimer = setTimeout(() => {
        dispatch({
          type: setMomentUploadProgressBar.type,
          payload: {
            momentUploadProgressBar: undefined,
          },
        });
      }, 5000);
    }
  }, [momentUploadProgressBar?.status]);

  // DONE, reload user moments
  useEffect(() => {
    if (momentUploadProgressBar?.status === MomentUploadStatusType.Done) {
      dispatch(loadUserMoments(loggedInUserId));
    }
  }, [momentUploadProgressBar?.status]);

  // DONE, clear and dismiss progress bar after some time
  useEffect(() => {
    if (momentUploadProgressBar?.status === MomentUploadStatusType.Done) {
      progress.value = 0;
      // clear this component after a duration
      setTimeout(() => {
        dispatch({
          type: setMomentUploadProgressBar.type,
          payload: {
            momentUploadProgressBar: undefined,
          },
        });
      }, 5000);
    }
  }, [momentUploadProgressBar?.status]);

  return (
    <>
      <GradientText colors={gradientColorFormation(secondaryColor)} style={[styles.title]}>
        Moments
      </GradientText>
      {ownProfile &&
        momentUploadProgressBar &&
        momentUploadProgressBar.status === MomentUploadStatusType.Done && (
          <View style={styles.row}>
            <Image source={images.main.green_check} style={styles.x} />
            <Text style={styles.text}>Beautiful, the Moment was uploaded successfully!</Text>
          </View>
        )}
      {ownProfile &&
        momentUploadProgressBar &&
        momentUploadProgressBar.status === MomentUploadStatusType.Error && (
          <View style={styles.column}>
            <View style={styles.rowInCol}>
              <Image source={images.main.white_x} style={styles.x} />
              <Text style={styles.whiteText}>Unable to upload Moment. Please retry</Text>
            </View>
            <TouchableOpacity onPress={retryUpload} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      <View style={styles.container}>
        {localMoments.length === 0 && ownProfile && !showLoading && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('CameraScreen', {
                screenType: ScreenType.Profile,
                selectedCategory: category,
              })
            }
            style={styles.emptyMomentPlaceholderContainer}>
            <Text style={styles.blankText}>Create your first moment!</Text>
          </TouchableOpacity>
        )}
        {ownProfile &&
          showLoading &&
          momentUploadProgressBar &&
          momentUploadProgressBar.momentInfo.category === category && (
            <ImageBackground
              source={{ uri: momentUploadProgressBar.momentInfo.uri }}
              style={styles.uploadImageBackground}>
              <View style={styles.uploadMomentStyle}>
                <Text style={styles.loadingText}>Posting</Text>
                <GradientProgressBar
                  style={styles.bar}
                  progress={progress}
                  toColor={TAGG_LIGHT_BLUE_2}
                  fromColor={TAGG_PURPLE}
                  unfilledColor={TAGG_LIGHT_BLUE_3}
                />
              </View>
            </ImageBackground>
          )}
        {localMoments.map((item, index) => (
          <MomentTile
            style={styles.tile}
            moment={item}
            userXId={userXId}
            screenType={screenType}
            key={index}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    width: SCREEN_WIDTH - 8 * 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bar: {
    width: '80%',
  },
  column: {
    position: 'absolute',
    top: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
    backgroundColor: '#EA574C',
    width: '100%',
    paddingVertical: 10,
    paddingTop: 50,
  },
  title: {
    ...human.title3Object,
    ...systemWeights.bold,
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 5,
  },
  row: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingTop: 50,
  },
  uploadImageBackground: {
    resizeMode: 'cover',
    margin: 2,
  },
  rowInCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  x: {
    width: normalize(26),
    height: normalize(26),
    marginRight: 10,
  },
  whiteText: {
    color: 'white',
    fontSize: normalize(14),
    fontWeight: 'bold',
    lineHeight: 17,
    marginVertical: 12,
  },
  retryButton: {
    backgroundColor: '#A2352C',
    borderRadius: 6,
    height: normalize(37),
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: normalize(15),
  },
  tile: {
    aspectRatio: 1,
    height: (SCREEN_WIDTH - 8 * 4) / 3,
    margin: 2,
  },
  emptyMomentPlaceholderContainer: {
    aspectRatio: 1,
    height: (SCREEN_WIDTH - 8 * 4) / 3,
    margin: 2,
    // marginHorizontal: 15,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  uploadMomentStyle: {
    aspectRatio: 1,
    height: (SCREEN_WIDTH - 8 * 4) / 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1,1,1,0.7)',
  },
  blankText: {
    textAlign: 'center',
    color: 'grey',
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    lineHeight: 17,
    marginVertical: 12,
    width: '80%',
  },
});

export default MomentGrid;
