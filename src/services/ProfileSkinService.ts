import { SKIN_ENDPOINT } from 'constants/api';
import logger from 'utils/logger';

export const getAllProfileSkinsService = async (token: string) => {
  try {
    const response = await fetch(SKIN_ENDPOINT, {
      method: 'GET',
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

export const createProfileSkinService = async (token: string, requestBody: Object) => {
  try {
    const response = await fetch(SKIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify(requestBody),
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

export const udpateProfileSkinService = async (
  skinId: string,
  token: string,
  requestBody: Object,
) => {
  try {
    const response = await fetch(SKIN_ENDPOINT + `${skinId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify(requestBody),
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
