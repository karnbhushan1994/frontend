import { ReactText } from 'react';

import { images } from 'assets/images';

import { Images } from '../assets/index';
import { isIPhoneX, normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils';
import {
  BackgroundGradientType,
  BACKGROUND_GRADIENT_STYLE_TYPE,
  SkinListType,
  TemplateEnumType,
} from './../types/';

export const HOMEPAGE = '__TaggUserHomePage__';

export const CHIN_HEIGHT = 34;

export const SKIP_TIME = 15.0;

export const PROFILE_CUTOUT_TOP_Y = SCREEN_HEIGHT * 0.435;
export const PROFILE_CUTOUT_BOTTOM_Y = isIPhoneX() ? SCREEN_HEIGHT * 0.55 : SCREEN_HEIGHT * 0.58;
export const PROFILE_CUTOUT_CORNER_X = SCREEN_WIDTH * 0.344;
export const PROFILE_CUTOUT_CORNER_Y = SCREEN_HEIGHT * 0.513;

export const IMAGE_WIDTH = SCREEN_WIDTH;
export const IMAGE_HEIGHT = SCREEN_WIDTH;
export const COVER_HEIGHT = SCREEN_HEIGHT * 0.55;

export const AVATAR_DIM = 44;
export const AVATAR_GRADIENT_DIM = 50;

export const TAGG_ICON_DIM = 58;
export const TAGG_RING_DIM = normalize(60);

// default height of the navigation bar, from react native library, unless on ipad
export const NAV_BAR_HEIGHT = 49;
export const BADGE_LIMIT = 5;

export const INTEGRATED_SOCIAL_LIST: string[] = ['Instagram', 'Facebook', 'Twitter'];

export const SOCIAL_LIST: string[] = [
  'Instagram',
  'Facebook',
  'Twitter',
  'Snapchat',
  'TikTok',
  // TODO: we don't have endpoints to support these yet...
  // 'Twitch',
  // 'Pinterest',
  // 'Whatsapp',
  // 'Linkedin',
  // 'Youtube',
];

export const SOCIAL_ICON_SIZE_ADJUSTMENT: { [social: string]: number } = {
  Instagram: 25,
  Facebook: 20,
  Twitter: 23,
  Snapchat: 25,
  TikTok: 20,
};

export const INSTAGRAM_FONT_COLOR: string = '#FF97DE';
export const FACEBOOK_FONT_COLOR: string = '#6697FD';
export const TWITTER_FONT_COLOR: string = '#74C9FD';
export const TIKTOK_FONT_COLOR: string = '#78B5FD';
export const TWITCH_FONT_COLOR: string = '#CB93FF';
export const PINTEREST_FONT_COLOR: string = '#FF7584';
export const WHATSAPP_FONT_COLOR: string = '#4AC959';
export const LINKEDIN_FONT_COLOR: string = '#78B5FD';
export const SNAPCHAT_FONT_COLOR: string = '#FFFC00';
export const YOUTUBE_FONT_COLOR: string = '#FCA4A4';

export const TAGG_PURPLE = '#8F01FF';
export const TAGG_DARK_BLUE = '#4E699C';
export const TAGG_DARK_PURPLEISH_BLUE = '#4755A1';
export const TAGG_LIGHT_BLUE: string = '#698DD3';
export const TAGG_LIGHT_BLUE_2: string = '#6EE7E7';
export const TAGG_LIGHT_BLUE_3 = '#DDE8FE';
export const TAGG_LIGHT_PURPLE = '#F4DDFF';
export const TAGG_LIGHT_GREY: string = '#C4C4C4';
export const RADIO_BUTTON_GREY: string = '#BEBEBE';
export const TAGG_LIGHT_GREY_2: string = '#767676';
export const PLACEHOLDER_COLOR: string = '#CDBFFB';
export const WHITE: string = '#fff';
export const LIGHT_ORANGE: string = '#FF8989';
export const LIGHT_BLUE: string = '#CBD5FF';
export const DARK_PURPLE: string = '#7D81F2';
export const LIGHT_GREEN: string = '#6FDFE8';
export const LIGHT_PURPLE_WHITE: string = '#DADADA';
export const LIGTH_GREEN: string = '#3EA3A3';
export const LIGHT_WHITE: string = '#F2F2F2';
export const TAGG_LIGHT_GREY_3: string = '#E8E8E8';
export const TAGG_BG_TRANSPARENT_BLACK: string = 'rgba(0, 0, 0, 0.2)';

export const TAGG_ERROR_RED: string = '#EA574C';
export const TAGG_SUCCESS_GREEN: string = '#3EC23B';

// Toast colors
export const RED_TOAST: string = '#EA574C';
export const GREEN_TOAST: string = '#3EC23B';

export const TAGGS_GRADIENT = {
  start: '#9F00FF',
  end: '#27EAE9',
};

export const AVATAR_GRADIENT = {
  start: '#240041',
  end: '#215151',
};

export const NOTIFICATION_GRADIENT = ['rgba(247, 248, 248, 1)', 'rgba(247, 248, 248, 0)'];
export const BADGE_GRADIENT_FIRST = ['rgba(86, 63, 51, 1)', 'rgba(236, 32, 39, 1)'];
export const BADGE_GRADIENT_REST = ['rgba(78, 54, 41, 1)', 'rgba(236, 32, 39, 1)'];
export const NOTIFICATION_ICON_GRADIENT = ['#8F01FF', '#7B02DA'];

export const SOCIAL_FONT_COLORS = {
  INSTAGRAM: INSTAGRAM_FONT_COLOR,
  FACEBOOK: FACEBOOK_FONT_COLOR,
  TWITTER: TWITTER_FONT_COLOR,
  TIKTOK: TIKTOK_FONT_COLOR,
  TWITCH: TWITCH_FONT_COLOR,
  PINTEREST: PINTEREST_FONT_COLOR,
  WHATSAPP: WHATSAPP_FONT_COLOR,
  LINKEDIN: LINKEDIN_FONT_COLOR,
  SNAPCHAT: SNAPCHAT_FONT_COLOR,
  YOUTUBE: YOUTUBE_FONT_COLOR,
};

export const TOGGLE_BUTTON_TYPE = {
  FRIEND_UNFRIEND: 'Friend',
  BLOCK_UNBLOCK: 'Block',
};

// Profile Moments
export const defaultMoments: Array<string> = ['Early Life', 'Campus', 'Creativity', 'Activity'];

export const TAGG_CUSTOMER_SUPPORT: string = 'support@tagg.id';
export const BROWSABLE_SOCIAL_URLS: Record<string, string> = {
  Instagram: 'https://instagram.com/',
  Twitter: 'https://twitter.com/',
};

export const DISCORD_INVITE_LINK: string = 'https://discord.gg/ht3h6CNKUr';
export const COMMUNITY_INVITE_LINK: string = 'https://my.community.com/tagg';

export const MOMENT_CATEGORIES: string[] = [
  'Friends',
  'Adventure',
  'Photo Dump',
  'Food',
  'Music',
  'Art',
  'Sports',
  'Fashion',
  'Travel',
  'Pets',
  'Fitness',
  'DIY',
  'Nature',
  'Early Life',
  'Beauty',
];

export const BACKGROUND_GRADIENT_MAP: Record<BackgroundGradientType, Array<ReactText>> = {
  [BackgroundGradientType.Light]: ['#9F00FF', '#27EAE9'],
  [BackgroundGradientType.Dark]: ['#421566', '#385D5E'],
  [BackgroundGradientType.Notification]: ['rgba(143, 1, 255, 0.4)', 'rgba(110, 231, 231, 0.4)'],
};

export const BUTTON_GRADIENT_STYLE: BACKGROUND_GRADIENT_STYLE_TYPE = {
  start: { x: 0, y: 0 },
  end: { x: 0.9, y: 0 },
};
export const BACKGROUND_GRADIENT_STYLE: BACKGROUND_GRADIENT_STYLE_TYPE = {
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0.9 },
};

