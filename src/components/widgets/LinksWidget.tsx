import React, { FC, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { bgTypes } from 'screens/widgets/AddTagg';
import { ApplicationLinkWidgetLinkTypes, ApplicationLinkWidgetTypes, WidgetType } from 'types';
import { normalize, openTaggLink } from 'utils';

import { WHITE } from '../../constants';
import { makeSocialImage } from './SocialWidget';
import { TaggClickScore } from './TaggClickScore';

interface LinksWidgetParams {
  data: WidgetType;
  title?: string;
  backupImage?: ImageSourcePropType;
  fallbackImage?: ImageSourcePropType;
  style?: ViewStyle | ViewStyle[];
  disablePress?: boolean;
  disabled?: boolean;
  bgImage?: any;
  thumbnailIcon?: boolean;
  fontColor?: string;
  isImageLoading?: boolean;
  widgetLogo?: ImageSourcePropType;
  taggClickCount?: number;
  background_url?: string;
}

const LinksWidget: FC<LinksWidgetParams> = ({
  data,
  style,
  disabled,
  title,
  fallbackImage,
  bgImage,
  thumbnailIcon,
  fontColor,
  isImageLoading,
  widgetLogo,
  taggClickCount,
  background_url,
}) => {
  const [imageLoad, setImageLoad] = useState(isImageLoading);
  const [activeBgType, setActiveBgType] = useState<string>();

  const { linkData } = data;
  const font_color = fontColor ? fontColor : data?.font_color;

  const index = data.link_type === ApplicationLinkWidgetLinkTypes.AMAZON && linkData ? 5 : 0;

  const Component: any = disabled ? View : TouchableOpacity;
  const image = (
    linkData?.images[index || 0]?.match('base64')
      ? { uri: linkData?.images[1] || '' }
      : linkData?.images[index || 0]?.match(/^data:image/)
      ? { uri: linkData?.images[1] || '' }
      : { uri: linkData?.images[index || 0] || '' }
  ) as ImageSourcePropType;
  const icon = makeSocialImage(data.link_type);
  const [startColor, setStartColor] = useState<string>('#FFFFFF');
  const [endColor, setEndColor] = useState<string>('#FFFFFF');

  useEffect(() => setImageLoad(isImageLoading), [isImageLoading]);
  useEffect(() => {
    if (data.background_color_start && data.background_color_end) {
      setStartColor(data.background_color_start);
      setEndColor(data.background_color_end);
      setActiveBgType(bgTypes.GRADIENT);
    } else if (data.background_color_start) {
      setStartColor(data.background_color_start);
      setEndColor(data.background_color_start);
      setActiveBgType(bgTypes.SOLID);
    } else {
      if (background_url) {
        setActiveBgType(bgTypes.IMAGE);
      } else {
        setActiveBgType(bgTypes.NONE);
      }
    }
  }, [data.background_color_start, data.background_color_end, background_url]);
  const getTitle = () => {
    if (title !== undefined && title !== '') {
      let t = title;
      if (
        t.length > 1 &&
        !t.startsWith('http://') &&
        !t.startsWith('https://') &&
        !t.startsWith('www.')
      ) {
        return t;
      } else {
        return data?.title;
      }
    } else {
      return data?.title;
    }
  };
  return (
    <>
      <Component style={[styles.container, style]} onPress={() => openTaggLink(data.url)}>
        {activeBgType === bgTypes.GRADIENT && (
          <LinearGradient
            style={styles.linearGradient}
            colors={[startColor, endColor]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
          />
        )}
        {activeBgType === bgTypes.SOLID && (
          <LinearGradient
            style={styles.linearGradient}
            colors={[startColor, endColor]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
          />
        )}
        {activeBgType === bgTypes.NONE && (
          <Image source={{ uri: bgImage }} style={styles.blurBG} blurRadius={-100} />
        )}
        {data.type !== ApplicationLinkWidgetTypes.SOCIAL &&
          (activeBgType === bgTypes.NONE || activeBgType === bgTypes.IMAGE) &&
          (background_url || bgImage ? (
            <Image
              source={{ uri: bgImage ? bgImage : background_url }}
              style={styles.blurBG}
              blurRadius={-100}
            />
          ) : (
            <Image
              source={image?.uri !== '' ? image : fallbackImage}
              style={styles.blurBG}
              blurRadius={20}
            />
          ))}
        {data.type === ApplicationLinkWidgetTypes.SOCIAL &&
          (activeBgType === bgTypes.NONE || activeBgType === bgTypes.IMAGE) &&
          (background_url || bgImage ? (
            <Image
              source={{ uri: bgImage ? bgImage : background_url }}
              style={styles.blurBG}
              blurRadius={-100}
            />
          ) : (
            <Image source={icon} style={styles.blurBG} blurRadius={20} />
          ))}
        <View style={styles.imageWrapper}>
          {data.type !== ApplicationLinkWidgetTypes.SOCIAL ? (
            thumbnailIcon ? (
              <>
                <Image source={{ uri: fallbackImage }} style={styles.image} resizeMode={'cover'} />
              </>
            ) : data.thumbnail_url &&
              data.thumbnail_url !=
                'https://tagg-prod.s3.us-east-2.amazonaws.com/misc/not+found.jpg' ? (
              <View>
                <Image source={widgetLogo} style={styles.widgetLogo} />
                <Image
                  source={{ uri: data.thumbnail_url }}
                  style={styles.image}
                  resizeMode={'cover'}
                />
              </View>
            ) : image.uri === '' ? (
              <>
                <Image source={fallbackImage} style={styles.image} resizeMode={'cover'} />
              </>
            ) : (
              <View>
                <Image source={widgetLogo} style={styles.widgetLogo} />
                <Image
                  source={image}
                  style={styles.image}
                  onLoadStart={() => setImageLoad(true)}
                  onLoadEnd={() => setImageLoad(false)}
                />
              </View>
            )
          ) : thumbnailIcon ? (
            <>
              <Image source={widgetLogo} style={styles.widgetLogo} />
              <Image source={{ uri: fallbackImage }} style={styles.image} resizeMode={'cover'} />
            </>
          ) : data.thumbnail_url &&
            data.thumbnail_url !=
              'https://tagg-prod.s3.us-east-2.amazonaws.com/misc/not+found.jpg' ? (
            <>
              <Image source={widgetLogo} style={styles.widgetLogo} />
              <Image
                source={{ uri: data.thumbnail_url }}
                style={styles.image}
                resizeMode={'cover'}
              />
            </>
          ) : (
            <View>
              {image?.uri !== '' && <Image source={widgetLogo} style={styles.widgetLogo} />}
              <Image
                source={image?.uri !== '' ? image : fallbackImage}
                style={styles.image}
                onLoadStart={() => setImageLoad(true)}
                onLoadEnd={() => setImageLoad(false)}
              />
            </View>
          )}
          <TaggClickScore clickCountScore={taggClickCount} />
        </View>
        {imageLoad && <ActivityIndicator style={styles.loader} color={WHITE} size="large" />}
        <Text style={[styles.text, { color: font_color }]} numberOfLines={2}>
          {getTitle()}
        </Text>
      </Component>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: normalize(172),
    height: normalize(172),
    borderRadius: 8,
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 100,
  },
  text: {
    fontSize: 12,
    color: '#fff',
    maxWidth: '64%',
    textAlign: 'center',
    fontWeight: '600',
    zIndex: 1,
  },
  logo: {
    width: normalize(172),
    height: normalize(172),
  },
  imageWrapper: {
    width: '64%',
    height: '64%',
    shadowOffset: {
      width: -4,
      height: 4,
    },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    marginTop: '12%',
    marginBottom: '4%',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
    width: '100%',
    marginBottom: 24,
    position: 'absolute',
    zIndex: 0,
  },
  blurSocialIconBG: {
    height: '100%',
    width: '130%',
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

export default LinksWidget;
