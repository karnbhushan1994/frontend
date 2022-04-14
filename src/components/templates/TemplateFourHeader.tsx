import React, { FC, useContext } from 'react';

import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { human, systemWeights } from 'react-native-typography';

import { FriendsButton, TemplateFourHeaderCard } from 'components';
import GradientText from 'components/GradientText';
import PagesBar from 'components/profile/PagesBar';
import ShareProfileDrawer from 'components/widgets/ShareProfileDrawer';
import { SHARE_PROFILE_BUTTON_TEXT, SHARE_THIS_PROFILE_BUTTON_TEXT } from 'constants/strings';
import { ProfileContext, ProfileHeaderContext } from 'screens/profile/ProfileScreen';
import { AnalyticCategory, AnalyticVerb } from 'types';
import { gradientColorFormation, normalize, track } from 'utils';

const TemplateFourHeader: FC = ({ setActiveTab }) => {
  const {
    profile,
    username,
    biography,
    bioTextColor,
    bioColorStart,
    bioColorEnd,
    onPressAcceptFriencRequest,
    onPressDeclineFriendRequest,
  } = useContext(ProfileHeaderContext);
  const { userXId, screenType, ownProfile, primaryColor, secondaryColor, is_blocked } =
    useContext(ProfileContext);

  const [shareProfile, setShareProfile] = React.useState<boolean>(false);
  return (
    <>
      <TemplateFourHeaderCard
        disable={ownProfile ? false : true}
        userXId={userXId}
        screenType={screenType}
        bioTextColor={bioTextColor}
        biography={biography}
        cardColorStart={bioColorStart}
        cardColorEnd={bioColorEnd}
      />
      <View style={styles.tabContainer}>
        <PagesBar setActiveTab={setActiveTab} />
      </View>
      <View style={styles.buttonsContainer}>
        {userXId && is_blocked ? (
          <TouchableOpacity style={[styles.longButton]}>
            <FriendsButton
              userXId={userXId}
              screenType={screenType}
              friendship_requester_id={profile.friendship_requester_id}
              onAcceptRequest={onPressAcceptFriencRequest}
              onRejectRequest={onPressDeclineFriendRequest}
              buttonColor={secondaryColor}
              buttonTextColor={primaryColor}
              custom={false}
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
              <LinearGradient
                colors={gradientColorFormation(secondaryColor)}
                style={[styles.longButton]}>
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
    marginTop: 50,
    flexDirection: 'row',
    borderRadius: 10,
  },
  rightContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: '65%',
    alignItems: 'center',
    flex: 1,
  },
  picture: {
    width: '40%',
    height: '100%',
    resizeMode: 'cover',
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
  longButton: {
    width: '100%',
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    ...systemWeights.bold,
    marginTop: 10,
    flex: 1,
    textAlign: 'center',
    color: '#212121',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
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
    textAlign: 'center',
  },
  buttonView: {
    flex: 1,
  },
  friends: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 35,
  },
  taggScore: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 10,
    color: 'white',
  },
  tabContainer: {
    paddingTop: 10,
  },
});

export default TemplateFourHeader;
