import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import logger from 'utils/logger';

import {
  CHECK_MOMENT_UPLOAD_DONE_PROCESSING_ENDPOINT,
  CREATE_VIDEO_MOMENT_ENDPOINT,
  MOMENTS_ENDPOINT,
  MOMENTTAG_ENDPOINT,
  MOMENT_CATEGORY_ENDPOINT,
  MOMENT_COIN_ENDPOINT,
  MOMENT_SHARE_ENDPOINT,
  MOMENT_TAGS_ENDPOINT,
  MOMENT_THUMBNAIL_ENDPOINT,
  MOMENT_VIEWED_ENDPOINT,
  PRESIGNED_URL_ENDPOINT,
  TAGG_CUSTOMER_SUPPORT,
} from '../constants';
import {
  ERROR_EDIT_MOMENT_PAGE,
  ERROR_SOMETHING_WENT_WRONG,
  ERROR_SOMETHING_WENT_WRONG_REFRESH,
} from '../constants/strings';
import {
  CreateVideoMomentResponse,
  MomentPostType,
  MomentTagType,
  PresignedURLResponse,
} from '../types';

export const patchMoment = async (
  momentId: string,
  caption: string,
  category: string,
  tags: {
    x: number;
    y: number;
    z: number;
    user_id: string;
  }[],
) => {
  try {
    const request = new FormData();
    request.append('moment_id', momentId);
    request.append('caption', caption);
    request.append('category', category);
    request.append('tags', JSON.stringify(tags));
    const token = await AsyncStorage.getItem('token');
    let response = await fetch(MOMENTS_ENDPOINT, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Token ' + token,
      },
      body: request,
    });
    let statusCode = response.status;
    return statusCode === 200 || statusCode === 201;
  } catch (err) {
    logger.log(err);
  }
  return false;
};

export const retrieveMoment = async (momentId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const headers = token ? { Authorization: 'Token ' + token } : undefined;
    // this endpoint allow auth and public access
    const response = await fetch(MOMENTS_ENDPOINT + momentId + '/', {
      method: 'GET',
      headers: headers,
    });
    if (response.status === 200) {
      const moment: MomentPostType = await response.json();
      return moment;
    }
  } catch (err) {
    logger.log(err);
  }
};

export const loadMoments = async (userId: string, token: string) => {
  try {
    const response = await fetch(MOMENTS_ENDPOINT + '?user_id=' + userId, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      const typedData: MomentPostType[] = await response.json();
      return typedData;
    }
  } catch (err) {
    logger.log(err);
  }
  return [];
};

