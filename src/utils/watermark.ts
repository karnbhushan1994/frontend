import { Image } from 'react-native';
import ImageMarker, { ImageFormat, Position } from 'react-native-image-marker';
// @ts-ignore no @types
import { ProcessingManager } from 'react-native-video-processing';
// @ts-ignore no @types
import VideoWatermark from 'react-native-video-watermarker';

import { images } from 'assets/images';
import logger from 'utils/logger';

const watermarkUri = Image.resolveAssetSource(images.main.watermark).uri;

/*
 * Adds text watermark at bottom center to a photo and returns the uri in callback.
 * Returns an empty string if error.
 */
const makeUserWatermark = (
  scale: number,
  callback: (userWatermarkUri: string, watermarkWidth: number, watermarkHeight: number) => void,
  username?: string,
) => {
  ImageMarker.markText({
    src: watermarkUri,
    text: `@${username}` || '',
    position: Position.bottomLeft,
    color: '#ffffff',
    fontName: 'AppleSDGothicNeo-Medium',
    fontSize: 48,
    scale: scale,
    quality: 100,
    saveFormat: ImageFormat.png,
  })
    .then(res => {
      Image.getSize(
        res,
        (width, height) => {
          callback(res, width, height);
        },
        () => null,
      );
    })
    .catch(err => {
      logger.error(err);
    });
};

/*
 * Adds a watermark over an image and returns the desired uri in callback.
 * Returns an empty string if error.
 */
const watermarkImage = (
  backgroundUri: string,
  watermarkerUri: string,
  x: number,
  y: number,
  callback: (watermarkedImageUri: string) => void,
) => {
  ImageMarker.markImage({
    src: backgroundUri,
    markerSrc: watermarkerUri,
    X: x,
    Y: y,
    scale: 1,
    markerScale: 1,
    quality: 100,
  })
    .then(path => {
      callback(path);
    })
    .catch(err => {
      logger.log(err, 'err');
      callback('');
    });
};

/*
 * Adds a watermark over a video then callbacks the desired uri.
 * Returns an empty uri on failure.
 */
const watermarkVideo = (
  videoUri: string,
  watermarkerUri: string,
  watermarkWidth: number,
  watermarkHeight: number,
  callback: (watermarkedVideoUri: string) => void,
) => {
  VideoWatermark.convert(
    videoUri.replace('file://', ''),
    watermarkerUri,
    'CUSTOM',
    watermarkWidth,
    watermarkHeight,
    (convertedVideo: string) => {
      callback(convertedVideo);
    },
  );
};

export enum ContentType {
  image = 0,
  video = 1,
}

export const addTaggWatermark = async (
  uri: string,
  username: string,
  isVideo: boolean,
  callback: (watermarkedMediaUri: string) => void,
) => {
  try {
    const handleWatermarking = (width: number, height: number) => {
      const aspectRatio = width / height;
      // watermark image is about 400px high
      const scale = (height * 0.15) / 400;
      // watermark "looks" small on landscape images, scaling it up a bit here
      const adjustedScale = aspectRatio > 1 ? scale * aspectRatio : scale;
      const x = width * 0.05;
      const y = height * 0.05;
      makeUserWatermark(
        adjustedScale,
        (usernameImageUri, watermarkWidth, watermarkHeight) => {
          if (isVideo) {
            watermarkVideo(uri, usernameImageUri, watermarkWidth, watermarkHeight, callback);
          } else {
            watermarkImage(uri, usernameImageUri, x, y, callback);
          }
        },
        username,
      );
    };
    if (isVideo) {
      ProcessingManager.getVideoInfo(uri).then(
        ({ size: { width, height } }: { size: { width: number; height: number } }) =>
          handleWatermarking(width, height),
      );
    } else {
      Image.getSize(uri, handleWatermarking, () => null);
    }
  } catch (error) {
    logger.log(error);
  }
};
