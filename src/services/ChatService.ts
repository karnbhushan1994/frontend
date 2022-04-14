import AsyncStorage from '@react-native-community/async-storage';

import logger from 'utils/logger';

import { CHAT_TOKEN_ENDPOINT } from '../constants/api';

export const loadChatTokenService = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(CHAT_TOKEN_ENDPOINT, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      const data = await response.json();
      return data.chatToken;
    }
    return '';
  } catch (error) {
    logger.log('Error loading chat token in service');
  }
};
