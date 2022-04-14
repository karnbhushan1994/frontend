import { COINS_EARNED } from 'constants';

import React, { useCallback, useContext, useEffect, useState } from 'react';

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
import LinearGradient from 'react-native-linear-gradient';
// import { SvgXml } from 'react-native-svg';
import { human, systemWeights } from 'react-native-typography';
import { useDispatch, useSelector } from 'react-redux';

import { images } from 'assets/images';
import { EditAvatarImage } from 'components/templates/EditImages/avatar';
import { UserBActionSheet } from 'components/widgets/UserBActionSheet';
import {
  LOGGED_IN_USER_TIER_ONE_TEXT,
  NEW_KID_ON_BLOCK,
  OTHER_USER_ONE_TIER,
} from 'constants/strings';
import { ProfileContext } from 'screens/profile/ProfileScreen';
import { patchEditProfile } from 'services';
import { loadUserData, resetHeaderAndProfileImage } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, ScreenType } from 'types';
import {
  getBioBgColors,
  getBioTextColor,
  gradientColorFormation,
  normalize,
  track,
  validateImageLink,
} from 'utils';

import { icons } from '../../assets/icons';
import BioTemplateFour from './TemplateBios/BioTemplateFour';
import CommonPopups from './templateCommonPopup';

interface TemplateFourHeaderCardType {
  disable: boolean;
  userXId: string | undefined;
  screenType: ScreenType;
  biography: string;
  bioTextColor?: string;
  cardColorStart?: string;
  cardColorEnd?: string;
}
const TemplateFourHeaderCard: React.FC<TemplateFourHeaderCardType> = ({
  disable,
  userXId,
  screenType,
  cardColorStart,
  cardColorEnd,
  biography,
  bioTextColor,
}) => {
  const { name, tagg_score } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId].profile
      : state.user.profile,
  );
  const { avatar } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );

  const { username } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId].user
      : state.user.user,
  );

  const {
    skin: {
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      template_type: templateChoice,
    },
  } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId].profileTemplate
      : state.user.profileTemplate,
  );

  const [bioBgColors, setBioBgColors] = useState<string[]>([
    gradientColorFormation(primaryColor)[0],
    gradientColorFormation(secondaryColor)[0],
  ]);
  const [bioTxtColor, setBioTxtColor] = useState<string>('#FFFFFF');

  const [stateName] = React.useState<string>(name);
  const [titleStyle, setTitleStyle] = React.useState<object>({ fontSize: 20 });

  const [validImage, setValidImage] = React.useState<boolean>(true);
  const [imageLoad, setImageLoad] = React.useState<boolean>(false);

  const [score, setScore] = React.useState<number>(tagg_score);

  React.useEffect(() => {
    setTimeout(() => {
      setScore(tagg_score);
    }, 800);
  }, [tagg_score]);

  React.useEffect(() => {
    if (stateName.length > 15) {
      setTitleStyle({ fontSize: 15 });
    } else {
      setTitleStyle({ fontSize: 20 });
    }
  }, [stateName]);

  React.useEffect(() => {
    checkAvatar(avatar);
  }, [avatar]);

  const checkAvatar = async (url: string | undefined) => {
    const valid = await validateImageLink(url);
    if (valid !== validImage) {
      setValidImage(valid);
    }
  };

  useEffect(() => {
    setBioBgColors(
      getBioBgColors(primaryColor, secondaryColor, templateChoice, cardColorStart, cardColorEnd),
    );
  }, [cardColorStart, cardColorEnd]);

  useEffect(() => {
    setBioTxtColor(getBioTextColor(primaryColor, secondaryColor, templateChoice, bioTextColor));
  }, [bioTextColor]);

  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);
  const { isEdit } = useContext(ProfileContext);
  const dispatch = useDispatch();

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
            dispatch(resetHeaderAndProfileImage());
            dispatch(loadUserData({ userId, username }));
          })
          .catch(error => {
            Alert.alert(error);
          })
          .finally(() => {});
      }
    });
  }, []);
  return (
    <LinearGradient
      colors={[bioBgColors[0], bioBgColors[1]]}
      style={styles.topContainer}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}>
      <TouchableOpacity
        style={styles.imageContainer}
        disabled={userXId !== undefined || validImage}
        onPress={goToGallerySmallPic}>
        {!isEdit && (
          <View style={styles.imagePlaceholderContainer}>
            <Image source={icons.EditImage} style={styles.imagePlaceholder} />
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
          style={styles.picture}
        />
        {imageLoad && <ActivityIndicator style={styles.loader} size="large" color={'white'} />}
      </TouchableOpacity>
      <EditAvatarImage style={styles.uploadAvatar} />
      <View style={styles.rightContent}>
        {userXId && <UserBActionSheet userXUsername={username} templateNumber={'four'} />}
        <Text style={[styles.title, titleStyle, { color: bioTextColor }]} numberOfLines={2}>
          {stateName ? stateName : name}
        </Text>
        <View style={styles.usernameContainer}>
          <Text style={[styles.username, { color: bioTextColor }]}>@{username}</Text>
          {/* TODO: only display tier 1 for now */}
          {/* <SvgXml xml={icons.Tier1Outlined} width={15} height={15} /> */}
          <CommonPopups
            title={NEW_KID_ON_BLOCK}
            description={userXId ? OTHER_USER_ONE_TIER : LOGGED_IN_USER_TIER_ONE_TEXT}
            level={'test'}
            taggScore={score}
          />
        </View>
        <BioTemplateFour disable={disable} biography={biography} bioTextColor={bioTxtColor} />
        <View style={styles.row}>
          <Text style={[styles.taggScore, { color: bioTextColor }]}>
            {COINS_EARNED}: {score}
          </Text>
          <Image source={images.main.score_coin} style={styles.coin} />
        </View>
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    color: 'orange',
  },
  imagePlaceholder: {
    resizeMode: 'contain',
    width: '60%',
    height: 100,
  },
  imageContainer: {
    backgroundColor: '#c4c4c4',
    width: '40%',
    height: 170,
    borderRadius: 10,
  },
  imagePlaceholderContainer: {
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  addPictureText: { fontSize: 13, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  profileInfoContainer: {
    height: normalize(190),
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerContainer: {
    height: '80%',
    aspectRatio: 1,
    marginLeft: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  topContainer: {
    padding: 15,
    margin: 15,
    flexDirection: 'row',
    borderRadius: 10,
  },
  rightContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: '65%',
    alignItems: 'center',
  },
  picture: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  picturePlaceholder: {
    width: '40%',
    height: '100%',
    borderRadius: 10,
  },
  videoPlaceholder: {
    width: '100%',
    height: 250,
    marginVertical: 10,
    resizeMode: 'cover',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  buttonBlackText: {
    color: 'black',
    fontWeight: '700',
  },
  rightButton: {
    width: '48%',
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  leftButton: {
    width: '48%',
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    ...human.title2WhiteObject,
    ...systemWeights.bold,
    marginTop: 10,
    color: '#212121',
  },
  username: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    color: 'grey',
    marginRight: 4,
  },
  bio: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 10,
    textAlign: 'center',
  },
  friends: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 35,
  },
  uploadAvatar: { left: '25%', top: '60%' },
  taggScore: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    fontSize: 16,
    letterSpacing: 1,
  },
  coin: {
    width: 22,
    height: 22,
    bottom: -1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: -5,
    right: 12,
  },
  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});

export default TemplateFourHeaderCard;
