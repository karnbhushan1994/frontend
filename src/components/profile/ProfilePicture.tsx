import React, { useContext } from 'react';

import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ProfileContext } from 'screens/profile/ProfileScreen';

interface ProfilePictureProps {
  style: StyleProp<ViewStyle>;
}
const ProfilePicture: React.FC<ProfilePictureProps> = ({ style }) => {
  const { avatar } = useContext(ProfileContext);

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.image} source={{ uri: avatar }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ProfilePicture;
