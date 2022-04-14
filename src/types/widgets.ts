import { ImageProps } from 'react-native';

import { MomentPostType } from './types';

export enum ApplicationLinkWidgetTypes {
  VIDEO_LINK = 'VIDEO_LINK',
  APPLICATION_LINK = 'APPLICATION_LINK',
  GENERIC_LINK = 'GENERIC_LINK',
  SOCIAL = 'SOCIAL_MEDIA',
}

export enum ApplicationLinkWidgetLinkTypes {
  SPOTIFY = 'SPOTIFY',
  SOUNDCLOUD = 'SOUNDCLOUD',
  APPLE_MUSIC = 'APPLE_MUSIC',
  APPLE_PODCAST = 'APPLE_PODCAST',
  POSHMARK = 'POSHMARK',
  DEPOP = 'DEPOP',
  ETSY = 'ETSY',
  SHOPIFY = 'SHOPIFY',
  AMAZON = 'AMAZON',
  AMAZON_AFFILIATE = 'AMAZON_AFFILIATE',
  APP_STORE = 'APP_STORE',
}

export enum GenericLinkWidgetTypes {
  WEBSITE = 'WEBSITE',
  ARTICLE = 'ARTICLE',
}

export enum SocialMediaTypes {
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  SNAPCHAT = 'SNAPCHAT',
  TWITTER = 'TWITTER',
}

export enum VideoLinkWidgetLinkTypes {
  YOUTUBE = 'YOUTUBE',
  TIKTOK = 'TIKTOK',
  TWITCH = 'TWITCH',
  VIMEO = 'VIMEO',
}

type MetaData = {
  description: string;
  images: string[];
  title: string;
  videos?: string[];
};

export type WidgetLinkType =
  | ApplicationLinkWidgetLinkTypes
  | VideoLinkWidgetLinkTypes
  | GenericLinkWidgetTypes
  | SocialMediaTypes;

export type WidgetType = {
  id: string;
  type: ApplicationLinkWidgetTypes;
  img: ImageProps;
  title: string;
  subTitle?: string;
  url?: string;
  thumbnail_url?: string;
  link_type?: WidgetLinkType;
  locked?: boolean;
  linkData?: MetaData;
  page?: string;
  font_color?: string;
  background_color_start?: string;
  background_color_end?: string;
  border_color_start?: string;
  border_color_end?: string;
  moment?: MomentPostType | boolean;
  username?: string;
  item_color_start: string;
  item_color_end: string;
  widgetLogo: ImageProps | null;
};
