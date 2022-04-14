import React, { FC } from 'react';

import { Image, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

import { images } from 'assets/images';

import { ButtonWithGradientBackground } from 'components/widgets/buttonWithGradientBackground';
import ProgressLiner from 'components/widgets/progressLiner';
import styles from 'screens/widgets/TaggShop/styles';
import { WidgetType } from 'types';

interface LinkTaggProps extends WidgetType {
  smallImg?: boolean;
  completed?: number;
  quantity?: number;
  onPress?: () => void;
}

export const LinkTagg: FC<LinkTaggProps> = ({
  img,
  title,
  subTitle,
  locked,
  smallImg,
  completed,
  quantity,
  onPress,
  background_color_start,
  background_color_end,
  item_color_start,
  item_color_end,
}) => (
  <TouchableOpacity style={styles.linkTagItem} onPress={() => onPress && onPress()}>
    <LinearGradient
      style={styles.linearGradient}
      colors={[item_color_start, item_color_end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    />
    {background_color_start !== '' && background_color_end !== '' && (
      <Image source={img} style={styles.blurBG} blurRadius={20} />
    )}
    <Image
      source={img}
      style={[styles.image, smallImg && styles.smallImage]}
      resizeMode={'contain'}
    />
    <View style={styles.titleButtonBlock}>
      <View>
        <Text style={styles.titleTop}>{subTitle}</Text>
        <Text style={styles.titleBottom}>{title}</Text>
      </View>
      <ButtonWithGradientBackground
        onPress={() => {}}
        disabled={locked}
        buttonStartIcon={images.findFriends.lock}
      />
    </View>
    {completed && quantity ? (
      <View style={styles.progressBlockWrapper}>
        <View style={styles.progressBlock}>
          <ProgressLiner completed={completed} quantity={quantity} blackMode height={10} />
        </View>
        <Text style={styles.progressInfoText}>
          {completed}
          <Text style={styles.quantity}> / {quantity}</Text>
        </Text>
      </View>
    ) : null}
  </TouchableOpacity>
);