export const BAR_STYLE: string = 'light-content';

export const CLASS_YEAR_LIST: Array<string> = [
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
];

export const TAGG_WEBSITE = 'https://www.tagg.id/';
export const MOMENT_CATEGORY_BG_COLORS: string[] = [
  '#5E4AE4',
  '#5044A6',
  '#4755A1',
  '#444BA8',
  '#374898',
  '#3F5C97',
  '#3A649F',
  '#386A95',
  '#366D84',
  '#335E76',
  '#2E5471',
  '#274765',
  '#225363',
  '#365F6A',
  '#4E7175',
];

export const SP_WIDTH = 375;
export const SP_HEIGHT = 812;

export const SETTINGS_OPTIONS = {
  JoinDiscord: 'Join our Community',
  ViewInsights: 'View your Insights',
  CommunityGuidelines: 'Community Guidelines',
  PrivacyPolicy: 'Privacy Policy',
  BlockedProfiles: 'Blocked Profiles',
};

export const SETTINGS_DATA = {
  SettingsAndPrivacy: [
    {
      title: 'Community',
      data: [
        {
          title: SETTINGS_OPTIONS.JoinDiscord,
          postimage: images.settings.whiteArrow,
          preimage: images.settings.communitysetting,
        },
      ],
    },
    {
      title: 'Analytics',
      data: [
        {
          title: SETTINGS_OPTIONS.ViewInsights,
          enabledpreimage: images.settings.insight_graph,
          postimage: images.settings.whiteArrow,
          preimage: images.settings.lockWhite,
        },
      ],
    },
    {
      title: 'General',
      data: [
        {
          title: SETTINGS_OPTIONS.CommunityGuidelines,
          preimage: images.settings.termsOfUse,
          postimage: images.settings.whiteArrow,
        },
        {
          title: SETTINGS_OPTIONS.PrivacyPolicy,
          preimage: images.settings.privacyPolicy,
          postimage: images.settings.whiteArrow,
        },
        {
          title: SETTINGS_OPTIONS.BlockedProfiles,
          preimage: images.settings.blockedProfile,
          postimage: images.settings.whiteArrow,
        },
      ],
    },
  ],
};

