import { SP_HEIGHT, SP_WIDTH } from '../../constants';

import React, { useEffect, useState } from 'react';

import { RouteProp, useNavigation } from '@react-navigation/native';
import { Alert, Image, ImageBackground, StatusBar, StyleSheet } from 'react-native';
import { Text } from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { TaggSquareButton } from 'components';
import TaggLoadingIndicator from 'components/common/TaggLoadingIndicator';
import { ERROR_UPLOAD, ERROR_UPLOAD_SP_PHOTO, SUCCESS_PIC_UPLOAD } from '../../constants/strings';
import { MainStackParams } from 'routes';
import { getSuggestedPeopleProfile, sendSuggestedPeoplePhoto } from 'services';
import { uploadedSuggestedPeoplePhoto } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';
import {images} from "assets/images";

type SuggestedPeopleUploadPictureScreenRouteProp = RouteProp<MainStackParams, 'UpdateSPPicture'>;

type SuggestedPeopleUploadPictureScreenProps = {
  route: SuggestedPeopleUploadPictureScreenRouteProp;
};

const SuggestedPeopleUploadPictureScreen: React.FC<SuggestedPeopleUploadPictureScreenProps> = ({
  route,
}) => {
  const { editing } = route.params;
  const [image, setImage] = useState<string | undefined>(undefined);
  const [oldImage, setOldImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    user: { userId: loggedInUserId },
  } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const loadData = async () => {
      const response = await getSuggestedPeopleProfile(loggedInUserId);
      if (response) {
        setImage(response.suggested_people_url);
        setOldImage(response.suggested_people_url);
      }
    };
    // if we're in edit SP, attempt to load current sp image
    if (editing) {
      loadData();
    }
  }, []);

  const openImagePicker = () => {
    ImagePicker.openPicker({
      smartAlbums: ['Favorites', 'RecentlyAdded', 'SelfPortraits', 'Screenshots', 'UserLibrary'],
      width: SP_WIDTH,
      height: SP_HEIGHT,
      cropping: true,
      cropperToolbarTitle: 'Select Photo',
      mediaType: 'photo',
    })
      .then(picture => {
        if ('path' in picture) {
          setImage(picture.path);
        }
      })
      .catch(_ => {});
  };

  const uploadImage = async () => {
    // Uploading image only if initially loaded image is not the same as the image being uploaded
    if (image && oldImage !== image) {
      setLoading(true);
      const success = await sendSuggestedPeoplePhoto(image);
      if (success) {
        dispatch(uploadedSuggestedPeoplePhoto(image));
        if (!editing) {
          navigation.navigate('BadgeSelection', { editing: false });
        }
      } else {
        Alert.alert(ERROR_UPLOAD);
      }
      setLoading(false);
      // Navigated back to Profile if user is editing their Suggested People Picture
      if (editing) {
        navigation.goBack();
        setTimeout(() => {
          Alert.alert(success ? SUCCESS_PIC_UPLOAD : ERROR_UPLOAD_SP_PHOTO);
        }, 500);
      }
    }
  };

  return (
    <>
      {loading && <TaggLoadingIndicator fullscreen />}
      <StatusBar barStyle={'light-content'} />
      <SafeAreaView style={styles.container}>
        <Text style={editing ? styles.titleEditSuggested : styles.titlePHOTO}>
          {editing ? 'Edit Suggested' : 'PHOTO'}
        </Text>
        {image ? (
          <Text style={styles.body}>
            {editing ? 'Tap to upload new photo' : 'Tap again to choose another photo'}
          </Text>
        ) : (
          <Text style={styles.body}>Upload a photo, this is what other users will see</Text>
        )}
        {image ? (
          <TouchableOpacity onPress={openImagePicker}>
            <ImageBackground
              source={{ uri: image, cache: 'reload' }}
              style={[styles.imageContainer, styles.overlay]}
              borderRadius={30}>
              <Image
                style={styles.overlay}
                source={images.main.suggested_people_preview_silhouette}
              />
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={openImagePicker}>
            <ImageBackground
              source={images.main.suggested_people_preview_silhouette}
              style={[styles.imageContainer, styles.overlay]}>
              <Image style={styles.images} source={images.main.images} />
              <Text style={styles.body}>Upload Photo</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
        {image && (
          <TaggSquareButton
            onPress={uploadImage}
            title={'Done'}
            buttonStyle={'normal'}
            buttonColor={editing ? 'blue' : 'purple'}
            labelColor={'white'}
            style={styles.buttonStyle}
            labelStyle={styles.buttonLabel}
          />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#878787',
    alignItems: 'center',
  },
  titlePHOTO: {
    marginTop: '5%',
    fontSize: normalize(25),
    lineHeight: normalize(30),
    fontWeight: '600',
    color: 'white',
  },
  titleEditSuggested: {
    marginTop: '5%',
    fontSize: normalize(19),
    lineHeight: normalize(22.7),
    letterSpacing: normalize(0.1),
    fontWeight: '600',
    color: 'white',
  },
  body: {
    fontSize: normalize(15),
    lineHeight: normalize(18),
    textAlign: 'center',
    fontWeight: '600',
    color: 'white',
    marginTop: '2%',
    width: SCREEN_WIDTH * 0.7,
  },
  buttonLabel: {
    fontWeight: '600',
    fontSize: normalize(15),
  },
  buttonStyle: {
    width: '40%',
  },
  imageContainer: {
    marginTop: '10%',
    backgroundColor: 'black',
    borderRadius: 30,
    alignItems: 'center',
  },
  overlay: {
    height: SCREEN_HEIGHT * 0.6,
    aspectRatio: SP_WIDTH / SP_HEIGHT,
  },
  images: {
    width: normalize(100),
    height: normalize(100),
    marginTop: '30%',
    marginBottom: '10%',
  },
  rightButtonContainer: { marginRight: 24 },
  rightButton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 18,
  },
  editBadgesMainContainer: {
    height: 30,
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.6,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4%',
    marginTop: '0.8%',
  },
  editBadgesSubContainer: { flexDirection: 'row', alignItems: 'center' },
  editBadgesText: {
    color: 'white',
    fontWeight: '600',
    fontSize: normalize(14),
    lineHeight: normalize(16.71),
    textAlign: 'left',
    marginLeft: 18,
  },
  rightArrow: {
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
});
export default SuggestedPeopleUploadPictureScreen;
