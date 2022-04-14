import { Action, ThunkAction } from '@reduxjs/toolkit';

import { loadMomentCategories, postMomentCategories } from 'services';
import { getTokenOrLogout } from 'utils';

import logger from 'utils/logger';

import { momentCategoriesFetched } from '../reducers';
import { RootState } from '../rootReducer';

/**
 * Load all categories for user
 * @param userId id of the user for whom categories should be loaded
 */
export const loadUserMomentCategories =
  (userId: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const token = await getTokenOrLogout(dispatch);
      const categories = await loadMomentCategories(userId, token);
      dispatch({
        type: momentCategoriesFetched.type,
        payload: { categories },
      });
    } catch (error) {
      logger.log(error);
    }
  };

/**
 * Handle addition / deletion of categories for a user
 * @param categories List of categories
 */
export const updateMomentCategories =
  (categories: string[]): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const token = await getTokenOrLogout(dispatch);

      const success = await postMomentCategories(categories, token);
      if (success) {
        dispatch({
          type: momentCategoriesFetched.type,
          payload: { categories },
        });
      }
    } catch (error) {
      logger.log(error);
    }
  };
