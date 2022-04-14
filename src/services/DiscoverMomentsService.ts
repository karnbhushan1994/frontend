import AsyncStorage from '@react-native-community/async-storage';

import logger from 'utils/logger';

import {
  DISCOVER_MOMENTS_ENDPOINT,
  LIMITED_DISCCOVER_MOMENTS_ENDPOINT,
  UPDATE_DM_VIEW_STAGE,
} from '../constants/api';
import { MomentPostType } from '../types';

export const getDiscoverMoments = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const url = `${DISCOVER_MOMENTS_ENDPOINT}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status !== 200) {
      throw 'Non-200 response';
    }
    const typedData: MomentPostType[] = await response.json();
    return typedData;
  } catch (error) {
    logger.log('Error fetching moment data');
    logger.log(error);
    return [];
  }
};

export const getLimitedDiscoverMoments = async (userId: string) => {
  try {
    const url = `${LIMITED_DISCCOVER_MOMENTS_ENDPOINT}?user_id=${userId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {},
    });
    if (response.status !== 200 && response.status !== 204) {
      console.log('Problem fetching dm: ', await response.json());
      throw 'Non-200/204 response';
    }
    const typedData: MomentPostType[] = await response.json();
    return typedData;
  } catch (error) {
    logger.log('Error fetching moment data');
    logger.log(error);
    return [];
  }
};

export const updateDmViewStage = async (userId: string, dmViewStage: number) => {
  try {
    const response = await fetch(UPDATE_DM_VIEW_STAGE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        dm_view_stage: dmViewStage,
      }),
    });
    if (response.status !== 200 && response.status !== 204) {
      console.log('Problem updating dm view stage: ', await response.json());
      throw 'Non-200/204 response';
    }
    const typedData: MomentPostType[] = await response.json();
    return typedData;
  } catch (error) {
    logger.log('Error fetching moment data');
    logger.log(error);
    return [];
  }
};
