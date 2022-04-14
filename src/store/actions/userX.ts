import { Action, ThunkAction } from '@reduxjs/toolkit';
import moment from 'moment';

import {
  fetchUserProfile,
  getSkin,
  getWidgetStore,
  loadFriends,
  loadMoments,
  loadProfileInfo,
} from 'services';
import { setApiLoader } from 'store/reducers/apiLoader';
import { ScreenType, UserType } from 'types/types';
import { getTokenOrLogout, loadAllSocialsForUser, userXInStore } from 'utils';
import logger from 'utils/logger';

import {
  resetScreen,
  setUserXProfileTemplate,
  userXAvatarFetched,
  userXCoverFetched,
  userXFriendsFetched,
  userXMomentCategoriesFetched,
  userXMomentsFetched,
  userXProfileFetched,
  userXRequested,
  userXSocialsFetched,
  userXUserFetched,
} from '../reducers';
import { RootState } from '../rootReducer';

export const loadUserX =
  (
    user: UserType,
    screenType: ScreenType,
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      dispatch({
        type: setApiLoader.type,
        payload: true,
      });
      const { userId } = user;
      getSkin(userId).then(skin =>
        dispatch({
          type: setUserXProfileTemplate.type,
          payload: {
            screenType,
            userId,
            profileTemplate: { skin },
          },
        }),
      );
      getWidgetStore(user.userId).then(widgetStore =>
        dispatch({
          type: setUserXProfileTemplate.type,
          payload: {
            screenType,
            userId,
            profileTemplate: { widgetStore },
          },
        }),
      );
      dispatch({
        type: userXRequested.type,
        payload: { screenType, userId },
      });

      dispatch({
        type: userXUserFetched.type,
        payload: { screenType, userId, user },
      });
      const token = await getTokenOrLogout(dispatch);
      fetchUserProfile(userId, token).then(profile => {
        if (profile) {
          const birthday = profile.profile_info.birthday;
          dispatch({
            type: userXProfileFetched.type,
            payload: {
              screenType,
              userId,
              data: {
                ...profile.profile_info,
                birthday: birthday && moment(birthday).format('YYYY-MM-DD'),
              },
            },
          });
          dispatch({
            type: userXAvatarFetched.type,
            payload: { screenType, userId, data: profile.profile_pic },
          });
          dispatch({
            type: userXCoverFetched.type,
            payload: { screenType, userId, data: profile.header_pic },
          });
          dispatch({
            type: userXMomentCategoriesFetched.type,
            payload: { screenType, userId, data: profile.moment_categories },
          });
        }
      });
      loadAllSocialsForUser(userId, token).then(data =>
        dispatch({
          type: userXSocialsFetched.type,
          payload: { screenType, userId, data },
        }),
      );
      loadFriends(userId, token).then(data =>
        dispatch({
          type: userXFriendsFetched.type,
          payload: { screenType, userId, data },
        }),
      );
      loadMoments(userId, token).then(data =>
        dispatch({
          type: userXMomentsFetched.type,
          payload: { screenType, userId, data },
        }),
      );
      dispatch({
        type: setApiLoader.type,
        payload: false,
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const updateUserXFriends =
  (
    userId: string,
    state: RootState,
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const screens = <ScreenType[]>[
        ScreenType.Profile,
        // ScreenType.Search,
        // ScreenType.Notifications,
      ];
      const token = await getTokenOrLogout(dispatch);
      screens.forEach(screenType => {
        if (userXInStore(state, screenType, userId)) {
          loadFriends(userId, token).then(data =>
            dispatch({
              type: userXFriendsFetched.type,
              payload: { screenType, userId, data },
            }),
          );
        }
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const resetScreenType =
  (screenType: ScreenType): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      dispatch({
        type: resetScreen.type,
        payload: { screenType },
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const updateUserXProfileAllScreens =
  (
    userId: string,
    state: RootState,
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const screens = <ScreenType[]>[
        ScreenType.Profile,
        ScreenType.DiscoverMoments,
        // ScreenType.Search,
        // ScreenType.Notifications,
      ];
      const token = await getTokenOrLogout(dispatch);
      screens.forEach(screenType => {
        if (userXInStore(state, screenType, userId)) {
          loadProfileInfo(token, userId).then(data => {
            dispatch({
              type: userXProfileFetched.type,
              payload: { screenType, userId, data },
            });
          });
        }
      });
    } catch (error) {
      logger.log(error);
    }
  };
