import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

import { ApplicationLinkWidgetLinkTypes } from 'types';
import logger from 'utils/logger';

import { TOP_TAGGS_TODAY, WAITLIST_USER_ENDPOINT } from '../constants';

export const adduserToWaitlist: (
  phone_number: string,
  first_name: string,
  last_name: string,
) => Promise<boolean> = async (phone_number, first_name, last_name) => {
  try {
    const response = await fetch(WAITLIST_USER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number,
        first_name,
        last_name,
      }),
    });
    const status = response.status;
    const message = await response.json();
    if (status === 200) {
      return true;
    } else {
      if (status === 409) {
        Alert.alert('You are already on our waitlist / on our app');
      } else if (status === 400) {
        Alert.alert('Some information needed was missing / ill-formatted');
      } else if (status === 500) {
        Alert.alert('Something went wrong. Sorry unable to add you to the waitlist 😔');
      }
      logger.log(message);
    }
  } catch (err) {
    Alert.alert('Something went wrong. Sorry unable to add you to the waitlist 😔');
    logger.log(err);
  }
  return false;
};
export const getTopTaggsToday = async (): Promise<ApplicationLinkWidgetLinkTypes[]> => {
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(TOP_TAGGS_TODAY, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
        'Content-Type': 'application/json',
      },
    });

    const status = response.status;
    const message = await response.json();
    if (status === 200) {
      return message;
    } else {
      logger.log(message);
    }
  } catch (err) {
    logger.log(err);
  }
  return [];
};
