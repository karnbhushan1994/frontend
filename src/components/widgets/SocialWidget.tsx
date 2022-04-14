import React, { FC, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  ImageProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { images } from 'assets/images';
import { WidgetType } from 'types';
import { normalize, openTaggLink } from 'utils';

import { TAGG_PURPLE } from '../../constants';
import { TaggClickScore } from './TaggClickScore';

interface LinksWidgetParams {
  data: WidgetType;
  title?: string;
  style?: ViewStyle | ViewStyle[];
  disablePress?: boolean;
  disabled?: boolean;
  widgetLogo?: ImageProps;
  taggClickCount?: number;
}
export const makeSocialLink = (data: any) => {
  let link = '';
  switch (data.link_type?.toLowerCase()) {
    case 'instagram':
      link = 'https://www.instagram.com/';
      break;
    case 'facebook':
      link = 'https://www.facebook.com/';
      break;
    case 'twitter':
      link = 'https://twitter.com/';
      break;
    case 'twitch':
      link = '';
      break;
    case 'pinterest':
      link = '';
      break;
    case 'whatsapp':
      link = '';
      break;
    case 'linkedin':
      link = '';
      break;
    case 'snapchat':
      link = 'https://story.snapchat.com/@';
      break;
    case 'youtube':
      link = '';
      break;
    case 'tiktok':
      link = 'https://www.tiktok.com/@';
      break;
    case 'sms':
      link = '';
      break;
    default:
      link = '';
      break;
  }
  return link + data.username;
};

export const makeSocialImage = (type?: string) => {
  switch (type?.toLowerCase()) {
    case 'instagram':
      return images.socials.instagram;
    case 'facebook':
      return images.socials.facebookIcon;
    case 'twitter':
      return images.socials.twitter;
    case 'twitch':
      return images.socials.twitch;
    case 'pinterest':
      return images.socials.pinterest;
    case 'whatsapp':
      return images.socials.whatsapp;
    case 'linkedin':
      return images.socials.linkedin;
    case 'snapchat':
      return images.socials.snapchat;
    case 'Youtube':
      return images.socials.youtube;
    case 'tiktok':
      return images.socials.tiktok;
    case 'sms':
      return images.socials.sms;
    default:
      return images.socials.logo;
  }
};

const SocialWidget: FC<LinksWidgetParams> = ({
  data,
  style,
  disabled,
  title,
  widgetLogo,
  taggClickCount,
}) => {
  const [imageLoad, setImageLoad] = useState(false);

  // const { linkData } = data;

  const Component: any = disabled ? View : TouchableOpacity;

  const icon = makeSocialImage(data.link_type);
  const [startColor, setStartColor] = useState<string>('#FFFFFF');
  const [endColor, setEndColor] = useState<string>('#FFFFFF');
  useEffect(() => {
    if (data.background_color_start && data.background_color_end) {
      setStartColor(data.background_color_start);
      setEndColor(data.background_color_end);
    } else if (data.background_color_start) {
      setStartColor(data.background_color_start);
      setEndColor(data.background_color_start);
    }
  }, [data.background_color_start, data.background_color_end]);

  const fontColor = data?.font_color ? data?.font_color : 'white';
  return (
    <Component style={[styles.container, style]} onPress={() => openTaggLink(makeSocialLink(data))}>
      {data.background_color_start && data.background_color_end && (
        <LinearGradient
          style={styles.linearGradient}
          colors={[startColor, endColor]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
      )}
      {data.background_color_start && !data.background_color_end && (
        <LinearGradient
          style={styles.linearGradient}
          colors={[data.background_color_start, data.background_color_start]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
      )}
      {!data.background_color_start && !data.background_color_end && (
        <Image source={icon} style={styles.blurBG} blurRadius={20} />
      )}
      {data.background_url ? (
        <Image source={{ uri: data.background_url }} style={styles.bgthumbnail} blurRadius={0} />
      ) : null}
      <View style={styles.imageWrapper}>
        {data.thumbnail_url &&
        data.thumbnail_url != 'https://tagg-prod.s3.us-east-2.amazonaws.com/misc/not+found.jpg' ? (
          <>
            <Image source={widgetLogo} style={styles.widgetLogo} />
            <Image
              source={{ uri: data.thumbnail_url }}
              style={styles.image}
              onLoadStart={() => setImageLoad(true)}
              onLoadEnd={() => setImageLoad(false)}
              resizeMode="contain"
            />
          </>
        ) : (
          <Image
            source={icon}
            style={styles.image}
            onLoadStart={() => setImageLoad(true)}
            onLoadEnd={() => setImageLoad(false)}
            resizeMode="contain"
          />
        )}
        <TaggClickScore clickCountScore={taggClickCount} />
      </View>

      {imageLoad && <ActivityIndicator style={styles.loader} color={TAGG_PURPLE} />}
      <Text style={[styles.text, { color: fontColor }]} numberOfLines={2}>
        {title || data?.title || `@${data?.username}`}
      </Text>
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    width: normalize(172),
    height: normalize(172),
    borderRadius: 8,
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 999,
  },
  text: {
    fontSize: 12,
    color: '#fff',
    maxWidth: '64%',
    textAlign: 'center',
    fontWeight: '600',
    zIndex: 1,
    marginTop: 10,
  },
  imageWrapper: {
    width: '64%',
    height: '64%',
    zIndex: 99,
    borderRadius: 8,
    // overflow: 'hidden',
    shadowOffset: {
      width: -4,
      height: 4,
    },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    marginTop: '12%',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: '4%',
    // zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    zIndex: -999,
  },
  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  blurBG: {
    height: '100%',
    width: '600%',
    marginBottom: 24,
    position: 'absolute',
    zIndex: 0,
  },
  bgthumbnail: {
    height: '100%',
    width: '100%',
    marginBottom: 24,
    position: 'absolute',
    zIndex: 0,
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  hide: {
    display: 'none',
  },
  widgetLogo: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 9999,
    width: 24,
    height: 24,
  },
});

export default SocialWidget;
