import React, { FC, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  ImageProps,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { TaggShopData } from 'constants/widgets';
import { WidgetType } from 'types';
import { normalize, openTaggLink } from 'utils';

import { TAGG_PURPLE } from '../../constants';
import { TaggClickScore } from './TaggClickScore';

type MetaData = {
  description: string;
  images: string[];
  title: string;
  videos?: string[];
};

interface LinksWidgetParams {
  data: WidgetType;
  title?: string;
  style?: ViewStyle | ViewStyle[];
  disablePress?: boolean;
  disabled?: boolean;
  onLongPress?: boolean;
  widgetLogo?: ImageProps;
  taggClickCount?: number;
}

const GenericWidget: FC<LinksWidgetParams> = ({
  data,
  style,
  disabled,
  title,
  onLongPress,
  widgetLogo,
  taggClickCount,
}) => {
  const [imageLoad, setImageLoad] = useState(false);
  const { linkData } = data;
  const Component: any = disabled ? View : TouchableOpacity;

  const image = (
    linkData?.images[0]?.search('base64') !== -1
      ? linkData?.images[0] || ''
      : { uri: linkData?.images[0] || '' }
  ) as ImageSourcePropType;
  const [startColor, setStartColor] = useState<string>('#FFFFFF');
  const [endColor, setEndColor] = useState<string>('#FFFFFF');

  useEffect(() => {
    if (data.border_color_start && data.border_color_end) {
      setStartColor(data.border_color_start);
      setEndColor(data.border_color_end);
    } else if (data.border_color_start) {
      setStartColor(data.border_color_start);
      setEndColor(data.border_color_start);
    }
  }, [data.border_color_start, data.border_color_end]);
  const [fallbackImage, setFallbackImage] = useState(null);
  useEffect(() => {
    let filtered = TaggShopData.filter(tagg => tagg.link_type === data.link_type);
    if (filtered[0]) {
      setFallbackImage(filtered[0].img);
    }
  }, []);

  const fontColor = data?.font_color ? data?.font_color : 'white';

  return (
    <Component
      style={[styles.container, style]}
      onLongPress={onLongPress}
      onPress={() => openTaggLink(data.url)}>
      {!!data && data.border_color_start && (
        <LinearGradient
          style={styles.linearGradient}
          colors={[startColor, endColor]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
      )}
      {/*<SvgXml xml={image} style={styles.blurBG} width="50%" height="50%" blurRadius={20} />*/}
      {!!image && image?.uri !== '' ? (
        <Image source={image} style={styles.blurBG} blurRadius={20} />
      ) : fallbackImage ? (
        <Image source={fallbackImage} style={styles.blurBG} blurRadius={20} />
      ) : null}
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
            />
          </>
        ) : (
          <>
            {!!image && image.uri !== '' && <Image source={widgetLogo} style={styles.widgetLogo} />}
            <Image
              source={!!image && image.uri !== '' ? image : fallbackImage}
              style={styles.image}
              onLoadStart={() => setImageLoad(true)}
              onLoadEnd={() => setImageLoad(false)}
            />
          </>
        )}
        <TaggClickScore clickCountScore={taggClickCount} />
      </View>
      {!!imageLoad && <ActivityIndicator style={styles.loader} color={TAGG_PURPLE} />}
      <Text style={[styles.text, { color: fontColor }]} numberOfLines={2}>
        {title || data.title || linkData?.title}
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

export default GenericWidget;
