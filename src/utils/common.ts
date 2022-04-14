import AsyncStorage from '@react-native-community/async-storage';
import CameraRoll from '@react-native-community/cameraroll';
import { useNavigation } from '@react-navigation/native';

import momentjs from 'moment';
import { Linking } from 'react-native';
import { getAll } from 'react-native-contacts';
import RNFS from 'react-native-fs';

import { images } from 'assets/images';

import { BROWSABLE_SOCIAL_URLS, TAGG_REDIRECT_URL, TOGGLE_BUTTON_TYPE } from '../constants';
import { retrieveMoment } from '../services';
import {
  ContactType,
  NotificationType,
  ScreenType,
  TemplateEnumType,
  UniversityBadgeType,
  UniversityType,
} from './../types/types';

export const getToggleButtonText: (buttonType: string, state: boolean) => string | null = (
  buttonType,
  state,
) => {
  switch (buttonType) {
    case TOGGLE_BUTTON_TYPE.FRIEND_UNFRIEND:
      return state ? 'Unfriend' : 'Add Friend';
    case TOGGLE_BUTTON_TYPE.BLOCK_UNBLOCK:
      return state ? 'Unblock' : 'Block';
    default:
      return null;
  }
};

export const handleOpenSocialUrlOnBrowser = (handle: string | undefined, social: string) => {
  if (handle && social in BROWSABLE_SOCIAL_URLS) {
    Linking.openURL(BROWSABLE_SOCIAL_URLS[social] + `${handle}/`);
  }
};

//Returns university class just like we would like to display on profile page
export const getUniversityClass = (universityClass: number) =>
  `Class of '${(universityClass % 2000).toString()}`;

export const getDateAge: (
  date: momentjs.Moment,
) => 'today' | 'yesterday' | 'thisWeek' | 'unknown' = (date: moment.Moment) => {
  const today = momentjs().startOf('day');
  const yesterday = momentjs().subtract(1, 'days').startOf('day');
  const weekOld = momentjs().subtract(7, 'days').startOf('day');
  if (date.isSame(today, 'd')) {
    return 'today';
  } else if (date.isSame(yesterday, 'd')) {
    return 'yesterday';
  } else if (date.isAfter(weekOld)) {
    return 'thisWeek';
  } else {
    return 'unknown';
  }
};

export const moveCategory: (categories: string[], category: string, moveUp: boolean) => string[] = (
  categories,
  category,
  moveUp,
) => {
  const i = categories.indexOf(category);
  const swapTarget = moveUp ? i - 1 : i + 1;
  if ((moveUp && i === 0) || (!moveUp && i > categories.length)) {
    return categories;
  }
  const tmp = categories[i];
  categories[i] = categories[swapTarget];
  categories[swapTarget] = tmp;
  return categories;
};

export const checkImageUploadStatus = (statusMap: object) => {
  if (statusMap) {
    for (const value of Object.values(statusMap)) {
      if (value !== 'Success') {
        return false;
      }
    }
  }
  return true;
};

export const haveUnreadNotifications = async (
  notifications: NotificationType[],
): Promise<boolean> => {
  for (const n of notifications) {
    const notificationDate = momentjs(n.timestamp);
    const prevLastViewed = await AsyncStorage.getItem('notificationLastViewed');
    const lastViewed: momentjs.Moment | undefined =
      prevLastViewed == null ? momentjs.unix(0) : momentjs(prevLastViewed);
    const dateAge = getDateAge(notificationDate);
    if (dateAge === 'unknown') {
      continue;
    }
    const unread = lastViewed ? lastViewed.diff(notificationDate) < 0 : false;
    if (unread) {
      return true;
    }
  }
  return false;
};

// https://stackoverflow.com/a/2450976
export const shuffle = (array: any[]) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const extractContacts = async () => {
  let retrievedContacts: Array<ContactType> = [];
  await getAll().then(contacts => {
    contacts.map(contact => {
      contact.phoneNumbers.map(phoneNumber => {
        retrievedContacts.push({
          first_name: contact.givenName,
          last_name: contact.familyName,
          phone_number: phoneNumber.number,
        });
      });
    });
  });
  return retrievedContacts;
};

export const getUniversityBadge = (university: UniversityType, type: UniversityBadgeType) => {
  switch (type) {
    case 'Search':
      return _searchPageIcon(university);
    case 'Crest':
      return _crestIcon(university);
    default:
      return images.main.bwbadges;
  }
};

const _searchPageIcon = (university: UniversityType) => {
  switch (university) {
    case UniversityType.Cornell:
      return images.universities.cornellSearch;
    case UniversityType.Brown:
      return images.main.bwbadges;
    default:
      return images.main.bwbadges;
  }
};

const _crestIcon = (university: UniversityType) => {
  switch (university) {
    case UniversityType.Cornell:
      return images.universities.cornell;
    case UniversityType.Brown:
      return images.universities.brown;
    default:
      return images.main.bwbadges;
  }
};

export const validateImageLink = async (url: string | undefined) => {
  if (!url) {
    return false;
  }
  return fetch(url)
    .then(res => {
      if (res.status === 200) {
        return true;
      } else {
        return false;
      }
    })
    .catch(_ => false);
};

