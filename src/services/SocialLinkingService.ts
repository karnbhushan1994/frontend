import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import logger from 'utils/logger';

import {
  LINK_FB_ENDPOINT,
  LINK_FB_OAUTH,
  LINK_IG_ENDPOINT,
  LINK_IG_OAUTH,
  LINK_SNAPCHAT_ENDPOINT,
  LINK_TIKTOK_ENDPOINT,
  LINK_TWITTER_ENDPOINT,
  LINK_TWITTER_OAUTH,
  LINKED_SOCIALS_ENDPOINT,
} from '../constants';
import { COMING_SOON_MSG, ERROR_LINK, SUCCESS_LINK } from '../constants/strings';

// A list of endpoint strings for all the integrated socials
export const integratedEndpoints: { [social: string]: [string, string] } = {
  Instagram: [LINK_IG_OAUTH, LINK_IG_ENDPOINT],
  Facebook: [LINK_FB_OAUTH, LINK_FB_ENDPOINT],
  Twitter: [LINK_TWITTER_OAUTH, LINK_TWITTER_ENDPOINT],
};

export const nonIntegratedEndpoints: { [social: string]: string } = {
  Snapchat: LINK_SNAPCHAT_ENDPOINT,
  TikTok: LINK_TIKTOK_ENDPOINT,
};

export const getNonIntegratedURL: (socialType: string, userId: string) => Promise<string> = async (
  socialType,
  userId,
) => {
  if (!(socialType in nonIntegratedEndpoints)) {
    return '';
  }
  try {
    const userToken = await AsyncStorage.getItem('token');
    const response = await fetch(nonIntegratedEndpoints[socialType] + userId + '/', {
      method: 'GET',
      headers: {
        Authorization: `Token ${userToken}`,
      },
    });
    if (response.status !== 200) {
      throw 'Unable to fetch profile URL:' + socialType;
    }
    const body = await response.json();
    return body.url || '';
  } catch (error) {
    logger.log(error);
    return '';
  }
};

export const registerNonIntegratedSocialLink: (
  socialType: string,
  username: string,
) => Promise<boolean> = async (socialType, username) => {
  if (!(socialType in nonIntegratedEndpoints)) {
    return false;
  }
  try {
    const user_token = await AsyncStorage.getItem('token');
    const response = await fetch(nonIntegratedEndpoints[socialType], {
      method: 'POST',
      headers: {
        Authorization: `Token ${user_token}`,
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    return response.status === 200;
  } catch (error) {
    logger.log(error);
    return false;
  }
};

// We have already received the short-lived token (callback_data), sending it
// to backend to exchange for and store the long-lived token.
export const registerIntegratedSocialLink: (
  callback_data: string,
  user_token: string,
  socialType: string,
) => Promise<boolean> = async (callback_data, user_token, socialType) => {
  if (!(socialType in integratedEndpoints)) {
    return false;
  }
  const response = await fetch(integratedEndpoints[socialType][1], {
    method: 'POST',
    headers: {
      Authorization: `Token ${user_token}`,
    },
    body: JSON.stringify({
      callback_url: callback_data,
    }),
  });
  if (!(response.status === 201)) {
    logger.log(await response.json());
  }
  return response.status === 201;
};

// Twitter is a special case since they use OAuth1, we will need to request
// for a request_token before we can begin browser signin.
export const getTwitterRequestToken: (user_token: string) => Promise<string> = async user_token => {
  const response = await fetch(integratedEndpoints.Twitter[0], {
    method: 'GET',
    headers: {
      Authorization: `Token ${user_token}`,
    },
  });
  return response.url;
};

// one stop shop for handling all browser sign-in social linkings
export const handlePressForAuthBrowser: (socialType: string) => Promise<boolean> = async (
  socialType: string,
) => {
  try {
    if (!(socialType in integratedEndpoints)) {
      Alert.alert(COMING_SOON_MSG);
      return false;
    }

    if (!(await InAppBrowser.isAvailable())) {
      // Okay... to open an external browser and have it link back to
      // the app is a bit tricky, we will need to have navigation routes
      // setup for this screen and have it hooked up.
      // See https://github.com/proyecto26/react-native-inappbrowser#authentication-flow-using-deep-linking
      // Though this isn't the end of the world, from the documentation,
      // the in-app browser should be supported from iOS 11, which
      // is about 98.5% of all iOS devices in the world.
      // See https://support.apple.com/en-gb/HT209574
      Alert.alert('Sorry! Your device was unable to open a browser to let you sign-in! 😔');
      return false;
    }

    let url = integratedEndpoints[socialType][0];
    const user_token = await AsyncStorage.getItem('token');

    if (!user_token) {
      throw 'Unable to get user token';
    }

    // We will need to do an extra step for twitter sign-in
    if (socialType === 'Twitter') {
      url = await getTwitterRequestToken(user_token);
    }

    return await InAppBrowser.openAuth(url, 'taggid://callback', {
      ephemeralWebSession: true,
    })
      .then(async response => {
        if (response.type === 'success' && response.url) {
          const success = await registerIntegratedSocialLink(response.url, user_token, socialType);
          if (!success) {
            throw 'Unable to register with backend';
          }
          Alert.alert(SUCCESS_LINK(socialType));
          return true;
        } else if (response.type === 'cancel') {
          return false;
        } else {
          throw 'Error from Oauth API';
        }
      })
      .catch(error => {
        logger.log(error);
        Alert.alert(ERROR_LINK(socialType));
        return false;
      });
  } catch (error) {
    logger.log(error);
    Alert.alert(ERROR_LINK(socialType));
  }
  return false;
};

// get all the linked socials from backend as an array
export const getLinkedSocials: (user_id: string) => Promise<string[]> = async (user_id: string) => {
  try {
    const user_token = await AsyncStorage.getItem('token');
    const response = await fetch(`${LINKED_SOCIALS_ENDPOINT}${user_id}/`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + user_token,
      },
    });
    if (response.status !== 200) {
      return [];
    }
    const body = await response.json();
    return body.linked_socials || [];
  } catch (error) {
    logger.log(error);
    return [];
  }
};
