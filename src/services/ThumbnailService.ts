import logger from 'utils/logger';

import { ThumbnailForTaggs } from '../constants';

const getFormData = (object: any) => {
  const formData = new FormData();
  Object.keys(object).forEach(key => formData.append(key, object[key]));
  return formData;
};
export const createThumbnailForTaggs = async (
  data: {
    filename: string;
  },
  token: string,
) => {
  try {
    // console.log('token', token);
    const response = await fetch(ThumbnailForTaggs, {
      method: 'POST',
      headers: {
        Authorization: 'Token ' + token,
        //   'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
export const createThumbnailForTaggsPost = async (data: any, baseUrl: string) => {
  try {
    // console.log(getFormData(data));
    const response = await fetch(baseUrl, {
      method: 'POST',

      body: getFormData(data),
    });
    if (response.status === 204) {
      // console.log('reeeess', response.status);
      const body = await response.json();
      return body;
    } else {
      throw new Error(await response.json());
    }
  } catch (error) {
    logger.log(error);
  }
};
