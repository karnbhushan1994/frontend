import React from 'react';

import { LayoutChangeEvent, Linking, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { TAGG_DARK_BLUE, TOGGLE_BUTTON_TYPE } from '../../constants';

import {
  acceptFriendRequest,
  declineFriendRequest,
  updateUserXFriends,
  updateUserXProfileAllScreens,
} from '../../store/actions';
import { NO_PROFILE } from '../../store/initialStates';
import { RootState } from '../../store/rootReducer';
import { AnalyticCategory, AnalyticVerb, ScreenType } from '../../types';
import { getUserAsProfilePreviewType, normalize, SCREEN_HEIGHT, track } from '../../utils';
import { FriendsButton } from '../common';
import ToggleButton from './ToggleButton';

interface ProfileBodyProps {
  onLayout: (event: LayoutChangeEvent) => void;
  isBlocked: boolean;
  handleBlockUnblock: () => void;
  userXId: string | undefined;
  screenType: ScreenType;
}
const ProfileBody: React.FC<ProfileBodyProps> = ({
  onLayout,
  isBlocked,
  handleBlockUnblock,
  userXId,
  screenType,
}) => {
  const dispatch = useDispatch();

  const { profile = NO_PROFILE, user } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );

  const { biography, website, friendship_requester_id } = profile;

  const { id, username, first_name, last_name, thumbnail_url } = getUserAsProfilePreviewType(
    user,
    profile,
  );

  const state: RootState = useStore().getState();

  const handleAcceptRequest = async () => {
    await dispatch(
      acceptFriendRequest({
        id,
        username,
        first_name,
        last_name,
        thumbnail_url,
      }),
    );
    await dispatch(updateUserXFriends(id, state));
    dispatch(updateUserXProfileAllScreens(id, state));
  };

  const handleDeclineFriendRequest = async () => {
    await dispatch(declineFriendRequest(id));
    dispatch(updateUserXProfileAllScreens(id, state));
  };

  return (
    <View onLayout={onLayout} style={styles.container}>
      <Text style={styles.username}>{`@${username}`}</Text>
      {biography.length > 0 && <Text style={styles.biography}>{`${biography}`}</Text>}
      {website.length > 0 && (
        <Text
          style={styles.website}
          onPress={() => {
            track('WebsiteLink', AnalyticVerb.Pressed, AnalyticCategory.Profile, {
              user,
            });
            Linking.openURL(website.startsWith('http') ? website : 'http://' + website);
          }}>{`${website}`}</Text>
      )}
      {userXId && isBlocked && (
        <View style={styles.toggleButtonContainer}>
          <ToggleButton
            toggleState={isBlocked}
            handleToggle={handleBlockUnblock}
            buttonType={TOGGLE_BUTTON_TYPE.BLOCK_UNBLOCK}
          />
        </View>
      )}
      <View style={styles.simpleRowContainer}>
        {userXId && !isBlocked && (
          <View style={styles.buttonsContainer}>
            <FriendsButton
              userXId={userXId}
              screenType={screenType}
              friendship_requester_id={friendship_requester_id}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleDeclineFriendRequest}
              buttonColor="black"
              custom={false}
            />
            <View />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleButtonContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: '3.5%',
    paddingBottom: '2%',
  },
  simpleRowContainer: { flexDirection: 'row' },
  buttonsContainer: {
    flex: 1,
    paddingTop: '3.5%',
    paddingBottom: '2%',
    width: '50%',
    height: SCREEN_HEIGHT * 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    paddingHorizontal: 18,
    backgroundColor: 'white',
  },
  username: {
    fontWeight: '600',
    fontSize: normalize(13.5),
    marginBottom: '1%',
  },
  biography: {
    fontSize: normalize(13.5),
    marginBottom: '1.5%',
  },
  website: {
    fontSize: normalize(13.5),
    color: TAGG_DARK_BLUE,
    marginBottom: '1%',
  },
});

export default ProfileBody;
