import { COINS_EARNED } from 'constants';

import React, { FC, useCallback, useContext, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
// import { SvgXml } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { human, systemWeights } from 'react-native-typography';

import { useDispatch, useSelector } from 'react-redux';

import { images } from 'assets/images';
import { FriendsButton } from 'components';
import GradientText from 'components/GradientText';
import PagesBar from 'components/profile/PagesBar';
import { EditAvatarImage } from 'components/templates/EditImages/avatar';
import { EditCoverImage } from 'components/templates/EditImages/cover';
import ShareProfileDrawer from 'components/widgets/ShareProfileDrawer';
import { UserBActionSheet } from 'components/widgets/UserBActionSheet';
import {
  SHARE_PROFILE_BUTTON_TEXT,
  LOGGED_IN_USER_TIER_ONE_TEXT,
  NEW_KID_ON_BLOCK,
  OTHER_USER_ONE_TIER,
  SHARE_THIS_PROFILE_BUTTON_TEXT,
} from 'constants/strings';
import { ProfileContext, ProfileHeaderContext } from 'screens/profile/ProfileScreen';
import { patchEditProfile } from 'services';
import { loadUserData, resetHeaderAndProfileImage } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb } from 'types';
import { gradientColorFormation, validateImageLink } from 'utils';
import { getBioBgColors, normalize, track } from 'utils';

import { icons } from '../../assets/icons';
import BioTemplateOne from './TemplateBios/BioTemplateOne';
import CommonPopups from './templateCommonPopup';

