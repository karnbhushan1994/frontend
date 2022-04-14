import { PixelRatio, Platform, StatusBar } from 'react-native';
import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SCREEN_RATIO = SCREEN_HEIGHT / SCREEN_WIDTH;

/**
 * Working as of Q1 2021, latest iPhone is 12
 * iPhone 8/SE has a logical screen ratio of about 1.77
 * Rest has a logical screen ratio of about 2.16
 */
export const isIPhoneX = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS ? SCREEN_RATIO > 2 : false;

// Taken from: https://github.com/react-navigation/react-navigation/issues/283
export const HeaderHeight = Platform.select({
  ios: 44,
  android: 56,
  default: 64,
});

export const StatusBarHeight = Platform.select({
  ios: isIPhoneX() ? 44 : 20,
  android: StatusBar.currentHeight,
  default: 0,
});

export const MediaContentDisplayRatio = isIPhoneX() ? 9 / 17.5 : 9 / 16; // a moldy constant

export const AvatarHeaderHeight = (HeaderHeight + StatusBarHeight) * 1.3;

/**
 * This is a function for normalizing the font size for different devices, based on iphone 8.
 *
 * E.g. font size 13 on an iphone 8 is 13, but on an iPhone 11 is
 * 14.5
 */
export const normalize = (fontSize: number) => {
  // based on iphone 8 logical screen width
  const scale = SCREEN_WIDTH / 375;
  let newSize = fontSize * scale;
  // round to the nearest 0.5
  newSize = Math.round(PixelRatio.roundToNearestPixel(newSize) * 2) / 2;
  return newSize;
};
