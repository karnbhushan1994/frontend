import { AsyncAnalyticsStatusTextList } from 'constants';

import AsyncStorage from '@react-native-community/async-storage';
import { Action, ThunkAction } from '@reduxjs/toolkit';
import DeviceInfo from 'react-native-device-info';

import {
  ASYNC_STORAGE_KEYS,
  CommentThreadType,
  CreateVideoMomentResponse,
  MomentUploadProgressBarType,
  MomentUploadStatusType,
  ProfileTutorialStage,
  TaggScoreActionsEnum,
  TaggScoreBannerText,
  UserType,
} from 'types';
import { getTokenOrLogout, resetAnalytics, updateUserInfoAnalytics } from 'utils';
import { setEnvironmentAnalytics } from 'utils/analytics';
import logger from 'utils/logger';

import {
  changeAnalyticsStatus_ApiService,
  checkAnalyticsStatus_ApiService,
  fetchSkinPermission,
  getCurrentLiveVersions,
  getGameProfileService,
  getProfilePic,
  getSkin,
  getUserEligiblityForTaggBG,
  getWidgetStore,
  handleCreateVideoMoment,
  handlePresignedURL,
  loadProfileInfo,
  postMomentTags,
  setBgTabGradientPermission,
  unlockBackgroundTaggService,
  updateProfileTutorialStageService,
  updateTaggScoreService,
} from '../../services';
import { uploadImgContent, uploadVideoContent } from '../../services/contentUpload';
import {
  clearHeaderAndProfileImages,
  profileTutorialStageUpdated,
  resetBlockedList,
  resetMomentCategories,
  resetNotifications,
  resetSocialData,
  resetTaggUsers,
  resetUserData,
  resetUserFriends,
  resetUserMoments,
  setEnvironment,
  setMomentUploadProgressBar,
  setNewNotificationReceived,
  setNewVersionAvailable,
  setReplyPosted,
  setSkinPermission,
  setSuggestedPeopleImage,
  setTaggScore,
  setUpdateAnalyticStatus,
  setUserEligiblityForBGTagg,
  setUserProfileTemplate,
  socialEdited,
  updateNewRewardsReceived,
  updateRewards,
  userDetailsFetched,
  userLoggedIn,
  userProfileFetched,
} from '../reducers';
import { RootState } from '../rootReducer';

/**
 * Entry point to our store.
 * Thunk allows us to make async API calls and hence is responsible to fetch data from server.
 */

/**
 * Lets understand Thunk.
 * https://bloggie.io/@_ChristineOo/understanding-typings-of-redux-thunk-action
 * https://github.com/reduxjs/redux-thunk
 */

