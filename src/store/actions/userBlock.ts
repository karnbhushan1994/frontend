import { Action, ThunkAction } from '@reduxjs/toolkit';

import { blockOrUnblockUser, loadBlockedUsers } from 'services';
import { AppDispatch } from 'store/configureStore';
import { getTokenOrLogout } from 'utils';
import logger from 'utils/logger';

import { updateUserXProfileAllScreens } from '../actions/userX';
import { userBlockFetched } from '../reducers';
import { RootState } from '../rootReducer';

export const loadBlockedList =
  (userId: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const token = await getTokenOrLogout(dispatch);
      const blocked = await loadBlockedUsers(userId, token);

      dispatch({
        type: userBlockFetched.type,
        payload: blocked,
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const blockUnblockUser = async (
  blockerUserId: string,
  blockedUserId: string,
  isBlocked: boolean,
  state: RootState,
  dispatch: AppDispatch,
) => {
  const token = await getTokenOrLogout(dispatch);
  const success = await blockOrUnblockUser(blockerUserId, blockedUserId, token, isBlocked);
  if (success) {
    await dispatch(updateUserXProfileAllScreens(blockedUserId, state));
  }
  return success;
};
