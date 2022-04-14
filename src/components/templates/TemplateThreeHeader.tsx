import { COINS_EARNED } from 'constants';

import React, { FC, useCallback, useContext, useEffect, useState } from 'react';

import chroma from 'chroma-js';
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
import { FriendsButton } from 'components';
import GradientText from 'components/GradientText';
import PagesBar from 'components/profile/PagesBar';
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
import { gradientColorFormation, normalize, SCREEN_WIDTH, track, validateImageLink } from 'utils';

import { icons } from '../../assets/icons';
import CommonPopups from './templateCommonPopup';

const TemplateThreeHeader: FC = ({ setActiveTab }) => {
  const { primaryColor, secondaryColor, userXId, screenType, ownProfile, is_blocked } =
    useContext(ProfileContext);
  const {
    tagg_score,
    cover,
    username,
    profile,
    onPressAcceptFriendRequest,
    onPressDeclineFriendRequest,
  } = useContext(ProfileHeaderContext);
  const { name } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId].profile
      : state.user.profile,
  );
  const [shareProfile, setShareProfile] = React.useState<boolean>(false);
  const [stateName, setStateName] = React.useState<string>(name);
  const [titleStyle, setTitleStyle] = React.useState<object>({ fontSize: 40 });
  const [validCover, setValidCover] = React.useState<boolean>(true);
  const [gradientColors, setGradientColors] = useState<string[]>(
    gradientColorFormation(primaryColor),
  );
  const [score, setScore] = React.useState<number>(tagg_score);
  const [imageLoad, setImageLoad] = useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setScore(tagg_score);
    }, 800);
  }, [tagg_score]);

  React.useEffect(() => {
    checkCover(cover);
  }, [cover]);

  React.useEffect(() => {
    setStateName(name);
  }, [name]);

  React.useEffect(() => {
    if (stateName.length > 15) {
      setTitleStyle({ fontSize: 30 });
    } else {
      setTitleStyle({ fontSize: 40 });
    }
  }, [stateName]);

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

  //Derive linear gradient colors
  useEffect(() => {
    const rgb1: number[] = chroma(gradientColorFormation(primaryColor)[0]).rgb();
    const rgb2: number[] = chroma(gradientColorFormation(primaryColor)[1]).rgb();
    setGradientColors([
      `rgba(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]}, 0)`,
      `rgba(${rgb2[0]}, ${rgb2[1]}, ${rgb2[2]}, 1)`,
    ]);
  }, [primaryColor]);

  return (
    <>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          onPress={goToGalleryLargePic}
          disabled={userXId !== undefined || validCover}>
          {!isEdit && (
            <TouchableOpacity disabled={userXId !== undefined} style={styles.profileBackground}>
              <Image source={icons.EditImage} style={styles.backgroundImage} />
              {userXId === undefined && (
                <View style={styles.textWrapper}>
                  <Text style={styles.text}>Add a header</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          <Image
            source={{
              uri: cover,
              cache: 'reload',
            }}
            style={styles.image}
            onLoadStart={() => setImageLoad(true)}
            onLoadEnd={() => setImageLoad(false)}
          />
          {imageLoad && <ActivityIndicator style={styles.loader} size="large" color={'white'} />}
          {userXId && <UserBActionSheet userXUsername={username} templateNumber={'three'} />}
        </TouchableOpacity>
        <EditCoverImage style={styles.cover} />
        <LinearGradient colors={gradientColors} style={styles.bottomContainer}>
          <GradientText
            colors={gradientColorFormation(secondaryColor)}
            style={[styles.title, titleStyle]}>
            {stateName}
          </GradientText>
          <GradientText colors={gradientColorFormation(secondaryColor)} style={[styles.username]}>
            @{username}
          </GradientText>
          <View style={styles.buttonContainer}>
            <View style={styles.friendsContainer}>
              {/* <SvgXml xml={icons.Tier1Outlined} width={20} height={20} /> */}
              <CommonPopups
                title={NEW_KID_ON_BLOCK}
                description={userXId ? OTHER_USER_ONE_TIER : LOGGED_IN_USER_TIER_ONE_TEXT}
                level={'test'}
                taggScore={score}
              />
            </View>
            {userXId && is_blocked ? (
              <View style={[styles.button]}>
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
              <View>
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
                    colors={gradientColorFormation(secondaryColor)}
                    style={[styles.button]}>
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
            <View style={styles.friendsContainer}>
              <View style={styles.row}>
                <GradientText
                  colors={gradientColorFormation(secondaryColor)}
                  style={[styles.friends]}>
                  {score}
                </GradientText>
                <Image source={images.main.score_coin} style={styles.coin} />
              </View>
              <View>
                <GradientText
                  colors={gradientColorFormation(secondaryColor)}
                  style={[styles.friends]}>
                  {COINS_EARNED}
                </GradientText>
              </View>
            </View>
          </View>
          <View style={styles.tabContainer}>
            <PagesBar setActiveTab={setActiveTab} />
          </View>
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  profileBackground: {
    width: '100%',
    height: '100%',
    top: -50,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfoContainer: {
    height: normalize(190),
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContainer: {
    height: 450,
    position: 'relative',
    backgroundColor: '#c4c4c4',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomContainer: {
    width: '100%',
    position: 'absolute',
    paddingTop: '7%',
    bottom: 0,
    alignItems: 'center',
    zIndex: 0,
  },
  bottomImage: {
    width: 120,
    height: 160,
  },
  bottomRight: {
    flex: 1,
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
  },
  friendsContainer: {
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.28,
  },
  button: {
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.44,
  },
  title: {
    ...systemWeights.bold,
    marginTop: 15,
    textAlign: 'center',
  },
  username: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 10,
    opacity: 0.7,
  },
  tabContainer: {
    paddingTop: 10,
  },
  cover: { top: '30%' },
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
  backgroundImage: {
    resizeMode: 'contain',
    width: '60%',
    height: 100,
  },
  friends: {
    ...human.bodyObject,
    ...systemWeights.semibold,
  },
  tagg: {
    ...human.bodyObject,
    ...systemWeights.semibold,
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

export default TemplateThreeHeader;
