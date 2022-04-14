import logger from 'utils/logger';

import { LOGIN_COUNT_ENDPOINT, SKIN_COUNT_ENDPOINT } from '../constants';

/*
export const getHasRated: (userId: string, token: string) => Promise<boolean> = async (
  userId,
  token,
) => {
  try {
    const response = await fetch(HAS_RATED_ENDPOINT + `${userId}/`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      const data = await response.json();
      return data.hasRated;
    } else {
      return false;
    }
  } catch (err) {
    logger.log(err);
    return false;
  }
};

export const updateHasRated: (userId: string, token: string) => Promise<Number> = async (
  userId,
  token,
) => {
  try {
    const response = await fetch(HAS_RATED_ENDPOINT + `${userId}/`, {
      method: 'PUT',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      const data = await response.json();
      return data.hasRated;
    } else {
      return false;
    }
  } catch (err) {
    logger.log(err);
    return false;
  }
};
*/

export const getSkinCount: (userId: string, token: string) => Promise<Number> = async (
  userId,
  token,
) => {
  try {
    const response = await fetch(SKIN_COUNT_ENDPOINT + `?user_id=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      const data = await response.json();
      return data.count;
    } else {
      return 0;
    }
  } catch (err) {
    logger.log(err);
    return 0;
  }
};

export const getLoginCount: (userId: string, token: string) => Promise<Number> = async (
  userId,
  token,
) => {
  try {
    const response = await fetch(LOGIN_COUNT_ENDPOINT + `${userId}/`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      const data = await response.json();
      return data.count;
    } else {
      return 0;
    }
  } catch (err) {
    logger.log(err);
    return 0;
  }
};

export const updateLoginCount: (userId: string, token: string) => Promise<Number> = async (
  userId,
  token,
) => {
  try {
    const response = await fetch(LOGIN_COUNT_ENDPOINT + `${userId}/`, {
      method: 'PUT',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      const data = await response.json();
      return data.count;
    } else {
      return 0;
    }
  } catch (err) {
    logger.log(err);
    return 0;
  }
};
