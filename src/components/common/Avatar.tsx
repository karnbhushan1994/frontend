import React, { FC } from 'react';

import { Image, ImageStyle, StyleProp, ImageBackground } from 'react-native';

import { images } from 'assets/images';

const { profile_placeholder, avatar_placeholder } = images.main;

/** userIcon prop to show default profile icon
 * in place of cross icon,
 * currently used in MomentPost
 * component inside DiscoverMomentScreen */

type AvatarProps = {
  style: StyleProp<ImageStyle>;
  uri: string | undefined;
  loading?: boolean;
  loadingStyle?: StyleProp<ImageStyle> | undefined;
  userIcon?: boolean;
};

const Avatar: FC<AvatarProps> = ({ style, uri, loading = false, loadingStyle, userIcon = false }) =>
  loading ? (
    <ImageBackground
      style={style}
      defaultSource={images.main.avatar_placeholder}
      source={{ uri, cache: 'reload' }}>
      {loading && (
        <Image source={require('../../assets/gifs/loading-animation.gif')} style={loadingStyle} />
      )}
    </ImageBackground>
  ) : (
    <Image
      defaultSource={userIcon ? profile_placeholder : avatar_placeholder}
      source={{ uri, cache: 'reload' }}
      style={style}
    />
  );

export default Avatar;