export const MAX_VIDEO_RECORDING_DURATION: number = 60;
export const KEYBOARD_VERTICLEHEIGHT: number = 0.2;
export const WAITING_LIST_GRADIENT: string[] = ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)'];

export const PHONE_NUMBER_LENGTH: number = 10;
export const INTERESTS: string[] = [
  'Art',
  'College',
  'Sport',
  'Fitness',
  'Outdoor',
  'Nature',
  'Travel',
  'Blogger',
  'Gaming',
  'Engineer',
  'Food',
  'Finance',
  'Design',
  'Health',
  'Journalism',
  'Legal',
  'Film',
  'Photography',
  'Reading',
  'Music',
  'Cooking',
  'Dance',
  'Writing',
  'Yoga',
  'Astronomy',
  'Fishing',
  'Politics',
  'Tech',
  'Podcast',
  'Marketing',
  'Fashion',
  'Beauty',
  'Entrepreneur',
  'DIY',
  'Jewelry',
];

export const INTEREST_MAX_LENGTH = 5;
export const INTEREST_MIN_LENGTH = 3;
export const INTEREST_START_INDEX = 0;
export const INTEREST_END_INDEX = 11;
export const ICON_SIZE = 40;

export const PHONE_VERIFICATION_DIGITS = 4;

export const SKINS_LIST: SkinListType[] = [
  {
    name: TemplateEnumType.One,
    displayName: 'Badass',
    demoPicture: Images.Skins.One,
    primaryColor: '#F5BCCA',
    secondaryColor: '#892101',
  },
  {
    name: TemplateEnumType.Two,
    displayName: 'Genesis',
    demoPicture: Images.Skins.Two,
    primaryColor: 'white',
    secondaryColor: '#698DD3',
  },
  {
    name: TemplateEnumType.Three,
    displayName: 'Cinema',
    demoPicture: Images.Skins.Three,
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
  },
  {
    name: TemplateEnumType.Four,
    displayName: 'Cosmos',
    demoPicture: Images.Skins.Four,
    primaryColor: '#698DD3',
    secondaryColor: '#FFFFFF',
  },
  {
    name: TemplateEnumType.Five,
    displayName: 'Superstar',
    demoPicture: Images.Skins.Five,
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
  },
];

