import React, { FC, useCallback, useContext } from 'react';

import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
// import { SvgXml } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { human, systemWeights } from 'react-native-typography';

import { useDispatch, useSelector } from 'react-redux';

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
import {
  getBioTextColor,
  gradientColorFormation,
  normalize,
  track,
  validateImageLink,
} from 'utils';

import { icons } from '../../assets/icons';
import BioTemplateFive from './TemplateBios/BioTemplateFive';
import CommonPopups from './templateCommonPopup';

const TemplateFiveHeader: FC = ({ setActiveTab }) => {
  const {
    name,
    username,
    biography,
    cover,
    profile,
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

  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);
  const { isEdit } = useContext(ProfileContext);
  const dispatch = useDispatch();
  const [validCover, setValidCover] = React.useState<boolean>(true);
  const [headerImageLoad, setHeaderImageLoad] = React.useState<boolean>(false);

  const { tagg_score } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId].profile
      : state.user.profile,
  );
  const [score, setScore] = React.useState<number>(tagg_score);

  React.useEffect(() => {
    setTimeout(() => {
      setScore(tagg_score);
    }, 800);
  }, [tagg_score]);

  React.useEffect(() => {
    checkCover(cover);
  }, [cover]);

  const checkCover = async (url: string | undefined) => {
    const valid = await validateImageLink(url);
    if (valid !== validCover) {
      setValidCover(valid);
    }
  };
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
  return (
    <>
      <View style={styles.topContainer}>
        <View style={styles.titleContainer}>
          <GradientText colors={gradientColorFormation(secondaryColor)} style={[styles.title]}>
            {name}
          </GradientText>
          {userXId && <UserBActionSheet userXUsername={username} templateNumber={'five'} />}
        </View>
        <View style={styles.usernameContainer}>
          <GradientText colors={gradientColorFormation(secondaryColor)} style={[styles.username]}>
            @{username}
          </GradientText>
          {/* TODO: only display tier 1 for now */}
          {/* <SvgXml xml={icons.Tier1Outlined} width={15} height={15} /> */}
          <CommonPopups
            level={'test'}
            title={NEW_KID_ON_BLOCK}
            description={userXId ? OTHER_USER_ONE_TIER : LOGGED_IN_USER_TIER_ONE_TEXT}
            taggScore={score}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.background}
        disabled={userXId !== undefined || validCover}
        onPress={goToGalleryLargePic}>
        {!isEdit && (
          <View style={styles.placeholderContainer}>
            <Image source={icons.EditImage} style={styles.placeholderImage} />
            {userXId === undefined && (
              <View style={styles.textWrapper}>
                <Text style={styles.text}>Add a header </Text>
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
          style={styles.videoPlaceholder}>
          <EditCoverImage style={styles.cover} />
          {headerImageLoad && (
            <ActivityIndicator style={styles.loader} size="large" color={'white'} />
          )}
        </ImageBackground>
      </TouchableOpacity>
      <BioTemplateFive
        disable={ownProfile ? false : true}
        userXId={userXId}
        screenType={screenType}
        biography={biography}
        bioTextColor={getBioTextColor(primaryColor, secondaryColor, templateChoice, bioTextColor)}
      />
      <View style={styles.buttonContainer}>
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
        <View style={styles.tabContainer}>
          <PagesBar setActiveTab={setActiveTab} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  profileInfoContainer: {
    height: normalize(190),
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  placeholderImage: {
    width: 100,
    height: 100,
  },
  background: {
    backgroundColor: '#c4c4c4',
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
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
  topContainer: {
    padding: 10,
  },
  bottomContainer: {
    padding: 10,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  buttonContainer: {
    paddingHorizontal: 10,
  },
  bottomImage: {
    width: normalize(120),
    minHeight: normalize(160),
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
  buttonBlackText: {
    color: 'black',
    fontWeight: '700',
  },
  button: {
    width: '100%',
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EF879E',
  },
  title: {
    ...human.title2WhiteObject,
    ...systemWeights.bold,
    marginTop: 40,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  username: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    paddingRight: 5,
    top: -1,
  },
  bio: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 10,
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
    marginTop: 10,
  },
  tabContainer: {
    paddingTop: 10,
    marginHorizontal: -10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cover: { top: '40%' },
  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});

export default TemplateFiveHeader;
