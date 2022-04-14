import { COINS_EARNED } from 'constants';

import React, { FC, useCallback, useContext } from 'react';

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
import ImageCropPicker from 'react-native-image-crop-picker';
// import { SvgXml } from 'react-native-svg';
import { human, systemWeights } from 'react-native-typography';

import { useDispatch, useSelector } from 'react-redux';

import { images } from 'assets/images';
import { FriendsButton } from 'components';
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
import { validateImageLink } from 'utils';
import { getBioTextColor, normalize, track } from 'utils';

import { icons } from '../../assets/icons';
import BioTemplateTwo from './TemplateBios/BioTemplateTwo';
import CommonPopups from './templateCommonPopup';

const TemplateTwoHeader: FC = ({ setActiveTab }) => {
  const {
    name,
    tagg_score,
    avatar,
    cover,
    username,
    profile,
    biography,
    bioTextColor,
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
  const [shareProfile, setShareProfile] = React.useState<boolean>(false);
  const [stateName, setStateName] = React.useState<string>(name);
  const [titleStyle, setTitleStyle] = React.useState<object>({ fontSize: 20 });
  const [validImage, setValidImage] = React.useState<boolean>(true);
  const [validCover, setValidCover] = React.useState<boolean>(true);
  const [score, setScore] = React.useState<number>(tagg_score);
  const [imageLoad, setImageLoad] = React.useState<boolean>(false);
  const [headerImageLoad, setHeaderImageLoad] = React.useState<boolean>(false);

  React.useEffect(() => {
    setTimeout(() => {
      setScore(tagg_score);
    }, 800);
  }, [tagg_score]);

  React.useEffect(() => {
    checkAvatar(avatar);
  }, [avatar]);

  React.useEffect(() => {
    setStateName(name);
  }, [name]);

  React.useEffect(() => {
    checkCover(cover);
  }, [cover]);

  React.useEffect(() => {
    if (stateName.length > 15) {
      setTitleStyle({ fontSize: 17 });
    } else {
      setTitleStyle({ fontSize: 20 });
    }
  }, [stateName]);

  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);
  const { isEdit } = useContext(ProfileContext);
  const dispatch = useDispatch();
  const goToGalleryLargePic = useCallback(() => {
    ImageCropPicker.openPicker({
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

  return (
    <>
      <TouchableOpacity
        style={styles.top}
        disabled={userXId !== undefined || validCover}
        onPress={goToGalleryLargePic}>
        {!isEdit && (
          <View style={styles.addCoverPictureView}>
            <Image source={icons.EditImage} style={styles.backgroundPlaceholder} />
            {userXId === undefined && (
              <View style={styles.textWrapper}>
                <Text style={styles.text}>Add a header</Text>
              </View>
            )}
          </View>
        )}
        <ImageBackground
          source={{
            uri: cover,
            cache: 'reload',
          }}
          onLoadStart={() => setHeaderImageLoad(true)}
          onLoadEnd={() => setHeaderImageLoad(false)}
          style={styles.imagePlaceholder}>
          <EditCoverImage style={styles.cover} />
          {headerImageLoad && (
            <ActivityIndicator style={styles.loader} size="large" color={'white'} />
          )}
        </ImageBackground>
        {userXId && <UserBActionSheet userXUsername={username} templateNumber={'one'} />}
      </TouchableOpacity>
      <View style={styles.relativeContainer}>
        <View style={styles.absoluteContainer}>
          <View style={[styles.trapezoid, { borderBottomColor: primaryColor }]} />
          <View style={styles.content}>
            <TouchableOpacity
              disabled={userXId !== undefined || validImage}
              style={styles.profilePictureContainer}
              onPress={goToGallerySmallPic}>
              {!isEdit && (
                <View style={styles.profilePicturePlaceholderContainer}>
                  <Image source={icons.EditImage} style={styles.profilePicturePlaceholder} />
                </View>
              )}
              <ImageBackground
                source={{
                  uri: avatar,
                }}
                onLoadStart={() => setImageLoad(true)}
                onLoadEnd={() => setImageLoad(false)}
                style={styles.profilePicture}>
                <EditAvatarImage />
                {imageLoad && (
                  <ActivityIndicator style={styles.loader} size="large" color={'white'} />
                )}
              </ImageBackground>
            </TouchableOpacity>
            <View style={styles.rightSection}>
              <View style={styles.rightContainer}>
                <View style={styles.nameContainer}>
                  <Text
                    style={[styles.title, titleStyle, { color: bioTextColor }]}
                    numberOfLines={2}>
                    {stateName}
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
                </View>
              </View>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.row}>
              <Text style={[styles.taggScore, { color: bioTextColor }]}>
                {COINS_EARNED}: {score}
              </Text>
              <Image source={images.main.score_coin} style={styles.coin} />
            </View>
            <BioTemplateTwo
              disable={ownProfile ? false : true}
              userXId={userXId}
              screenType={screenType}
              biography={biography}
              bioTextColor={getBioTextColor(
                primaryColor,
                secondaryColor,
                templateChoice,
                bioTextColor,
              )}
            />
            {userXId && is_blocked ? (
              <TouchableOpacity style={[styles.button]}>
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
              </TouchableOpacity>
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
                  <View style={[styles.button, { backgroundColor: secondaryColor }]}>
                    <Text style={[styles.buttonText, { color: primaryColor }]}>
                      {userXId ? SHARE_THIS_PROFILE_BUTTON_TEXT : SHARE_PROFILE_BUTTON_TEXT}
                    </Text>
                  </View>
                </TouchableOpacity>
                <ShareProfileDrawer
                  isOpen={shareProfile}
                  setIsOpen={setShareProfile}
                  username={username}
                />
              </View>
            )}
            <View style={styles.tabContainer}>
              <PagesBar setActiveTab={setActiveTab} />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

/*
<ImageBackground
                  source={{
                    uri: avatar,
                  }}
                  style={styles.profilePicture}>
                  <EditAvatarImage />
                </ImageBackground>
*/
const styles = StyleSheet.create({
  top: {
    backgroundColor: '#828282',
  },
  taggScore: {
    fontWeight: '600',
  },
  profileInfoContainer: {
    height: normalize(170),
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backgroundPlaceholder: {
    resizeMode: 'contain',
    width: 70,
    zIndex: 999,
    height: 70,
  },
  rightContainer: {
    alignItems: 'flex-start',
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
  innerContainer: {
    height: '80%',
    aspectRatio: 1,
    marginLeft: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  bottomContainer: {
    padding: 20,
    paddingTop: 0,
    top: -15,
  },
  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 100,
    overflow: 'hidden',
  },
  profilePictureContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c4c4c4',
  },
  profilePicturePlaceholder: {
    width: 70,
    height: 70,
    overflow: 'hidden',
  },
  profilePicturePlaceholderContainer: {
    width: 110,
    height: 110,
    borderRadius: 100,
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: '#c4c4c4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  friendsColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  columns: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  taggColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    zIndex: 999,
  },
  bottomRight: {
    flex: 1,
    paddingHorizontal: 20,
  },
  buttonView: {
    flex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  addCoverPictureView: {
    width: '100%',
    height: 300,
    paddingBottom: 20,
    position: 'absolute',
    zIndex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  relativeContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  absoluteContainer: {
    position: 'absolute',
    width: '100%',
    top: -115,
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
    marginTop: 4,
  },
  title: {
    ...human.title2WhiteObject,
    ...systemWeights.bold,
    marginTop: 10,
    color: 'black',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    color: '#828282',
    paddingRight: 5,
    top: -1,
  },
  bio: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 10,
  },
  friends: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 35,
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    left: 18,
  },
  trapezoid: {
    width: '113%',
    height: 120,
    borderBottomWidth: 100,
    borderBottomColor: 'white',
    borderLeftWidth: 170,
    borderLeftColor: 'transparent',
    marginLeft: -50,
    marginRight: -50,
    borderRightColor: 'transparent',
    borderStyle: 'solid',
    marginBottom: 20,
  },
  tabContainer: {
    marginVertical: 10,
    marginHorizontal: -20,
  },
  cover: { top: '30%' },
  tagg: {
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
  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});

export default TemplateTwoHeader;