export const loadUserData =
  (user: UserType): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      await dispatch({ type: userLoggedIn.type, payload: user });
      const token = await getTokenOrLogout(dispatch);
      getSkin(user.userId).then(skin =>
        dispatch({
          type: setUserProfileTemplate.type,
          payload: { skin },
        }),
      );
      Promise.all([
        loadProfileInfo(token, user.userId),
        getProfilePic(token, user.userId, 'profile'),
        getProfilePic(token, user.userId, 'header'),
      ]).then(([profile, avatar, cover]) => {
        if (profile) {
          updateUserInfoAnalytics({
            ...user,
            ...profile,
          });
        }
        dispatch({
          type: userDetailsFetched.type,
          payload: { profile, cover, avatar },
        });
      });
      getWidgetStore(user.userId).then(widgetStore => {
        dispatch({
          type: setUserProfileTemplate.type,
          payload: {
            widgetStore,
          },
        });
      });
      getUserEligiblityForTaggBG(user.userId).then(res => {
        const checkBGFeature = Object?.keys(res as any)[0] === 'unlock_background';
        dispatch({
          type: setUserEligiblityForBGTagg.type,
          payload: {
            userBGTaggEligiblity: {
              unLockBG: !checkBGFeature,
              taggEligiblity: Object?.values(res as any)[0],
            },
          },
        });
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const resetHeaderAndProfileImage =
  (): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => async dispatch => {
    await dispatch({
      type: clearHeaderAndProfileImages.type,
      payload: {},
    });
  };

/**
 * To update editable socials
 * @param social social to be updated
 * @param value username of social to be updated
 */
export const updateSocial =
  (social: string, value: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      dispatch({
        type: socialEdited.type,
        payload: { social, value },
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const updateProfileTutorialStage =
  (stage: ProfileTutorialStage): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    const token = await getTokenOrLogout(dispatch);
    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.PROFILE_TUTORIAL_STAGE, `${stage}`);
    const success = await updateProfileTutorialStageService(stage, token);
    if (success) {
      try {
        dispatch({
          type: profileTutorialStageUpdated.type,
          payload: { stage },
        });
      } catch (error) {
        logger.log(error);
      }
    }
  };

export const updateNewVersionAvailable =
  (): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => async dispatch => {
    try {
      const response = await getCurrentLiveVersions();
      if (response) {
        setEnvironmentAnalytics(response.env);
        dispatch({
          type: setEnvironment.type,
          payload: { environment: response.env },
        });
        if (!response.live_versions.includes(DeviceInfo.getVersion())) {
          dispatch({
            type: setNewVersionAvailable.type,
            payload: { newVersionAvailable: true },
          });
        }
      }
    } catch (error) {
      logger.log(error);
    }
  };

export const updateNewNotificationReceived =
  (
    newNotificationReceived: boolean,
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      dispatch({
        type: setNewNotificationReceived.type,
        payload: { newNotificationReceived },
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const updateReplyPosted =
  (
    replyPosted: CommentThreadType | undefined,
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      dispatch({
        type: setReplyPosted.type,
        payload: { replyPosted },
      });
    } catch (error) {
      logger.log(error);
    }
  };

// clean AsyncStorage except specified
export const cleanAsyncStorage = (except: ASYNC_STORAGE_KEYS[]) => {
  for (const [, value] of Object.entries(ASYNC_STORAGE_KEYS)) {
    if (except.find(key => key !== value)) {
      AsyncStorage.removeItem(value);
    }
  }
};

export const logout =
  (): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => async dispatch => {
    try {
      // cleanAsyncStorage except watchedIntroVideo so user does not have to watch the into video again
      cleanAsyncStorage([ASYNC_STORAGE_KEYS.WATCHED_INTRO_VIDEO]);
      resetAnalytics();
      dispatch(updateAnalyticStatus(''));
      dispatch({ type: userLoggedIn.type, payload: { userId: '', username: '' } });
      //TODO clear user store
      dispatch(resetUserData());
      dispatch(resetNotifications());
      dispatch(resetMomentCategories());
      dispatch(resetBlockedList());
      dispatch(resetUserMoments());
      dispatch(resetTaggUsers());
      dispatch(resetUserFriends());
      dispatch(resetSocialData());
    } catch (error) {
      logger.log(error);
    }
  };

export const uploadedSuggestedPeoplePhoto =
  (imageUri: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      await dispatch({
        type: setSuggestedPeopleImage.type,
        payload: { suggestedPeopleImage: imageUri },
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const handleImageMomentUpload =
  (
    imageUri: string,
    caption: string,
    momentCategory: string,
    formattedTags: {
      x: number;
      y: number;
      z: number;
      user_id: string;
    }[],
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const handleError = (reason: string) => {
        logger.error('Moment image upload failed,', reason);
        dispatch({
          type: setMomentUploadProgressBar.type,
          payload: {
            momentUploadProgressBar: {
              ...momentUploadProgressBar,
              status: MomentUploadStatusType.Error,
            },
          },
        });
      };
      let momentUploadProgressBar: MomentUploadProgressBarType = {
        status: MomentUploadStatusType.UploadingToS3,
        momentId: '',
        originalVideoDuration: 1, // assume upload time for an image is same as a 1s video
        momentInfo: {
          type: 'image',
          uri: imageUri,
          caption,
          category: momentCategory,
          tags: formattedTags,
        },
      };
      // set progress bar as loading
      dispatch({
        type: setMomentUploadProgressBar.type,
        payload: { momentUploadProgressBar },
      });
      // upload image moment
      let momentPostResponse = await uploadImgContent(imageUri, caption, momentCategory);
      if (!momentPostResponse) {
        handleError('Moment post failed');
        return;
      }
      momentPostResponse = JSON.parse(momentPostResponse);

      const momentId = momentPostResponse?.moment_id ? momentPostResponse.moment_id : undefined;

      if (!momentId) {
        handleError('Unable to parse moment id from moment post response');
        return;
      }
      // upload moment tags
      const momentTagResponse = await postMomentTags(momentId, formattedTags);
      if (!momentTagResponse) {
        handleError('Moment tag post failed');
        return;
      }
      // mark progress bar state as done
      dispatch({
        type: setMomentUploadProgressBar.type,
        payload: {
          momentUploadProgressBar: {
            ...momentUploadProgressBar,
            status: MomentUploadStatusType.Done,
          },
        },
      });
    } catch (error) {
      logger.log(error);
    }
  };

/**
 *  state is now UploadingToS3:
 *    - get presigned url (backend creates the moment object)
 *    - upload moment tags
 *    - upload video to s3
 *  state is now WaitingForDoneProcessing
 */
export const handleVideoMomentUpload =
  (
    videoUri: string,
    videoLength: number,
    caption: string,
    momentCategory: string,
    formattedTags: {
      x: number;
      y: number;
      z: number;
      user_id: string;
    }[],
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const handleError = (reason: string) => {
        logger.error('Moment video upload failed,', reason);
        dispatch({
          type: setMomentUploadProgressBar.type,
          payload: {
            momentUploadProgressBar: {
              ...momentUploadProgressBar,
              status: MomentUploadStatusType.Error,
            },
          },
        });
      };
      let momentUploadProgressBar: MomentUploadProgressBarType = {
        status: MomentUploadStatusType.UploadingToS3,
        momentId: '',
        originalVideoDuration: videoLength,
        momentInfo: {
          type: 'video',
          uri: videoUri,
          caption,
          category: momentCategory,
          tags: formattedTags,
        },
      };
      // set progress bar as loading
      dispatch({
        type: setMomentUploadProgressBar.type,
        payload: { momentUploadProgressBar },
      });

      const randHash = Math.random().toString(36).substring(7);
      const filename = `pc_${randHash}.mov`;

      // get a presigned url for the video
      const presignedURLResponse = await handlePresignedURL(filename);
      if (!presignedURLResponse) {
        handleError('Presigned URL failed');
        return;
      }

      const fileHash = presignedURLResponse.response_url.fields.key;

      if (!fileHash) {
        handleError('Unable to parse file hash from presigned response');
        return;
      }

      // upload video to s3
      const videoUploadResponse = await uploadVideoContent(videoUri, presignedURLResponse);
      if (!videoUploadResponse) {
        handleError('Video upload failed');
        return;
      }

      // Create a moment
      const createVideoMomentResponse: CreateVideoMomentResponse | undefined =
        await handleCreateVideoMoment(caption, momentCategory, filename);

      if (!createVideoMomentResponse) {
        handleError('Video moment object creation failed');
        return;
      }

      const momentId = createVideoMomentResponse.moment_id;

      // upload moment tags, now that we have a moment id
      const momentTagResponse = await postMomentTags(momentId, formattedTags);
      if (!momentTagResponse) {
        handleError('Upload moment tags failed');
        return;
      }

      dispatch({
        type: setMomentUploadProgressBar.type,
        payload: {
          momentUploadProgressBar: {
            ...momentUploadProgressBar,
            status: MomentUploadStatusType.WaitingForDoneProcessing,
            momentId,
          },
        },
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const loadUserProfileInfo =
  (userId: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    const token = await getTokenOrLogout(dispatch);
    const profile = await loadProfileInfo(token, userId);
    try {
      dispatch({
        type: userProfileFetched.type,
        payload: { profile },
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const unlockBackgroundTagg =
  (userId: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    const token = await getTokenOrLogout(dispatch);
    const success = await unlockBackgroundTaggService(token, userId);
    if (success) {
      getUserEligiblityForTaggBG(userId).then(res => {
        const checkBGFeature = Object?.keys(res as any)[0] === 'unlock_background';
        dispatch({
          type: setUserEligiblityForBGTagg.type,
          payload: {
            userBGTaggEligiblity: {
              unLockBG: !checkBGFeature,
              taggEligiblity: Object?.values(res as any)[0],
            },
          },
        });
      });
      dispatch(loadUserProfileInfo(userId));
    }
  };

export const updateTaggScore =
  (
    type: TaggScoreActionsEnum,
    userId: string,
    bannerTextType: TaggScoreBannerText,
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    const token = await getTokenOrLogout(dispatch);
    const success = await updateTaggScoreService(token, userId, type, bannerTextType, dispatch);
    if (success) {
      dispatch(loadUserProfileInfo(userId));
    }
  };

export const updateRewardsStore =
  (userId: string): ThunkAction<Promise<Boolean>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const token = await getTokenOrLogout(dispatch);
      const { rewards, newRewardsReceived, tagg_score } = await getGameProfileService(
        token,
        userId,
      );
      dispatch({
        type: updateRewards.type,
        payload: {
          rewards: JSON.parse(rewards),
        },
      });
      dispatch({
        type: updateNewRewardsReceived.type,
        payload: {
          newRewardsReceived: JSON.parse(newRewardsReceived),
        },
      });
      dispatch({
        type: setTaggScore.type,
        payload: {
          tagg_score,
        },
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

export const updateAnalyticStatus =
  (status: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    dispatch({
      type: setUpdateAnalyticStatus.type,
      payload: {
        status,
      },
    });
  };

export const changeAnalyticsStatusApi =
  (status: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    const token = await getTokenOrLogout(dispatch);
    const success = await changeAnalyticsStatus_ApiService(token, status);
    if (success) {
      dispatch(updateAnalyticStatus(AsyncAnalyticsStatusTextList.ANALYTICS_ENABLED));
      AsyncStorage.setItem(
        ASYNC_STORAGE_KEYS.ANALYTICS_ENABLED,
        AsyncAnalyticsStatusTextList.ANALYTICS_ENABLED,
      );
    }
  };

export const checkAnalyticsStatusApi =
  (status?: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    const token = await getTokenOrLogout(dispatch);
    const success = await checkAnalyticsStatus_ApiService(token);
    if (success) {
      dispatch(updateAnalyticStatus(AsyncAnalyticsStatusTextList.ANALYTICS_ENABLED));
      AsyncStorage.setItem(
        ASYNC_STORAGE_KEYS.ANALYTICS_ENABLED,
        AsyncAnalyticsStatusTextList.ANALYTICS_ENABLED,
      );
    } else {
      if (status && status === AsyncAnalyticsStatusTextList.PROFILE_LINK_COPIED) {
        dispatch(updateAnalyticStatus(status));
        AsyncStorage.setItem(ASYNC_STORAGE_KEYS.ANALYTICS_ENABLED, status);
      }
    }
  };

export const loadSkinPermission =
  (): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => async dispatch => {
    const permission = await fetchSkinPermission();
    try {
      dispatch({
        type: setSkinPermission.type,
        payload: { permission },
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const unlockBgTbGradient =
  (
    rewardType: any,
    userId: string,
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    const success = await setBgTabGradientPermission(rewardType);
    if (success) {
      dispatch(loadSkinPermission());
      dispatch(loadUserProfileInfo(userId));
    }
  };
