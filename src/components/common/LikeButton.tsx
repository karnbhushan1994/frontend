import React from 'react';

import { Image, ImageStyle, StyleSheet, TouchableOpacity } from 'react-native';

import { images } from 'assets/images';
import { normalize } from 'utils';

interface LikeButtonProps {
  onPress: () => void;
  style: ImageStyle;
  liked: boolean;
  setLiked: (liked: boolean) => void;
}
const LikeButton: React.FC<LikeButtonProps> = ({ onPress, style, liked, setLiked }) => {
  const uri = liked ? images.main.heart_filled : images.main.heart_outlined;
  return (
    <TouchableOpacity
      onPress={() => {
        setLiked(!liked);
        onPress();
      }}>
      <Image style={[styles.image, style]} source={uri} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: normalize(18),
    height: normalize(15),
  },
});

export default LikeButton;
