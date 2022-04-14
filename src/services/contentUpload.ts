import AsyncStorage from '@react-native-community/async-storage';
import Upload from 'react-native-background-upload';

import { MOMENTS_ENDPOINT } from '../constants';
import { TAGG_CUSTOMER_SUPPORT } from '../constants/constants';
import { PresignedURLResponse } from '../types';
import { checkImageUploadStatus } from '../utils';

// Packages

// constants

// use to upload image
export const uploadImgContent = async (
  uri: string,
  caption: string,
  category: string,
): Promise<any> => {
  const token = await AsyncStorage.getItem('token');
  return new Promise((resolve, reject) => {
    try {
      const body = new FormData();
      const fileExtension = uri.split('.').pop();
      const extension = fileExtension ? `.${fileExtension}` : '.jpg';
      body.append('image', {
        uri: 'file://' + uri,
        name: Math.random().toString(36).substring(7) + extension,
        type: 'image/jpg',
      });
      const body1 = {
        ...body,
        moment: category,
        captions: JSON.stringify({ uploaded_media: caption }),
      };
      // post data on server

      Upload.startUpload({
        url: MOMENTS_ENDPOINT,
        path: 'file://' + uri,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Token ' + token,
        },
        parameters: body1,
        notification: {
          enabled: true,
        },
        field: 'uploaded_media',
        type: 'multipart',
      })
        .then((uploadId: any) => {
          // return when submit request complete
          Upload.addListener('completed', uploadId, (response: any) => {
            let statusCode = response?.responseCode;
            let data: {
              moments: any;
              moment_id: string;
            } = response?.responseBody;
            if (statusCode === 200 && checkImageUploadStatus(data.moments)) {
              resolve(data);
            } else {
              console.log('Upload error!');
              resolve(data);
            }
          });
        })
        .catch((err: any) => {
          console.log('Upload error!', err);
          reject(err);
        });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

// use to upload video
export const uploadVideoContent = async (
  filePath: string,
  urlObj: PresignedURLResponse,
): Promise<any> =>
  new Promise((resolve, reject) => {
    try {
      if (urlObj === null || urlObj === undefined) {
        reject(false);
      }
      // listner on start and complete request to server
      Upload.startUpload({
        url: urlObj.response_url.url,
        path: 'file://' + filePath,
        method: 'POST',
        type: 'multipart', // needed over raw since raw does not do aws security headers
        field: 'file',
        // field: 'upload_file', // does not work
        // field: 'uploaded_media', // does not work!
        headers: {
          Accept: 'application/json',
          // 'content-type': 'application/octet-stream', //works
          // 'content-type': 'video/mp4', //works
          'content-type': 'multipart/form-data', //works
          // Authorization: 'Token ' + token, // cannot add auth
        },

        // required params
        parameters: {
          key: urlObj.response_url.fields.key,
          'x-amz-algorithm': urlObj.response_url.fields['x-amz-algorithm'],
          'x-amz-credential': urlObj.response_url.fields['x-amz-credential'],
          'x-amz-date': urlObj.response_url.fields['x-amz-date'],
          policy: urlObj.response_url.fields.policy,
          'x-amz-signature': urlObj.response_url.fields['x-amz-signature'],
        },
      })
        .then((uploadId: any) => {
          Upload.addListener('progress', uploadId, (data: any) => {
            console.log(`Progress: ${data.progress}%`);
          });
          Upload.addListener('error', uploadId, (error: any) => {
            console.log('error: ', JSON.stringify(error));
            resolve(false);
            reject(false);
          });
          Upload.addListener('completed', uploadId, (response: any) => {
            let status = response?.responseCode;
            if (status === 200 || status === 204) {
              resolve(true);
            } else {
              console.log('Upload error!');
              resolve(false);
              reject(false);

              if (status === 404) {
                console.log(
                  `Please make sure that the email / username entered is registered with us. You may contact our customer support at ${TAGG_CUSTOMER_SUPPORT}`,
                );
              } else {
                console.log('ERROR_SOMETHING_WENT_WRONG_REFRESH');
              }
            }
          });
        })
        .catch((err: any) => {
          console.log('Upload error!', err);
          reject(err);
        });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