export const deleteMoment = async (momentId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(MOMENTS_ENDPOINT + `${momentId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    return response.status === 200;
  } catch (error) {
    logger.log(error);
    logger.log('Unable to delete moment', momentId);
    return false;
  }
};

export const loadMomentThumbnail = async (momentId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await RNFetchBlob.config({
      fileCache: false,
      appendExt: 'jpg',
    }).fetch('GET', MOMENT_THUMBNAIL_ENDPOINT + `${momentId}/`, {
      Authorization: 'Token ' + token,
    });
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

export const loadMomentTags = async (moment_id: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(MOMENT_TAGS_ENDPOINT + `?moment_id=${moment_id}`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      const tags: MomentTagType[] = await response.json();
      return tags;
    }
  } catch (error) {
    logger.error(error);
    return [];
  }
};

export const postMomentTags = async (
  moment_id: string,
  tags: {
    x: number;
    y: number;
    z: number;
    user_id: string;
  }[],
) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const form = new FormData();

    form.append('moment_id', moment_id);
    form.append('tags', JSON.stringify(tags));
    const response = await fetch(MOMENTTAG_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: 'Token ' + token,
      },
      body: form,
    });
    return response.status === 201 || response.status === 200;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const deleteMomentTag = async (moment_tag_id: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(MOMENTTAG_ENDPOINT + `${moment_tag_id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    return response.status === 200;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
/**
 * This function makes a request to the server in order to provide the client with a presigned URL.
 * This is called first, in order for the client to directly upload a file to S3
 * @param value: string | undefined
 * @returns a PresignedURLResponse object
 */
export const handlePresignedURL = async (filename: string) => {
  try {
    // TODO: just a random filename for video poc, we should not need to once complete
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(PRESIGNED_URL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify({
        filename,
      }),
    });
    const status = response.status;
    let data: PresignedURLResponse = await response.json();
    if (status === 200) {
      return data;
    } else {
      if (status === 404) {
        logger.log(
          `Please make sure that the email / username entered is registered with us. You may contact our customer support at ${TAGG_CUSTOMER_SUPPORT}`,
        );
      } else {
        logger.log(ERROR_SOMETHING_WENT_WRONG_REFRESH);
      }
      logger.log(response);
    }
  } catch (error) {
    logger.log(error);
    logger.log(ERROR_SOMETHING_WENT_WRONG);
  }
};

/**
 * Function to handle moment object creation on the backend
 * @param caption moment caption entered by user
 * @param momentCategory page to which moment must be uploaded to
 * @param filename to determine moment url on backend
 * @returns momentId, status message
 */
export const handleCreateVideoMoment = async (
  caption: string,
  momentCategory: string,
  filename: string,
) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(CREATE_VIDEO_MOMENT_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: 'Token ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename,
        caption: caption,
        category: momentCategory,
      }),
    });
    const status = response.status;
    let data: CreateVideoMomentResponse = await response.json();
    if (status === 201) {
      return data;
    } else {
      logger.log(response);
    }
  } catch (error) {
    logger.log(error);
    logger.log(ERROR_SOMETHING_WENT_WRONG);
  }
};

/**
 * This will tell the backend to delete the created moment object, called when upload to S3 fails
 * @param momentId
 * @returns
 */
export const cancelVideoUpload = async (momentId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(MOMENTS_ENDPOINT + momentId + '/', {
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      return;
    } else {
      logger.log(response);
    }
  } catch (error) {
    logger.log(error);
    logger.log(ERROR_SOMETHING_WENT_WRONG);
  }
};

export const updateMomentViewed = async (data: {
  moment_id: string;
  viewer_id: string;
  view_duration: number;
  clicked_on_profile: boolean;
  clicked_on_comments: boolean;
  clicked_on_share: boolean;
}) => {
  const token = await AsyncStorage.getItem('token');

  const response = await fetch(MOMENT_VIEWED_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: 'Token ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.status === 200;
};
export const getMomentCoin = async (momentId: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(MOMENT_COIN_ENDPOINT + momentId, {
    method: 'GET',
    headers: {
      Authorization: 'Token ' + token,
      'Content-Type': 'application/json',
    },
  });

  const resJson = await response.json();
  if (response.status === 200) {
    return resJson;
  } else {
    console.log('error', resJson);
  }
};

export const increaseMomentShareCount = async (moment_id: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(MOMENT_SHARE_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: 'Token ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ moment_id: moment_id }),
  });
  if (response.status === 200) {
    const { share_count }: { share_count: number } = await response.json();
    return share_count;
  } else {
    console.log(response);
  }
};

export const checkMomentDoneProcessing = async (momentId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(
      CHECK_MOMENT_UPLOAD_DONE_PROCESSING_ENDPOINT + '?moment_id=' + momentId,
      {
        method: 'GET',
        headers: {
          Authorization: 'Token ' + token,
        },
      },
    );
    return response.status === 200;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const editMomentPageTitleService = async (old_page_name: string, new_page_name: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(MOMENT_CATEGORY_ENDPOINT, {
      method: 'PATCH',
      headers: {
        Authorization: 'Token ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        old_page_name,
        new_page_name,
      }),
    });
    if (response.status === 200) {
      return true;
    } else {
      logger.error(await response.json());
      Alert.alert(ERROR_EDIT_MOMENT_PAGE);
      return false;
    }
  } catch (err) {
    logger.error(err);
  }
};
