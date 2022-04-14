import React, { useCallback, useContext, useState } from 'react';

import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ViewStyle,
  Alert,
  ActivityIndicator,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';

import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { ProfileContext } from 'screens/profile/ProfileScreen';
import { patchEditProfile } from 'services';
import { loadUserData, resetHeaderAndProfileImage } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb } from 'types';
import { track } from 'utils';

export const EditAvatarImage = ({ style }: { style?: ViewStyle }) => {
  const {
    user: { userId, username },
  } = useSelector((state: RootState) => state.user);
  const { isEdit, setIsEdit } = useContext(ProfileContext);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const goToGallerySmallPic = useCallback(() => {
    ImagePicker.openPicker({
      smartAlbums: ['Favorites', 'RecentlyAdded', 'SelfPortraits', 'Screenshots', 'UserLibrary'],
      width: 580,
      height: 580,
      cropping: true,
      cropperToolbarTitle: 'Select Header',
      mediaType: 'photo',
    }).then(picture => {
      if ('path' in picture) {
        track('SmallProfilePicture', AnalyticVerb.Updated, AnalyticCategory.EditProfile);
        const request = new FormData();

        request.append('smallProfilePicture', {
          uri: picture.path,
          name: 'small_profile_pic.jpg',
          type: 'image/jpg',
        });
        setIsEdit(false);
        setLoader(true);
        patchEditProfile(request, userId)
          .then(() => {
            dispatch(resetHeaderAndProfileImage());
            dispatch(loadUserData({ userId, username }));
          })
          .catch(error => {
            Alert.alert(error);
          })
          .finally(() => {
            setLoader(false);
          });
      }
    });
  }, []);
  if (loader) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isEdit) {
    return null;
  }
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={goToGallerySmallPic}>
      <Image source={icons.EditImage} style={styles.image} />
      <Text style={styles.text}>Add a</Text>
      <Text style={styles.text}>Profile Pic</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: [{ translateY: -50 }, { translateX: -50 }],
    width: 100,
    height: 100,
  },
  image: { width: 60, height: 60 },
  text: { fontSize: 13, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
