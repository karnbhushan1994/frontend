import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

import logger from 'utils/logger';

import {
  INCREMENT_COINS,
  IS_UNLOCKED_TAGG_THUMBNAIL,
  IS_UNLOCKED_TAGG_TITTLE_FONT,
  PERMISSION_POST_API,
  UNLOCK_TAGG_THUMBNAIL,
  UNLOCK_TAGG_TITTLE_FONT,
  VERSION_ENDPOINT,
} from '../constants';
import { EnvironmentType } from '../types';

export const loadImageFromURL = async (url: string) => {
  try {
    if (!url) {
      return undefined;
    }
    const response = await RNFetchBlob.config({
      fileCache: false,
      appendExt: 'jpg',
    }).fetch('GET', url);
    const status = response.info().status;
    if (status === 200) {
      return response.path();
    } else {
      return undefined;
    }
  } catch (error) {
    logger.log(error);
    return undefined;
  }
};

export const loadVideoFromURL = async (url: string) => {
  try {
    if (!url) {
      return undefined;
    }

    const response = await RNFetchBlob.config({
      fileCache: false,
      appendExt: 'mp4',
    }).fetch('GET', url);
    const status = response.info().status;
    if (status === 200) {
      return response.path();
    }
  } catch (error) {
    logger.log(error);
  }
};

export const getCurrentLiveVersions = async () => {
  try {
    const response = await fetch(VERSION_ENDPOINT, { method: 'GET' });
    if (response.status === 200) {
      const data: {
        live_versions: string;
        env: EnvironmentType;
      } = await response.json();
      return data;
    }
  } catch (error) {
    logger.log(error);
  }
};

export const checkIfFontUnlocked = async () => {
  try {
    let s = false;
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(IS_UNLOCKED_TAGG_TITTLE_FONT, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      const data = await response.json();
      s = data.tagg_title_font_color_unlocked;
    }
    return s;
  } catch (error) {
    logger.log('Error IS_UNLOCKED_TAGG_TITTLE_FONT');
  }
};

export const unlock_Font = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(UNLOCK_TAGG_TITTLE_FONT, {
      method: 'POST',
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

export const increment_coins = async (body: FormData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(INCREMENT_COINS, {
      method: 'POST',
      headers: {
        Authorization: 'Token ' + token,
      },
      body: body,
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

export const checkIfThumbnailUnlocked = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(IS_UNLOCKED_TAGG_THUMBNAIL, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      const data = await response.json();
      return data;
    }
    return false;
  } catch (error) {
    logger.log('Error IS_UNLOCKED_TAGG_TITTLE_FONT');
  }
};

export const unlock_Thumbnail = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(UNLOCK_TAGG_THUMBNAIL, {
      method: 'POST',
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

export const postPermissionToStatusBackend = async (body: FormData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(PERMISSION_POST_API, {
      method: 'POST',
      headers: {
        Authorization: 'Token ' + token,
      },
      body: body,
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
