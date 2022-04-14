import { Action, ThunkAction } from '@reduxjs/toolkit';

import { loadMoments } from 'services';
import { getTokenOrLogout } from 'utils';

import logger from 'utils/logger';

import { userMomentsFetched, momentCategoryDeleted } from '../reducers';
import { RootState } from '../rootReducer';

export const loadUserMoments =
  (userId: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const token = await getTokenOrLogout(dispatch);
      const moments = await loadMoments(userId, token);
      dispatch({
        type: userMomentsFetched.type,
        payload: moments,
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const deleteUserMomentsForCategory =
  (category: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      dispatch({
        type: momentCategoryDeleted.type,
        payload: category,
      });
    } catch (error) {
      logger.log(error);
    }
  };