export const PAGE_TYPES = [
  {
    title: 'Friends',
    icon: require('../assets/icons/createPage/Friends.png'),
    color: '#513FB1',
  },
  {
    title: 'Adventure',
    icon: require('../assets/icons/createPage/Adventure.png'),
    color: '#4C4099',
  },
  {
    title: 'Photo Dump',
    icon: require('../assets/icons/createPage/Dump.png'),
    color: '#454E95',
  },
  {
    title: 'Food',
    icon: require('../assets/icons/createPage/Food.png'),
    color: '#43469A',
  },
  {
    title: 'Music',
    icon: require('../assets/icons/createPage/Music.png'),
    color: '#38458D',
  },
  {
    title: 'Art',
    icon: require('../assets/icons/createPage/Art.png'),
    color: '#3F558C',
  },
  {
    title: 'Sports',
    icon: require('../assets/icons/createPage/Sports.png'),
    color: '#3A5C93',
  },
  {
    title: 'Fashion',
    icon: require('../assets/icons/createPage/Fashion.png'),
    color: '#39628A',
  },
  {
    title: 'Travel',
    icon: require('../assets/icons/createPage/Travel.png'),
    color: '#36647D',
  },
  {
    title: 'Pets',
    icon: require('../assets/icons/createPage/Pets.png'),
    color: '#345972',
  },
  {
    title: 'Fitness',
    icon: require('../assets/icons/createPage/Fitness.png'),
    color: '#31526D',
  },
  {
    title: 'DIY',
    icon: require('../assets/icons/createPage/DIY.png'),
    color: '#2B4864',
  },
  {
    title: 'Nature',
    icon: require('../assets/icons/createPage/Nature.png'),
    color: '#265363',
  },
  {
    title: 'Early Life',
    icon: require('../assets/icons/createPage/EarlyLife.png'),
    color: '#365D68',
  },
  {
    title: 'Beauty',
    icon: require('../assets/icons/createPage/Beauty.png'),
    color: '#395260',
  },
];
// Color Picker Constants
export const HUE_COLORS: string[] = [
  '#FF0000',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#FF00FF',
  '#FF0000',
];
export const SUGGESTED_COLORS: string[] = [
  '#FFFFFF',
  '#000000',
  '#0099F6',
  '#4EC438',
  '#FFCA3F',
  '#FF8700',
  '#FF3351',
  '#9E00FF',
];
export const HUE_SELECTOR_WIDTH: number = SCREEN_WIDTH * 0.87;
export const HUE_SELECTOR_HEIGHT: number = normalize(16);
export const HUE_SELECTOR_SLIDER_SIZE: number = normalize(16);

export const SATURATION_PICKER_WIDTH: number = SCREEN_WIDTH * 0.87;
export const SATURATION_PICKER_HEIGHT: number = SCREEN_WIDTH * 0.45;
export const SATURATION_SELECTOR_SLIDER_SIZE: number = 30;

export const SKIN_THEMES: any[] = [
  {
    name: 'Paradise',
    primaryColor: '#F5BEDB',
    secondaryColor: '#1D986A',
  },
  {
    name: 'Success',
    primaryColor: '#EF673F',
    secondaryColor: '#15304B',
  },
  {
    name: 'Neon',
    primaryColor: '#FF00F9',
    secondaryColor: '#000000',
  },
  {
    name: 'Marigold',
    primaryColor: '#F1C001',
    secondaryColor: '#322A59',
  },
  {
    name: 'Pastel',
    primaryColor: '#FFC4C6',
    secondaryColor: '#88A9A3',
  },
  {
    name: 'Blue Sand',
    primaryColor: '#D4C198',
    secondaryColor: '#4E69A3',
  },
];

export const TaggAlertTextList = {
  BLOCK_USER: {
    title: 'Are you sure you want to block this profile?',
    subheading: 'You will no longer be able to view their content.',
    acceptButtonText: 'Block',
  },
  UNBLOCK_USER: {
    title: 'Are you sure you want to unblock this profile?',
    subheading: 'You will be able to view their content.',
    acceptButtonText: 'Unblock',
  },
  DELETE_PAGE: {
    title: 'Are you sure you want to delete this page?',
    subheading: 'All moments will be deleted along with this page.',
    acceptButtonText: 'Yes',
  },
  DELETE_MOMENT: {
    title: 'Delete this moment?',
    subheading: 'Are you sure you want to delete this moment?',
    acceptButtonText: 'Delete',
  },
};

export enum TaggToastTextList {
  PROFILE_BLOCKED = 'Profile Blocked- you can unblock user',
  PROFILE_UNBLOCLKED = 'Profile Unblocked- you can block user',
  COMMENT_UNAVAILABLE = 'Comment no longer available',
  LINK_COPIED = 'Link copied to clipboard',
  PROFILE_LINK_COPIED = 'Profile link copied to clipboard',
}

export enum AsyncAnalyticsStatusTextList {
  PROFILE_LINK_COPIED = 'PROFILE_LINK_COPIED',
  ANALYTICS_ENABLED = 'ANALYTICS_ENABLED',
}

// common string
export const BE_THE_FIRST_TO_COMMENT = 'Be the first to comment!';