// Documentation: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
export const numberWithCommas = (digits: number) =>
  digits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** taggid://callback/moment/MOMENT_ID
 * @returns true if moment was retrievable
 */
export const handleDeepLinkNavigations = async (
  url: string,
  navigation: ReturnType<typeof useNavigation>,
  screenType?: ScreenType,
) => {
  // ['', 'moment', 'MOMENT_ID', ...]
  const paths = new URL(url).pathname.split('/');
  const isShowed: string | null = await AsyncStorage.getItem('watchedIntroVideo');
  switch (paths[1]) {
    case 'moment':
      const momentId = paths[2];
      const moment = await retrieveMoment(momentId);
      if (!moment) {
        return false;
      }
      navigation.navigate('SingleMomentScreen', {
        moment,
        screenType,
      });
      break;
    case 'join':
      if (isShowed) {
        navigation.navigate('Phone', {
          login: true,
        });
      } else {
        navigation.navigate('LandingPage');
      }
      break;
    default:
      return false;
  }
  return true;
};

/**
 * Download remote file and save it to the app's cache directory.
 */
export const downloadFileToCache = async (url: string) => {
  const filename = new URL(url).pathname.split('/').pop();
  const LOCAL_PATH_TO_MEDIA = `${RNFS.CachesDirectoryPath}/${filename}`;
  await RNFS.downloadFile({
    fromUrl: url,
    toFile: LOCAL_PATH_TO_MEDIA,
  }).promise;
  return LOCAL_PATH_TO_MEDIA;
};

/**
 * Save media to camear roll and return the local identirier.
 *
 * e.g. saves to "ph://1E822E6D-2F1E-46A1-8966-6576095CFBA0/L0/001"
 *
 * returns "1E822E6D-2F1E-46A1-8966-6576095CFBA0/L0/001"
 */
export const saveMediaToCameraRoll = async (path: string, isVideo: boolean) => {
  const uri = await CameraRoll.save('file:///private' + path, {
    type: isVideo ? 'video' : 'photo',
  });
  return uri.split('//')[1];
};

export const makeTaggRedirectUrl = (momentId: string) => `${TAGG_REDIRECT_URL}moment/${momentId}/`;

export const makeTaggProfileUrl = (username: string) => `https://web.tagg.id/profiles/${username}`;

/**
 * Format counts such as view_count/friend_count
 */
export const formatCount = (count: number): string =>
  count < 5e3
    ? `${count}`
    : count < 1e5
    ? `${(count / 1e3).toFixed(1)}k`
    : count < 1e6
    ? `${(count / 1e3).toFixed(0)}k`
    : `${count / 1e6}m`;

/**
 * update and filter Array values such as seleted and unselected interests
 */
export const updateFilterArray = (
  origionalArray: string[],
  newValue: string,
  maxLength: number,
): string[] => {
  const index = origionalArray.indexOf(newValue);
  if (index > -1) {
    return origionalArray.filter(item => item !== newValue);
  } else {
    if (origionalArray.length < maxLength) {
      return [...origionalArray, newValue];
    } else {
      return origionalArray;
    }
  }
};

/**
 * Function to return start and end colors for LinearGradient component
 * If both start and end colors are undefined, it's a gradient background
 * If only start is defined, it's a solid color
 * Colors are reset if None is selected
 */
export const getBioBgColors = (
  primaryColor: string,
  secondaryColor: string,
  templateChoice: TemplateEnumType,
  bioColorStart?: string,
  bioColorEnd?: string,
  reset?: boolean,
) => {
  const DEFAULT_COLOR = '#808080';
  if (bioColorStart && bioColorEnd && !reset) {
    return [bioColorStart, bioColorEnd];
  } else if (bioColorStart && !reset) {
    return [bioColorStart, bioColorStart];
  } else {
    switch (templateChoice) {
      case TemplateEnumType.Four:
        return [gradientColorFormation(primaryColor)[0], gradientColorFormation(secondaryColor)[0]];
      default:
        return [DEFAULT_COLOR, DEFAULT_COLOR];
    }
  }
};

// Function to return text color that must be used for bio
export const getBioTextColor = (
  primaryColor: string,
  secondaryColor: string,
  templateChoice: TemplateEnumType,
  bioTextColor?: string,
) => {
  const DEFAULT_COLOR = '#FFFFFF';
  if (bioTextColor) {
    return bioTextColor;
  } else {
    switch (templateChoice) {
      case TemplateEnumType.One:
        return primaryColor;
      case TemplateEnumType.Two:
      case TemplateEnumType.Five:
        return secondaryColor;
      default:
        return DEFAULT_COLOR;
    }
  }
};

export const formatViewCount = (numbers: number[]): string => {
  const av = numbers.reduce((p, c) => p + c, 0) / numbers.length;
  if (av >= 1000000000) {
    return Number((av / 1000000000).toFixed(1)) + 'M';
  } else if (av >= 1000000) {
    return Number((av / 1000000).toFixed(1)) + 'M';
  } else if (av >= 1000) {
    return Number((av / 1000).toFixed(1)) + 'K';
  }
  return '';
};

export const gradientColorFormation = (color: string) =>
  color.length > 7 ? color.split(',') : [color, color];

export function capitalizeFirstLetter(string: string) {
  if (!string || !string.trim()) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}
