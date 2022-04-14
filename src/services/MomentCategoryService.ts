import { Alert } from 'react-native';

import logger from 'utils/logger';

import { MOMENT_CATEGORY_ENDPOINT } from '../constants';
import { ERROR_CATEGORY_CREATION } from '../constants/strings';

export const loadMomentCategories: (userId: string, token: string) => Promise<string[]> = async (
  userId,
  token,
) => {
  let categories: string[] = [];
  try {
    const response = await fetch(MOMENT_CATEGORY_ENDPOINT + `${userId}/`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      const data = await response.json();
      categories = data.categories;
    } else {
      return [];
    }
  } catch (err) {
    logger.log(err);
    return [];
  }
  return categories;
};

export const postMomentCategories: (
  categories: string[],
  token: string,
) => Promise<boolean> = async (categories, token) => {
  try {
    const response = await fetch(MOMENT_CATEGORY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify({ categories }),
    });
    const status = response.status;
    if (status === 200) {
      return true;
    } else {
      Alert.alert(ERROR_CATEGORY_CREATION);
      logger.log('Could not post categories!');
    }
  } catch (err) {
    logger.log(err);
    return false;
  }
  return false;
};
