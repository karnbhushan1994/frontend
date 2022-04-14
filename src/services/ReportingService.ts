//Common moments api abstracted out here

import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

import logger from 'utils/logger';

import { REPORT_ISSUE_ENDPOINT } from '../constants';

import { ERROR_SOMETHING_WENT_WRONG, MARKED_AS_MSG } from '../constants/strings';

export const sendReport = async (moment_id: string, message: string, callback?: Function) => {
  try {
    let token = await AsyncStorage.getItem('token');
    let response = await fetch(REPORT_ISSUE_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        resource_id: moment_id,
        type: 'content',
        reason: message,
      }),
      headers: {
        Authorization: 'Token ' + token,
      },
    });

    let statusCode = response.status;
    if (statusCode === 200) {
      Alert.alert(MARKED_AS_MSG(message.split(' ')[2]));
    } else {
      Alert.alert(ERROR_SOMETHING_WENT_WRONG);
    }
    if (callback) {
      callback();
    }
  } catch (error) {
    Alert.alert(ERROR_SOMETHING_WENT_WRONG);
    logger.log('Something went wrong! 😭', 'Unable able to retrieve data', error);
  }
};
