//Abstracted common block user api calls out here

import { Alert } from 'react-native';

import logger from 'utils/logger';

import { BLOCK_USER_ENDPOINT } from '../constants';
import { ERROR_SOMETHING_WENT_WRONG_REFRESH } from '../constants/strings';

export const loadBlockedUsers = async (userId: string, token: string) => {
  try {
    const response = await fetch(BLOCK_USER_ENDPOINT + `?user_id=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      const body = await response.json();
      return body;
    } else {
      throw new Error(await response.json());
    }
  } catch (error) {
    logger.log(error);
  }
};

export const blockOrUnblockUser = async (
  blocker: string,
  blocked: string,
  token: string,
  isBlocked: boolean,
) => {
  try {
    const endpoint = BLOCK_USER_ENDPOINT + (isBlocked ? `${blocker}/` : '');

    const response = await fetch(endpoint, {
      method: isBlocked ? 'DELETE' : 'POST',
      headers: {
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify({
        blocked,
      }),
    });
    if (Math.floor(response.status / 100) === 2) {
      return true;
    } else {
      logger.log(await response.json());
      Alert.alert(ERROR_SOMETHING_WENT_WRONG_REFRESH);
      return false;
    }
  } catch (error) {
    logger.log(error);
    Alert.alert(ERROR_SOMETHING_WENT_WRONG_REFRESH);
    return false;
  }
};

export const isUserBlocked = async (blocker: string, blocked: string, token: string) => {
  try {
    const ext = `${blocked}/?blocker=${blocker}`;

    const response = await fetch(BLOCK_USER_ENDPOINT + ext, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });

    if (Math.floor(response.status / 100) === 2) {
      const data = await response.json();
      return data.is_blocked;
    } else {
      logger.log(await response.json());
      Alert.alert(ERROR_SOMETHING_WENT_WRONG_REFRESH);
    }
  } catch (error) {
    Alert.alert(ERROR_SOMETHING_WENT_WRONG_REFRESH);
  }
};
