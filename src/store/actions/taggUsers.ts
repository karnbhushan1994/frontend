import { Action, ThunkAction } from '@reduxjs/toolkit';

import { loadRecentlySearchedUsers } from 'services';

import logger from 'utils/logger';

import { taggUsersFetched } from '../reducers';
import { RootState } from '../rootReducer';

export const loadRecentlySearched =
  (): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => async dispatch => {
    try {
      const recentSearches = await loadRecentlySearchedUsers();
      dispatch({
        type: taggUsersFetched.type,
        payload: { recentSearches },
      });
    } catch (error) {
      logger.log(error);
    }
  };
