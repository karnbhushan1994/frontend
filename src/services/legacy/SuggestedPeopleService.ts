import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import logger from 'utils/logger';
import {
  ADD_BADGES_ENDPOINT,
  GET_USER_BADGES_ENDPOINT,
  REMOVE_BADGES_ENDPOINT,
  SP_MUTUAL_BADGE_HOLDERS_ENDPOINT,
  SP_UPDATE_PICTURE_ENDPOINT,
  SP_USERS_ENDPOINT,
  UPDATE_BADGES_ENDPOINT
} from '../../constants/api';
import {
  ERROR_BADGES_EXCEED_LIMIT,
  ERROR_UPLOAD_BADGES
} from '../../constants/strings';
import {
  ProfilePreviewType
} from '../../types';


export const sendSuggestedPeoplePhoto = async (photoUri: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const form = new FormData();
    form.append('suggested_people', {
      uri: photoUri,
      name: 'sp_photo.jpg',
      type: 'image/jpg',
    });
    const response = await fetch(SP_UPDATE_PICTURE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Token ' + token,
      },
      body: form,
    });
    return response.status === 201;
  } catch (error) {
    logger.log('Error uploading SP photo');
    return false;
  }
};

export const getSuggestedPeople = async (limit: number, offset: number, seed: number) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const url = `${SP_USERS_ENDPOINT}?limit=${limit}&offset=${offset}&seed=${seed}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status !== 200) {
      throw 'Non-200 response';
    }
    const data = await response.json();
    const typedData: SuggestedPeopleDataType[] = data.results;
    return typedData;
  } catch (error) {
    logger.log('Error fetching SP user data');
    logger.log(error);
    return [];
  }
};

export const getSuggestedPeopleProfile = async (userId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(SP_USERS_ENDPOINT + userId + '/', {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      const data: SuggestedPeopleDataType = await response.json();
      return data;
    } else {
      return undefined;
    }
  } catch (error) {
    logger.log('Error retrieving SP info');
    return undefined;
  }
};

export const getMutualBadgeHolders = async (badge_id: number) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(
      SP_MUTUAL_BADGE_HOLDERS_ENDPOINT + '?badge_id=' + badge_id,
      {
        method: 'GET',
        headers: {
          Authorization: 'Token ' + token,
        },
      },
    });
    if (response.status === 200) {
      const data: ProfilePreviewType[] = await response.json();
      return data;
    } else {
      return undefined;
    }
  } catch (error) {
    logger.log('Error retrieving SP info');
    return undefined;
  }
};

export const addBadgesService = async (selectedBadges: BadgeOptions[]) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const form = new FormData();
    form.append('badges', JSON.stringify(selectedBadges));
    const response = await fetch(ADD_BADGES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Token ' + token,
      },
      body: form,
    });
    if (response.status === 400) {
      Alert.alert(ERROR_BADGES_EXCEED_LIMIT);
      return false;
    }
    return true;
  } catch (error) {
    logger.log(error);
    Alert.alert(ERROR_UPLOAD_BADGES);
    return false;
  }
};

export const getBadgesService = async (userId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(GET_USER_BADGES_ENDPOINT + '?user_id=' + userId, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      const data: BadgeType[] = await response.json();
      return data ? data : [];
    } else {
      logger.log('Error loading badges data');
      return [];
    }
  } catch (error) {
    logger.log('Exception occued while loading badges data, ', error);
    return [];
  }
};

export const updateBadgesService = async (selectedBadges: BadgeOptions[]) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const form = new FormData();
    form.append('badges', JSON.stringify(selectedBadges));

    const response = await fetch(UPDATE_BADGES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Token ' + token,
      },
      body: form,
    });
    if (response.status === 400) {
      Alert.alert(ERROR_BADGES_EXCEED_LIMIT);
      return false;
    }
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    logger.log(error);
    Alert.alert(ERROR_UPLOAD_BADGES);
  }
};

export const removeBadgesService = async (
  removableBadges: BadgeOptions[],
  userId: string,
) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const form = new FormData();
    form.append('badges', JSON.stringify(removableBadges));
    form.append('user', JSON.stringify(userId));
    const response = await fetch(REMOVE_BADGES_ENDPOINT, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Token ' + token,
      },
      body: form,
    });
    if (response.status === 400) {
      Alert.alert(ERROR_BADGES_EXCEED_LIMIT);
      return false;
    }
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    logger.log(error);
    Alert.alert(ERROR_UPLOAD_BADGES);
    return false;
  }
};
