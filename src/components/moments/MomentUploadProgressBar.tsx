import React, { useEffect } from 'react';

import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native-animatable';
import { cancelAnimation, Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';

import { images } from 'assets/images';
import { checkMomentDoneProcessing } from 'services';
import {
  handleImageMomentUpload,
  handleVideoMomentUpload,
  loadUserMoments,
  updateProfileTutorialStage,
  updateRewardsStore,
} from 'store/actions';
import { setMomentUploadProgressBar } from 'store/reducers';
import { RootState } from 'store/rootReducer';
import {
  AnalyticCategory,
  AnalyticVerb,
  MomentUploadStatusType,
  ProfileTutorialStage,
} from 'types';
import { normalize, SCREEN_WIDTH, StatusBarHeight } from 'utils';
import { track } from 'utils/analytics';

import logger from 'utils/logger';

import { TAGG_LIGHT_BLUE_2, TAGG_LIGHT_BLUE_3, TAGG_PURPLE } from '../../constants';

import { GradientProgressBar } from '../common';

interface MomentUploadProgressBarProps {}

const MomentUploadProgressBar: React.FC<MomentUploadProgressBarProps> = ({}) => {
  const dispatch = useDispatch();
  const { profile_tutorial_stage } = useSelector((state: RootState) => state.user.profile);
  const { userId: loggedInUserId } = useSelector((state: RootState) => state.user.user);
  const { momentUploadProgressBar } = useSelector((state: RootState) => state.user);
  const progress = useSharedValue(0);
  const showLoading =
    momentUploadProgressBar?.status === MomentUploadStatusType.UploadingToS3 ||
    momentUploadProgressBar?.status === MomentUploadStatusType.WaitingForDoneProcessing;
  let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
  const cantainerHeight =
    momentUploadProgressBar?.status === MomentUploadStatusType.Error
      ? normalize(121)
      : normalize(84);

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

  // WAITING_FOR_PROCESSING, check if done processing in a loop with a delay
  useEffect(() => {
    let doneProcessing = false;
    const checkDone = async () => {
      if (
        !!momentUploadProgressBar &&
        (await checkMomentDoneProcessing(momentUploadProgressBar!.momentId))
      ) {
        doneProcessing = true;
        cancelAnimation(progress);
        // upload is done, but let's finish the progress bar animation in a velocity of 500ms
        const finishProgressBarDuration = 500;
        progress.value = withTiming(1, {
          duration: finishProgressBarDuration,
          easing: Easing.linear,
        });
        // change status to Done 500ms after the progress bar animation is done
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
      }, 2 * 1000);
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

      Promise.resolve(dispatch(updateRewardsStore(loggedInUserId)));

      // clear this component after a duration
      setTimeout(() => {
        dispatch({
          type: setMomentUploadProgressBar.type,
          payload: {
            momentUploadProgressBar: undefined,
          },
        });

        /** Update tutrial stage to completed to stop the post moment
         * popup from getting displayed the second time, since the user
         * has already seen and uploaded a moment via the popup
         */
        if (profile_tutorial_stage === ProfileTutorialStage.TRACK_LOGIN_AFTER_POST_MOMENT_1) {
          dispatch(updateProfileTutorialStage(ProfileTutorialStage.COMPLETE));
        }
      }, 2000);
    }
  }, [momentUploadProgressBar?.status]);

  if (!momentUploadProgressBar) {
    return null;
  }

  return (
    <View
      style={[
        styles.background,
        { height: StatusBarHeight + cantainerHeight },
        momentUploadProgressBar?.status === MomentUploadStatusType.Error
          ? styles.redBackground
          : {},
      ]}>
      <View style={[styles.container, { height: cantainerHeight }]}>
        {showLoading && (
          <>
            <Text style={styles.text}>Uploading Moment...</Text>
            <GradientProgressBar
              style={styles.bar}
              progress={progress}
              toColor={TAGG_LIGHT_BLUE_2}
              fromColor={TAGG_PURPLE}
              unfilledColor={TAGG_LIGHT_BLUE_3}
            />
          </>
        )}
        {momentUploadProgressBar.status === MomentUploadStatusType.Done && (
          <View style={styles.row}>
            <Image source={images.main.green_check} style={styles.x} />
            <Text style={styles.text}>Beautiful, the Moment was uploaded successfully!</Text>
          </View>
        )}
        {momentUploadProgressBar.status === MomentUploadStatusType.Error && (
          <View style={styles.column}>
            <View style={styles.row}>
              <Image source={images.main.white_x} style={styles.x} />
              <Text style={styles.whiteText}>Unable to upload Moment. Please retry</Text>
            </View>
            <TouchableOpacity onPress={retryUpload} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    zIndex: 999,
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    marginTop: StatusBarHeight,
  },
  text: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    lineHeight: 17,
    marginVertical: 12,
    width: '80%',
  },
  bar: {
    width: SCREEN_WIDTH * 0.9,
  },
  redBackground: {
    backgroundColor: '#EA574C',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  whiteText: {
    color: 'white',
    fontSize: normalize(14),
    fontWeight: 'bold',
    lineHeight: 17,
    marginVertical: 12,
  },
  x: {
    width: normalize(26),
    height: normalize(26),
    marginRight: 10,
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
});

export default MomentUploadProgressBar;
