import { COINS_EARNED } from 'constants';

import React, { FC, useCallback, useContext } from 'react';

import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { human, systemWeights } from 'react-native-typography';
import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { images } from 'assets/images';
import GradientText from 'components/GradientText';
import { EditAvatarImage } from 'components/templates/EditImages/avatar';
import { ProfileContext } from 'screens/profile/ProfileScreen';
import { patchEditProfile } from 'services';
import { loadUserData, resetHeaderAndProfileImage } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, ScreenType } from 'types';
import { gradientColorFormation, normalize, track, validateImageLink } from 'utils';

interface BioTemplateFiveType {
  disable: boolean;
  userXId: string | undefined;
  screenType: ScreenType;
  biography: string;
  bioTextColor: string;
}
const BioTemplateFive: FC<BioTemplateFiveType> = ({
  disable,
  userXId,
  screenType,
  biography,
  bioTextColor,
}) => {
  const { avatar } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );

  const {
    skin: { secondary_color: secondaryColor },
  } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId].profileTemplate
      : state.user.profileTemplate,
  );

  const {
    user: { userId, username },
  } = useSelector((state: RootState) => state.user);
  const { isEdit, ownProfile } = useContext(ProfileContext);
  const dispatch = useDispatch();
  const [validImage, setValidImage] = React.useState<boolean>(true);

  const { tagg_score } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId].profile
      : state.user.profile,
  );
  const [score, setScore] = React.useState<number>(tagg_score);
  const [imageLoad, setImageLoad] = React.useState<boolean>(false);

  React.useEffect(() => {
    setTimeout(() => {
      setScore(tagg_score);
    }, 800);
  }, [tagg_score]);

  React.useEffect(() => {
    checkAvatar(avatar);
  }, [avatar]);

  const checkAvatar = async (url: string | undefined) => {
    const valid = await validateImageLink(url);
    if (valid !== validImage) {
      setValidImage(valid);
    }
  };

  const goToGallerySmallPic = useCallback(() => {
    ImageCropPicker.openPicker({
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
        patchEditProfile(request, userId)
          .then(() => {
            dispatch(loadUserData({ userId, username }));
            dispatch(resetHeaderAndProfileImage());
          })
          .catch(error => {
            Alert.alert(error);
          })
          .finally(() => {});
      }
    });
  }, []);

  const navigation = useNavigation();
  return (
    <View style={[styles.mainView]}>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.bottomImage}
          disabled={userXId !== undefined || validImage}
          onPress={goToGallerySmallPic}>
          {!isEdit && (
            <View style={styles.addPictureView}>
              <Image source={icons.EditImage} style={styles.placeholderImage} />
              {userXId === undefined && (
                <Text style={styles.addPictureText}>Add a Profile Picture</Text>
              )}
            </View>
          )}
          <Image
            source={{
              uri: avatar,
              cache: 'reload',
            }}
            onLoadStart={() => setImageLoad(true)}
            onLoadEnd={() => setImageLoad(false)}
            style={styles.image}
          />
          <EditAvatarImage style={styles.editAvatar} />
          {imageLoad && <ActivityIndicator style={styles.loader} size="large" color={'white'} />}
        </TouchableOpacity>
        <View style={styles.bottomRight}>
          <View style={styles.bioView}>
            {biography ? (
              <TouchableOpacity
                disabled={disable}
                onPress={() => navigation.navigate('EditBioTemplate')}>
                <GradientText colors={gradientColorFormation(bioTextColor)} style={[styles.bio]}>
                  {biography}
                </GradientText>
              </TouchableOpacity>
            ) : ownProfile ? (
              <TouchableOpacity
                disabled={disable}
                onPress={() => navigation.navigate('EditBioTemplate')}>
                <GradientText colors={gradientColorFormation(secondaryColor)} style={[styles.bio]}>
                  Add a Bio +
                </GradientText>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.bottomRightSubView}>
            <View style={styles.row}>
              <GradientText
                colors={gradientColorFormation(secondaryColor)}
                style={[styles.taggScore]}>
                {COINS_EARNED}: {score}
              </GradientText>
              <Image source={images.main.score_coin} style={styles.coin} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bio: {
    ...human.bodyObject,
    ...systemWeights.semibold,
  },
  placeholderImage: { width: '60%', height: 100, resizeMode: 'contain' },
  mainView: {
    width: '100%',
    marginBottom: '2%',
  },
  bioView: { minHeight: 117 },
  profileInfoContainer: {
    height: normalize(190),
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPictureView: {
    padding: 20,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPictureText: { fontSize: 13, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  innerContainer: {
    height: '80%',
    aspectRatio: 1,
    marginLeft: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  topContainer: {
    padding: 10,
  },
  bottomContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  buttonContainer: {
    paddingHorizontal: 10,
  },
  bottomImage: {
    width: normalize(120),
    minHeight: normalize(160),
    backgroundColor: '#c4c4c4',
  },
  bottomRight: {
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  videoPlaceholder: {
    width: '100%',
    height: 250,
    marginVertical: 10,
    resizeMode: 'cover',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  button: {
    width: '100%',
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...human.title2WhiteObject,
    ...systemWeights.bold,
    marginTop: 10,
  },
  username: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 10,
    opacity: 0.7,
  },
  friendsContainer: {
    marginTop: 25,
  },
  friends: {
    ...human.bodyObject,
    ...systemWeights.semibold,
  },
  taggScore: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    fontSize: 16,
    letterSpacing: 1,
  },
  coin: {
    width: 25,
    height: 25,
    bottom: -1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomRightSubView: { marginTop: 10 },
  editAvatar: { left: '50%', top: '50%' },
  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});

export default BioTemplateFive;
