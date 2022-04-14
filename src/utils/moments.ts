import moment from 'moment';
import { ImageSourcePropType } from 'react-native';

import { images } from 'assets/images';
import logger from 'utils/logger';

import { MOMENT_CATEGORY_BG_COLORS } from '../constants';
import { increaseMomentShareCount } from '../services';
import { MomentPostType } from '../types';

/**
 * Formats elapsed time from a given time.
 * @param date_time given time
 * @returns difference in the largest possible unit of time (days > hours > minutes > seconds)
 */
export const getTimePosted = (date_time: string) => {
  const datePosted = moment(date_time);
  const now = moment();
  var time = date_time;
  var difference = now.diff(datePosted, 'seconds');

  // Creating elapsedTime string to display to user
  // 0 to less than 1 minute
  if (difference < 60) {
    time = difference + ' seconds';
  }
  // 1 minute to less than 1 hour
  else if (difference >= 60 && difference < 60 * 60) {
    difference = now.diff(datePosted, 'minutes');
    time = difference + 'm ago';
  }
  // 1 hour to less than 1 day
  else if (difference >= 60 * 60 && difference < 24 * 60 * 60) {
    difference = now.diff(datePosted, 'hours');
    time = difference + 'h ago';
  }
  // Any number of days
  else if (difference >= 24 * 60 * 60 && difference < 24 * 60 * 60 * 3) {
    difference = now.diff(datePosted, 'days');
    time = difference + 'd ago';
  }
  // More than 3 days
  else if (difference >= 24 * 60 * 60 * 3) {
    time = datePosted.format('M-D-YYYY');
  }
  return time;
};

export const getTimeInShorthand = (date_time: string) => {
  const datePosted = moment(date_time);
  const now = moment();
  var time = date_time;
  var difference = now.diff(datePosted, 's');

  // Creating elapsedTime string to display to user
  // 0 to less than 1 minute
  if (difference < 60) {
    time = difference + 's';
  }
  // 1 minute to less than 1 hour
  else if (difference >= 60 && difference < 60 * 60) {
    difference = now.diff(datePosted, 'm');
    time = difference + 'm';
  }
  // 1 hour to less than 1 day
  else if (difference >= 60 * 60 && difference < 24 * 60 * 60) {
    difference = now.diff(datePosted, 'h');
    time = difference + 'h';
  }
  // Any number of days
  else if (difference >= 24 * 60 * 60 && difference < 24 * 60 * 60 * 7) {
    difference = now.diff(datePosted, 'd');
    time = difference + 'd';
  }
  // More than 7 days
  else if (difference >= 24 * 60 * 60 * 7) {
    difference = now.diff(datePosted, 'w');
    time = difference + 'w';
  }
  return time;
};

export const getMomentCategoryIconInfo = (category: string) => {
  let icon: ImageSourcePropType, bgColor: string;
  switch (category) {
    case 'Friends':
      icon = images.moment.friends;
      bgColor = MOMENT_CATEGORY_BG_COLORS[0];
      break;
    case 'Adventure':
      icon = images.moment.adventure;
      bgColor = MOMENT_CATEGORY_BG_COLORS[1];
      break;
    case 'Photo Dump':
      icon = images.moment.photoDump;
      bgColor = MOMENT_CATEGORY_BG_COLORS[2];
      break;
    case 'Food':
      icon = images.moment.food;
      bgColor = MOMENT_CATEGORY_BG_COLORS[3];
      break;
    case 'Music':
      icon = images.moment.music;
      bgColor = MOMENT_CATEGORY_BG_COLORS[4];
      break;
    case 'Art':
      icon = images.moment.art;
      bgColor = MOMENT_CATEGORY_BG_COLORS[5];
      break;
    case 'Sports':
      icon = images.moment.sports;
      bgColor = MOMENT_CATEGORY_BG_COLORS[6];
      break;
    case 'Fashion':
      icon = images.moment.fashion;
      bgColor = MOMENT_CATEGORY_BG_COLORS[7];
      break;
    case 'Travel':
      icon = images.moment.travel;
      bgColor = MOMENT_CATEGORY_BG_COLORS[8];
      break;
    case 'Pets':
      icon = images.moment.pets;
      bgColor = MOMENT_CATEGORY_BG_COLORS[9];
      break;
    case 'Fitness':
      icon = images.moment.fitness;
      bgColor = MOMENT_CATEGORY_BG_COLORS[10];
      break;
    case 'DIY':
      icon = images.moment.diy;
      bgColor = MOMENT_CATEGORY_BG_COLORS[11];
      break;
    case 'Nature':
      icon = images.moment.nature;
      bgColor = MOMENT_CATEGORY_BG_COLORS[12];
      break;
    case 'Early Life':
      icon = images.moment.earlyLife;
      bgColor = MOMENT_CATEGORY_BG_COLORS[13];
      break;
    case 'Beauty':
      icon = images.moment.beauty;
      bgColor = MOMENT_CATEGORY_BG_COLORS[14];
      break;
    default:
      // All custom categories
      icon = images.moment.custom;
      // A quick deterministic "random" color picker by summing up ascii char codees
      const charCodeSum = category
        .split('')
        .reduce((acc: number, x: string) => acc + x.charCodeAt(0), 0);
      bgColor = MOMENT_CATEGORY_BG_COLORS[charCodeSum % MOMENT_CATEGORY_BG_COLORS.length];
      break;
  }
  return {
    icon,
    bgColor,
  };
};

export const isUrlAVideo = (url: string) =>
  !(
    url.endsWith('jpg') ||
    url.endsWith('jpeg') ||
    url.endsWith('JPG') ||
    url.endsWith('JPEG') ||
    url.endsWith('PNG') ||
    url.endsWith('png') ||
    url.endsWith('GIF') ||
    url.endsWith('gif')
  );

export const incrementMomentShareCount = (
  momenId: string,
  momentData: MomentPostType[],
  updateOldMomentData: ([]: MomentPostType[]) => void,
) => {
  try {
    increaseMomentShareCount(momenId)
      .then(updatedShareCount => {
        if (updatedShareCount) {
          const updatedMomentData = momentData.map(x =>
            x.moment_id === momenId ? { ...x, share_count: updatedShareCount } : x,
          );
          updateOldMomentData(updatedMomentData);
        } else {
          logger.log('Unable to update share count!');
        }
      })
      .catch(() => logger.log('Error updating share count!'));
  } catch (err) {
    logger.log('Error updating share count: ', err);
  }
};