const TemplateOneHeader: FC = ({ setActiveTab }) => {
  const {
    tagg_score,
    avatar,
    username,
    profile,
    cover,
    onPressAcceptFriendRequest,
    onPressDeclineFriendRequest,
  } = useContext(ProfileHeaderContext);

  const {
    userXId,
    screenType,
    primaryColor,
    secondaryColor,
    templateChoice,
    ownProfile,
    is_blocked,
  } = useContext(ProfileContext);
  const { biography, bioTextColor, bioColorStart, bioColorEnd } = useContext(ProfileHeaderContext);
  const { name } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId].profile
      : state.user.profile,
  );
  const [bioBgColors, setBioBgColors] = useState<string[]>([
    gradientColorFormation(primaryColor)[0],
    gradientColorFormation(secondaryColor)[0],
  ]);
  const [bioTxtColor, setBioTxtColor] = useState<string>('#FFFFFF');
  const [shareProfile, setShareProfile] = useState<boolean>(false);
  const [stateName, setStateName] = React.useState<string>(name);
  const [titleStyle, setTitleStyle] = React.useState<object>({ fontSize: 20 });
  const [imageLoad, setImageLoad] = React.useState<boolean>(false);
  const [headerImageLoad, setHeaderImageLoad] = React.useState<boolean>(false);

  const [validImage, setValidImage] = React.useState<boolean>(true);
  const [validCover, setValidCover] = React.useState<boolean>(true);

  useEffect(() => {
    setBioBgColors(
      getBioBgColors(primaryColor, secondaryColor, templateChoice, bioColorStart, bioColorEnd),
    );
  }, [bioColorStart, bioColorEnd, primaryColor, secondaryColor, templateChoice]);

  useEffect(() => {
    setBioTxtColor(primaryColor);
  }, [bioTextColor]);

  useEffect(() => {
    setStateName(name);
  }, [name]);

  useEffect(() => {
    if (stateName.length > 15) {
      setTitleStyle({ fontSize: 15 });
    } else {
      setTitleStyle({ fontSize: 20 });
    }
  }, [stateName]);

  useEffect(() => {
    checkAvatar(avatar);
  }, [avatar]);

  useEffect(() => {
    checkCover(cover);
  }, [cover]);

  const checkAvatar = async (url: string | undefined) => {
    const valid = await validateImageLink(url);
    if (valid !== validImage) {
      setValidImage(valid);
    }
  };

  const checkCover = async (url: string | undefined) => {
    const valid = await validateImageLink(url);
    if (valid !== validCover) {
      setValidCover(valid);
    }
  };

  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);
  const { isEdit } = useContext(ProfileContext);
  const dispatch = useDispatch();
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

  const [score, setScore] = useState<number>(tagg_score);
  useEffect(() => {
    setTimeout(() => {
      setScore(tagg_score);
    }, 800);
  }, [tagg_score]);

  return (
    <>
      <TouchableOpacity
        disabled={userXId !== undefined || validCover}
        onPress={goToGalleryLargePic}>
        <LinearGradient
          colors={gradientColorFormation(secondaryColor)}
          style={[styles.coverPictureContainer]}>
          {!isEdit && (
            <TouchableOpacity
              style={styles.addCoverPictureView}
              disabled={userXId !== undefined}
              onPress={goToGalleryLargePic}>
              <Image source={icons.EditImage} style={styles.backgroundPlaceholder} />
              {userXId === undefined && (
                <View style={styles.textWrapper}>
                  <Text style={styles.text}>Add a header</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          <ImageBackground
            source={{
              uri: cover,
              cache: 'reload',
            }}
            onLoadStart={() => setHeaderImageLoad(true)}
            onLoadEnd={() => setHeaderImageLoad(false)}
            style={[styles.coverPhoto]}>
            <EditCoverImage />
            {headerImageLoad && (
              <ActivityIndicator style={styles.loader} size="large" color={'white'} />
            )}
          </ImageBackground>
          {userXId && <UserBActionSheet userXUsername={username} templateNumber={'one'} />}
        </LinearGradient>
      </TouchableOpacity>
      <LinearGradient colors={gradientColorFormation(primaryColor)} style={[styles.mainContainer]}>
        <PagesBar setActiveTab={setActiveTab} pageStyle={styles.pageBarStyle} />
        <LinearGradient
          colors={gradientColorFormation(secondaryColor)}
          style={[styles.profileInfoContainer]}>
          <TouchableOpacity
            onPress={goToGallerySmallPic}
            disabled={userXId !== undefined || validImage}
            style={styles.profilePicContainer}>
            {!isEdit && (
              <View style={styles.addPictureView}>
                <Image source={icons.EditImage} style={styles.backgroundPlaceholder} />
                {userXId === undefined && (
                  <Text style={styles.addPictureText}>Add a Profile Picture</Text>
                )}
              </View>
            )}
            <ImageBackground
              source={{
                uri: avatar,
                cache: 'reload',
              }}
              onLoadStart={() => setImageLoad(true)}
              onLoadEnd={() => setImageLoad(false)}
              style={styles.bottomImage}>
              <EditAvatarImage />
              {imageLoad && (
                <ActivityIndicator style={styles.loader} size="large" color={'white'} />
              )}
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.innerContainer}>
            <GradientText
              colors={gradientColorFormation(bioTxtColor)}
              style={[styles.title, titleStyle]}
              numberOfLines={2}>
              {stateName}
            </GradientText>
            <View style={styles.usernameContainer}>
              <GradientText colors={gradientColorFormation(bioTxtColor)} style={[styles.username]}>
                @{username}
              </GradientText>
              {/* TODO: only display tier 1 for now */}
              {/* <SvgXml xml={icons.Tier1Outlined} width={15} height={15} /> */}
              <CommonPopups
                title={NEW_KID_ON_BLOCK}
                description={userXId ? OTHER_USER_ONE_TIER : LOGGED_IN_USER_TIER_ONE_TEXT}
                level={'test'}
                taggScore={score}
              />
            </View>
            <View style={styles.row}>
              <GradientText colors={gradientColorFormation(bioTxtColor)} style={[styles.tagg]}>
                {COINS_EARNED}: {score}
              </GradientText>
              <Image source={images.main.score_coin} style={styles.coin} />
            </View>
          </View>
        </LinearGradient>
        <View style={styles.buttonsContainer}>
          <BioTemplateOne
            disable={ownProfile ? false : true}
            biography={biography}
            bioColorStart={bioBgColors[0]}
            bioColorEnd={bioBgColors[1]}
            bioTextColor={bioTxtColor}
          />
        </View>
        <View style={styles.buttonsContainer}>
          {userXId && is_blocked ? (
            <View style={[styles.longButton]}>
              <FriendsButton
                userXId={userXId}
                screenType={screenType}
                friendship_requester_id={profile.friendship_requester_id}
                onAcceptRequest={onPressAcceptFriendRequest}
                onRejectRequest={onPressDeclineFriendRequest}
                buttonColor={secondaryColor}
                buttonTextColor={primaryColor}
                custom={true}
              />
            </View>
          ) : (
            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={async () => {
                  if (ownProfile) {
                    track('UserAShareProfileBtn', AnalyticVerb.Pressed, AnalyticCategory.Profile);
                  } else {
                    track('UserBShareProfileBtn', AnalyticVerb.Pressed, AnalyticCategory.Profile);
                  }
                  setShareProfile(true);
                }}>
                <LinearGradient
                  style={[styles.longButton]}
                  colors={gradientColorFormation(secondaryColor)}>
                  <GradientText
                    colors={gradientColorFormation(primaryColor)}
                    style={[styles.buttonText]}>
                    {userXId ? SHARE_THIS_PROFILE_BUTTON_TEXT : SHARE_PROFILE_BUTTON_TEXT}
                  </GradientText>
                </LinearGradient>
              </TouchableOpacity>
              <ShareProfileDrawer
                isOpen={shareProfile}
                setIsOpen={setShareProfile}
                username={username}
              />
            </View>
          )}
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  profileInfoContainer: {
    height: normalize(170),
    borderRadius: 8,
    marginHorizontal: 4,
    marginTop: 5,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContainer: {
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 15,
    top: -10,
  },
  backgroundPlaceholder: {
    resizeMode: 'contain',
    width: '60%',
    height: 100,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  rightButton: {
    width: '48%',
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addPictureText: { fontSize: 13, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  addPictureView: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicContainer: {
    width: 120,
    height: 150,
    marginLeft: 20,
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: '#c4c4c4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCoverPictureView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPictureContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  longButton: {
    width: '100%',
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  buttonView: {
    flex: 1,
  },
  bottomImage: {
    width: 120,
    height: 150,
    borderRadius: 10,
    zIndex: 199,
  },
  coverPhoto: {
    width: '100%',
    height: 300,
  },
  buttonBlackText: {
    color: 'black',
    fontWeight: '700',
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
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
  title: {
    ...human.title2WhiteObject,
    ...systemWeights.bold,
    marginTop: 10,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
  },
  username: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    paddingRight: 5,
    top: -1,
  },
  pageBarStyle: { marginHorizontal: -10 },
  tagg: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    color: '#fff',
    fontSize: 18,
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
    marginTop: 12,
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

export default TemplateOneHeader;
