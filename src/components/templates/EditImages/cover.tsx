import React, { useCallback, useContext, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
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

export const EditCoverImage = ({ style }: { style?: ViewStyle }) => {
  const {
    user: { userId, username },
  } = useSelector((state: RootState) => state.user);
  const { isEdit, setIsEdit } = useContext(ProfileContext);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const goToGalleryLargePic = useCallback(() => {
    ImagePicker.openPicker({
      smartAlbums: ['Favorites', 'RecentlyAdded', 'SelfPortraits', 'Screenshots', 'UserLibrary'],
      width: 580,
      height: 580,
      cropping: true,
      cropperToolbarTitle: 'Select Header',
      mediaType: 'photo',
    }).then(picture => {
      if ('path' in picture) {
        track('LargeProfilePicture', AnalyticVerb.Updated, AnalyticCategory.EditProfile);
        const request = new FormData();
        request.append('largeProfilePicture', {
          uri: picture.path,
          name: 'large_profile_pic.jpg',
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
    <TouchableOpacity style={[styles.container, style]} onPress={goToGalleryLargePic}>
      <Image source={icons.EditImage} style={styles.image} />
      <View style={styles.textWrapper}>
        <Text style={styles.text}>Add a header</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    transform: [{ translateY: -50 }],
  },
  image: { width: 100, height: 100 },
  text: { fontSize: 13, color: '#fff', fontWeight: 'bold' },
  textWrapper: {
    borderWidth: 2,
    borderColor: '#fff',
    width: 117,
    height: 34,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
});
