import { Action, ThunkAction } from '@reduxjs/toolkit';

import {
  acceptFriendRequestService,
  addFriendService,
  deleteFriendshipService,
  friendOrUnfriendUser,
  loadFriends,
} from 'services';
import { FriendshipStatusType, ProfilePreviewType, ScreenType, UserType } from 'types/types';
import { getTokenOrLogout, userXInStore } from 'utils';

import logger from 'utils/logger';

import { updateFriends, userFriendsFetched, userXFriendshipEdited } from '../reducers';
import { RootState } from '../rootReducer';

export const loadFriendsData =
  (userId: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const token = await getTokenOrLogout(dispatch);
      const friends = await loadFriends(userId, token);
      dispatch({
        type: userFriendsFetched.type,
        payload: { friends },
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const friendUnfriendUser =
  (
    user: UserType, //logged in user
    friend: ProfilePreviewType, // userX's profile preview
    friendship_status: FriendshipStatusType, // friendshp status with userx
    screenType: ScreenType, //screentype from content
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const token = await getTokenOrLogout(dispatch);
      // Calls method to send post or delete request
      const success = await friendOrUnfriendUser(friend.id, token, friendship_status);
      if (success) {
        let data = 'no_record';
        switch (friendship_status) {
          case 'no_record': // send request: update to requested
            data = 'requested';
            break;
          case 'requested': // cancel request: update to no relationship
            break;
          case 'friends': // unfriend: update to no relationship
            dispatch({
              type: updateFriends.type,
              payload: {
                data: friend,
                isFriend: true,
              },
            });
            data = 'no_record';
            break;
        }
        dispatch({
          type: userXFriendshipEdited.type,
          payload: {
            userId: friend.id,
            screenType,
            data,
          },
        });
      }
    } catch (error) {
      logger.log(error);
    }
  };

export const addFriend =
  (
    friend: ProfilePreviewType, // userX's profile preview
    screenType: ScreenType, //screentype from content
    state: RootState,
  ): ThunkAction<Promise<boolean | undefined>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const token = await getTokenOrLogout(dispatch);
      const success = await addFriendService(friend.id, token);
      if (success) {
        if (userXInStore(state, screenType, friend.id)) {
          dispatch({
            type: userXFriendshipEdited.type,
            payload: {
              userId: friend.id,
              screen: screenType,
              data: 'requested',
            },
          });
        }
        return true;
      }
    } catch (error) {
      logger.log(error);
    }
  };

export const unfriendUser =
  (
    friend: ProfilePreviewType, // userX's profile preview
    screenType: ScreenType, //screentype from content
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const token = await getTokenOrLogout(dispatch);
      // Calls method to send post or delete request
      const reason = 'unfriended';
      const success = await deleteFriendshipService(friend.id, reason, token);
      if (success) {
        let data = 'no_record';
        await dispatch({
          type: updateFriends.type,
          payload: {
            data: friend,
            isFriend: true,
          },
        });
        await dispatch({
          type: userXFriendshipEdited.type,
          payload: {
            userId: friend.id,
            screenType,
            data,
          },
        });
      }
    } catch (error) {
      logger.log(error);
    }
  };

export const acceptFriendRequest =
  (requester: ProfilePreviewType): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const token = await getTokenOrLogout(dispatch);
      const success = await acceptFriendRequestService(requester.id, token);
      if (success) {
        dispatch({
          type: updateFriends.type,
          payload: {
            data: requester,
            isFriend: false,
          },
        });
      }
    } catch (error) {
      logger.log(error);
    }
  };

export const declineFriendRequest =
  (user_id: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const token = await getTokenOrLogout(dispatch);
      const reason = 'declined';
      const success = await deleteFriendshipService(user_id, reason, token);
      if (success) {
        // Get profile of requester
        logger.log('declined request: ', success);
      } else {
        logger.log('Unsuccessful call');
      }
    } catch (error) {
      logger.log(error);
    }
  };

export const cancelFriendRequest =
  (user_id: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      logger.log('cancelFriendRequest!');
      const token = await getTokenOrLogout(dispatch);
      const reason = 'cancelled';
      const success = await deleteFriendshipService(user_id, reason, token);
      if (success) {
        // Get profile of requester
        logger.log('cancelled request: ', success);
      } else {
        logger.log('Unsuccessful call');
      }
    } catch (error) {
      logger.log(error);
    }
  };
