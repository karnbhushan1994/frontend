import AsyncStorage from '@react-native-community/async-storage';

import logger from 'utils/logger';

import { ProfilePreviewType } from '../types';

export const loadSearchResults = async (
  url: string,
): Promise<
  | { users: ProfilePreviewType[]; categories: ProfilePreviewType[]; badges: ProfilePreviewType[] }
  | undefined
> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const { status } = response;
    if (status === 200) {
      const searchResults: {
        users: ProfilePreviewType[];
        categories: ProfilePreviewType[];
        badges: ProfilePreviewType[];
      } = await response.json();
      return searchResults;
    }
  } catch (error) {
    logger.log(error);
    return undefined;
  }
  return undefined;
};
