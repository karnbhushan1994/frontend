import { Action, ThunkAction } from '@reduxjs/toolkit';

import { loadSocialPosts } from 'services';
import { loadAllSocialsForUser } from 'utils';

import logger from 'utils/logger';

import { userSocialsFetched, individualSocialfetched } from '../reducers';
import { RootState } from '../rootReducer';

export const loadIndividualSocial =
  (
    userId: string,
    socialType: string,
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const social = await loadSocialPosts(userId, socialType);
      dispatch({
        type: individualSocialfetched.type,
        payload: { socialType, social },
      });
    } catch (error) {
      logger.log(error);
    }
  };

export const loadAllSocials =
  (userId: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    try {
      const socials = await loadAllSocialsForUser(userId);
      dispatch({
        type: userSocialsFetched.type,
        payload: socials,
      });
    } catch (error) {
      logger.log(error);
    }
  };
