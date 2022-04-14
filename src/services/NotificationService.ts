import AsyncStorage from '@react-native-community/async-storage';

import logger from 'utils/logger';

import {
  NOTIFICATIONS_ENDPOINT,
  NOTIFICATIONS_COUNT_ENDPOINT,
  NOTIFICATIONS_DATE,
} from '../constants';
import { NotificationType } from '../types';

export const getNotificationsData: () => Promise<NotificationType[]> = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(NOTIFICATIONS_ENDPOINT, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      const data: {
        count: number;
        results: any[];
        next?: string;
        previous?: string;
      } = await response.json();
      let typedData: NotificationType[] = [];
      for (const o of data.results) {
        typedData.push({
          ...o.notification,
          unread: false,
        });
      }
      return typedData;
    }
    return [];
  } catch (error) {
    logger.log('Unable to fetch notifications');
    return [];
  }
};

export const getNotificationsUnreadCount = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(NOTIFICATIONS_COUNT_ENDPOINT, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      const data: any = await response.json();
      const typedData: {
        CMT?: number;
        FRD_REQ?: number;
        P_VIEW?: number;
        MOM_TAG?: number;
        CLICK_TAG?: number;
        M_VIEW?: number;
      } = {};
      console.log(data);

      if (data.CMT) {
        typedData.CMT = data.CMT;
      }
      if (data.FRD_REQ && data.FRD_REQ > 0) {
        typedData.FRD_REQ = data.FRD_REQ;
      }
      if (data.P_VIEW && data.P_VIEW > 0) {
        typedData.P_VIEW = data.P_VIEW;
      }
      if (data.MOM_TAG && data.MOM_TAG > 0) {
        typedData.MOM_TAG = data.MOM_TAG;
      }
      if (data.CLICK_TAG && data.CLICK_TAG > 0) {
        typedData.CLICK_TAG = data.CLICK_TAG;
      }
      if (data.M_VIEW && data.M_VIEW > 0) {
        typedData.M_VIEW = data.M_VIEW;
      }
      return typedData;
    }
  } catch (error) {
    logger.log('Unable to fetch notifications');
  }
  return undefined;
};

export const setNotificationsReadDate: () => Promise<boolean> = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(NOTIFICATIONS_DATE, {
      method: 'POST',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 204) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.log('Unable to fetch notifications');
    return false;
  }
};
