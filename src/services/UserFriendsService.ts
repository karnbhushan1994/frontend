import { Alert } from 'react-native';

import logger from 'utils/logger';

import { FRIENDS_ENDPOINT } from '../constants';
import { ERROR_SOMETHING_WENT_WRONG_REFRESH } from '../constants/strings';
import { FriendshipStatusType } from '../types';

export const loadFriends = async (userId: string, token: string) => {
  try {
    const response = await fetch(FRIENDS_ENDPOINT + `?user_id=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      const body = await response.json();
      return body;
    }
  } catch (error) {
    logger.log(error);
  }
  return [];
};

export const friendOrUnfriendUser = async (
  friend: string,
  token: string,
  friendship_status: FriendshipStatusType,
) => {
  try {
    let body;
    let method = '';
    let endpoint = FRIENDS_ENDPOINT;

    switch (friendship_status) {
      case 'no_record':
        method = 'POST';
        body = JSON.stringify({
          requested: friend,
        });
        break;
      case 'requested':
        method = 'DELETE';
        endpoint += `${friend}/`;
        body = JSON.stringify({
          reason: 'cancelled',
        });
        break;
      case 'friends':
        method = 'DELETE';
        endpoint += `${friend}/`;
        body = JSON.stringify({
          reason: 'unfriended',
        });
    }

    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
      body: body,
    });
    const status = response.status;
    if (Math.floor(status / 100) === 2) {
      return true;
    } else {
      logger.log(await response.json());
      Alert.alert(
        'Something went wrong! 😭',
        "Would you believe me if I told you that I don't know what happened?",
      );
      return false;
    }
  } catch (error) {
    logger.log(error);
    Alert.alert(
      'Something went wrong! 😭',
      "Would you believe me if I told you that I don't know what happened?",
    );
    return false;
  }
};

export const addFriendService = async (friend: string, token: string) => {
  try {
    const response = await fetch(FRIENDS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify({
        requested: friend,
      }),
    });
    const status = response.status;
    if (Math.floor(status / 100) === 2) {
      return true;
    } else {
      logger.log(await response.json());
      Alert.alert(
        'Something went wrong! 😭',
        "Would you believe me if I told you that I don't know what happened?",
      );
      return false;
    }
  } catch (error) {
    logger.log(error);
    Alert.alert(
      'Something went wrong! 😭',
      "Would you believe me if I told you that I don't know what happened?",
    );
    return false;
  }
};

export const acceptFriendRequestService = async (requester_id: string, token: string | null) => {
  try {
    const response = await fetch(FRIENDS_ENDPOINT + `${requester_id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (Math.floor(status / 100) === 2) {
      return true;
    } else {
      logger.log(await response.json());
      Alert.alert(
        'Something went wrong! 😭',
        "Would you believe me if I told you that I don't know what happened?",
      );
      return false;
    }
  } catch (error) {
    logger.log(error);
    Alert.alert(
      'Something went wrong! 😭',
      "Would you believe me if I told you that I don't know what happened?",
    );
    return false;
  }
};

export const deleteFriendshipService = async (
  user_id: string,
  reason: 'declined' | 'cancelled' | 'unfriended',
  token: string | null,
) => {
  try {
    logger.log('deleteFriendshipService!');
    const response = await fetch(FRIENDS_ENDPOINT + `${user_id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify({
        reason,
      }),
    });
    const status = response.status;
    if (Math.floor(status / 100) === 2) {
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
