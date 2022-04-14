import { RefObject } from 'react';

import CameraRoll from '@react-native-community/cameraroll';
import { Alert } from 'react-native';
import {
  RecordOptions,
  RecordResponse,
  RNCamera,
  TakePictureOptions,
  TakePictureResponse,
} from 'react-native-camera';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
// @ts-ignore no @types
import { ProcessingManager } from 'react-native-video-processing';

import logger from 'utils/logger';

import { MAX_VIDEO_RECORDING_DURATION } from '../constants';
import { ERROR_UPLOAD, ERROR_UPLOAD_EXCEED_MAX_VIDEO_DURATION } from '../constants/strings';

/*
 * Captures a photo and pauses to show the preview of the picture taken
 */
export const takePicture = (
  cameraRef: RefObject<RNCamera>,
  cameraType: string,
  callback: (pic: TakePictureResponse) => void,
) => {
  if (cameraRef !== null) {
    cameraRef.current?.pausePreview();
    const options: TakePictureOptions = {
      forceUpOrientation: true,
      orientation: 'portrait',
      mirrorImage: cameraType === 'front',
      writeExif: false,
    };
    cameraRef.current
      ?.takePictureAsync(options)
      .then(pic => {
        callback(pic);
      })
      .catch(error => {
        logger.log(error);
      });
  }
};

export const takeVideo = (
  cameraRef: RefObject<RNCamera>,
  cameraType: string,
  callback: (vid: RecordResponse) => void,
) => {
  if (cameraRef !== null) {
    const options: RecordOptions = {
      orientation: 'portrait',
      maxDuration: MAX_VIDEO_RECORDING_DURATION,
      mirrorVideo: cameraType === 'front',
      quality: '1080p',
    };
    cameraRef.current
      ?.recordAsync(options)
      .then(vid => {
        callback(vid);
      })
      .catch(error => {
        logger.log(error);
      });
  }
};

export const saveMediaToGallery = (mediaUri: string, isVideo: boolean) => {
  CameraRoll.save(mediaUri, {
    album: 'Recents',
    type: isVideo ? 'video' : 'photo',
  })
    .then(_res => Alert.alert('Saved to device!'))
    .catch(_err => Alert.alert('Failed to save to device!'));
};

export const navigateToMediaPicker = (callback: (media: ImageOrVideo) => void) => {
  ImagePicker.openPicker({
    smartAlbums: [
      'Favorites',
      'RecentlyAdded',
      'SelfPortraits',
      'Screenshots',
      'UserLibrary',
      'Videos',
    ],
    mediaType: 'any',
    compressVideoPreset: 'Passthrough',
  })
    .then(media => {
      if (
        'duration' in media &&
        media.duration !== null &&
        media.duration > MAX_VIDEO_RECORDING_DURATION * 1000
      ) {
        Alert.alert(ERROR_UPLOAD_EXCEED_MAX_VIDEO_DURATION);
        return;
      }
      callback(media);
    })
    .catch(err => {
      if (err.code && err.code !== 'E_PICKER_CANCELLED') {
        Alert.alert(ERROR_UPLOAD);
      }
    });
};

export const showGIFFailureAlert = (onSuccess: () => void) =>
  Alert.alert(
    'Warning',
    'The app currently cannot handle GIFs, and will only save a static image.',
    [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Post',
        onPress: onSuccess,
        style: 'default',
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert('This alert was dismissed by tapping outside of the alert dialog.'),
    },
  );

export const trimVideo = (
  sourceUri: string,
  handleData: (data: any) => any,
  ends: {
    start: number;
    end: number;
  },
) => {
  ProcessingManager.trim(sourceUri, {
    startTime: ends.start / 2, //needed divide by 2 for bug in module
    endTime: ends.end,
    quality: 'passthrough',
  }).then((data: any) => handleData(data));
};

export const cropVideo = (
  sourceUri: string,
  handleData: (data: any) => any,
  videoCropValues?: {
    cropWidth?: number;
    cropHeight?: number;
    cropOffsetX?: number;
    cropOffsetY?: number;
  },
  muted?: boolean,
) => {
  ProcessingManager.crop(sourceUri, {
    cropWidth: videoCropValues
      ? videoCropValues.cropWidth
        ? Math.round(videoCropValues.cropWidth)
        : 100
      : 100,
    cropHeight: videoCropValues
      ? videoCropValues.cropHeight
        ? Math.round(videoCropValues.cropHeight)
        : 100
      : 100,
    cropOffsetX: videoCropValues
      ? videoCropValues.cropOffsetX
        ? Math.round(videoCropValues.cropOffsetX)
        : 0
      : 0,
    cropOffsetY: videoCropValues
      ? videoCropValues.cropOffsetY
        ? Math.round(videoCropValues.cropOffsetY)
        : 0
      : 0,
    quality: 'highest',
  }).then((data: any) => {
    if (muted) {
      removeAudio(data, handleData);
    } else {
      handleData(data);
    }
  });
};

export const removeAudio = (sourceUri: string, handleData: (data: any) => any) => {
  ProcessingManager.compress(sourceUri, { removeAudio: true }).then((data: any) =>
    handleData(data),
  );
};
