import AsyncStorage from '@react-native-community/async-storage';

import logger from 'utils/logger';

import { ALL_USERS_ENDPOINT, DISCOVER_ENDPOINT, SEARCH_BUTTONS_ENDPOPINT } from '../constants';
import { ProfilePreviewType, SearchCategoryType } from '../types';

export const getAllTaggUsers = async () => {
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(ALL_USERS_ENDPOINT, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      const response_data = await response.json();
      return response_data;
    } else {
      logger.log('Something went wrong! 😭', 'Not able to retrieve tagg users list');
    }
  } catch (error) {
    logger.log('Something went wrong! 😭', 'Not able to retrieve tagg users list', error);
  }
};

export const getDiscoverUsers = async (categoryName: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const url = `${DISCOVER_ENDPOINT}get_users/?category=${categoryName}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status !== 200) {
      return undefined;
    }
    const users: ProfilePreviewType[] = await response.json();
    return users;
  } catch (error) {
    logger.log('Error fetching SP user data');
    logger.log(error);
    return undefined;
  }
};

export const getSuggestedSearchBubbleSuggestions = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(SEARCH_BUTTONS_ENDPOPINT, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });

    if (response.status !== 200) {
      return undefined;
    }

    const data: SearchCategoryType[] = await response.json();
    return data;
  } catch (error) {
    logger.log('Error fetching suggested search bubble suggestions');
    logger.log(error);
    return undefined;
  }
};
