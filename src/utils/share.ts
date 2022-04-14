import Clipboard from '@react-native-clipboard/clipboard';
import CameraRoll from '@react-native-community/cameraroll';
import { Linking, Platform } from 'react-native';
import Share from 'react-native-share';
import { captureScreen } from 'react-native-view-shot';

import logger from 'utils/logger';

import { MomentPostType, ShareToType } from '../types';
import {
  downloadFileToCache,
  makeTaggProfileUrl,
  makeTaggRedirectUrl,
  saveMediaToCameraRoll,
} from './common';
import { copyProfileLinkToClipboard } from './users';
import { addTaggWatermark } from './watermark';

export const shareToSocial = async (
  shareTo: ShareToType,
  moment: MomentPostType,
  isVideo: boolean,
  callback?: () => void,
) => {
  switch (shareTo) {
    case 'Instagram':
      onLinkToIG(moment, isVideo);
      break;
    case 'Twitter':
      onLinkToTwitter(moment);
      break;
    case 'SMS':
      onSMS(moment);
      break;
    case 'Copy Link':
      if (callback) {
        onCopyLink(moment, callback);
      }
      break;
    case 'Others':
      onLinkToOthers(moment, isVideo);
      break;
    default:
      logger.error('Not supported');
      break;
  }
};

export const shareProfileToSocial = async (
  shareTo: ShareToType,
  username: string,
  callback?: () => void,
) => {
  switch (shareTo) {
    case 'Messenger':
      onProfileLinkToMessenger(username);
      break;
    case 'Twitter':
      onProfileLinkToTwitter(username);
      break;
    case 'SMS':
      onProfileToSMS(username);
      break;
    case 'Copy Link':
      if (callback) {
        onCopyProfileLink(username, callback);
      }
      break;
    case 'Instagram':
      onLinkToINSTA();
      break;
    case 'Others':
      onProfileLinkToOthers(username);
      break;
    default:
      logger.error('Not supported');
      break;
  }
};

const onLinkToIG = async (moment: MomentPostType, isVideo: boolean) => {
  addTaggWatermark(
    await downloadFileToCache(moment.moment_url),
    moment.user.username,
    isVideo,
    async watermarkedMediaUri => {
      const localIdentifier = await saveMediaToCameraRoll(watermarkedMediaUri, isVideo);
      const encodedPath = encodeURIComponent(localIdentifier);
      Linking.openURL(`instagram://library?OpenInEditor=1&LocalIdentifier=${encodedPath}`);
    },
  );
};

const onLinkToINSTA = async () => {
  captureScreen({
    format: 'jpg',
    quality: 0.8,
  }).then(async uri => {
    let uris = await CameraRoll.save('file:///' + uri, {
      type: 'photo',
    });
    let path = uris.split('//')[1];
    const encodedPaths = encodeURIComponent(path);
    Linking.openURL(`instagram://library?OpenInEditor=1&LocalIdentifier=${encodedPaths}`);
  });
};

const onProfileLinkToMessenger = async (username: string) => {
  Linking.openURL(`fb-messenger://share?link=${makeTaggProfileUrl(username)}`);
};

const onLinkToTwitter = async (moment: MomentPostType) => {
  Linking.openURL(`twitter://post?message=${makeMessage(moment)}`);
};

const onProfileLinkToTwitter = async (username: string) => {
  Linking.openURL(`twitter://post?message=${makeProfileMessage(username)}`);
};

const onSMS = async (moment: MomentPostType) => {
  const operator = Platform.select({ ios: '&', android: '?' });
  Linking.openURL(`sms:${operator}body=${makeMessage(moment)}`);
};

const onProfileToSMS = async (username: string) => {
  const operator = Platform.select({ ios: '&', android: '?' });
  Linking.openURL(`sms:${operator}body=${makeProfileMessage(username)}`);
};

const onLinkToOthers = async (moment: MomentPostType, isVideo: boolean) => {
  const name = moment.user.first_name + ' ' + moment.user.last_name;
  addTaggWatermark(
    await downloadFileToCache(moment.moment_url),
    moment.user.username,
    isVideo,
    watermarkedMediaUri => {
      Share.open({
        title: 'Share to Others',
        message: `Check out ${name}'s moment on Tagg!`,
        url: watermarkedMediaUri,
      });
    },
  );
};

const onProfileLinkToOthers = async (username: string) => {
  Share.open({
    title: 'Share to Others',
    message: `Check out ${username}'s profile on Tagg!`,
    url: makeTaggProfileUrl(username),
  });
};

export const onCopyLink = async (moment: MomentPostType, callback: () => void) => {
  Clipboard.setString(makeTaggRedirectUrl(moment.moment_id));
  callback();
};

export const onCopyProfileLink = async (username: string, callback: () => void) => {
  copyProfileLinkToClipboard(username);
  callback();
};

const makeMessage = (moment: MomentPostType) => {
  const name = moment.user.first_name + ' ' + moment.user.last_name;
  const redirectUrl = makeTaggRedirectUrl(moment.moment_id);
  return `Check out ${name}'s moment on Tagg! ${redirectUrl}`;
};

const makeProfileMessage = (username: string) => {
  const redirectUrl = makeTaggProfileUrl(username);
  return `Check out ${username}'s profile on Tagg! ${redirectUrl}`;
};
