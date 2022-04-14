import { Action, ThunkAction } from '@reduxjs/toolkit';

import { getNotificationsData } from 'services';

import logger from 'utils/logger';

import { userNotificationsFetched } from '../reducers';
import { RootState } from '../rootReducer';

export const loadUserNotifications =
  (): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => async dispatch => {
    try {
      const notifications = await getNotificationsData();
      dispatch({
        type: userNotificationsFetched.type,
        payload: notifications,
      });
    } catch (error) {
      logger.log(error);
    }
  };
