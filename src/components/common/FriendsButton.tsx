import React, { Fragment, useContext } from 'react';

import { StyleProp, StyleSheet, Text, TextStyle, ViewStyle, TouchableOpacity } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { TaggToast } from 'components';

import { ProfileContext } from 'screens/profile/ProfileScreen';
import { blockUnblockUser } from 'store/actions';

import { NO_PROFILE, NO_USER } from 'store/initialStates';
import { RootState } from 'store/rootReducer';
import { ScreenType, TaggToastType } from 'types';
import { handleFriendUnfriend, normalize } from 'utils';

import { TaggToastTextList, TAGG_LIGHT_BLUE } from '../../constants';

interface FriendsButtonProps {
  userXId: string | undefined;
  custom: boolean | undefined;
  buttonColor: string | undefined;
  buttonTextColor: string;
  screenType: ScreenType;
  friendship_requester_id: string;
  onAcceptRequest: () => void;
  onRejectRequest: () => void;
}
const FriendsButton: React.FC<FriendsButtonProps> = ({
  userXId,
  screenType,
  friendship_requester_id,
  buttonColor,
  buttonTextColor,
  custom,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { is_blocked } = useContext(ProfileContext);

  const { user = NO_USER, profile = NO_PROFILE } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );

  const { user: loggedInUser = NO_USER } = useSelector((state: RootState) => state.user);

  const state = useStore().getState();
  const { friendship_status } = profile;

  const outlineButton: [StyleProp<ViewStyle>, StyleProp<TextStyle>] = [
    [styles.button, styles.transparentBG],
    [styles.label, styles.blueLabel],
  ];

  const customOutlineButton: [StyleProp<ViewStyle>, StyleProp<TextStyle>] = [
    [
      buttonColor ? { ...styles.button, borderColor: buttonColor } : styles.button,
      styles.transparentBG,
    ],
    [styles.label, buttonColor ? { color: buttonColor } : styles.blueLabel],
  ];

  const filledButton: [StyleProp<ViewStyle>, StyleProp<TextStyle>] = [
    [styles.button, styles.lightBlueBG],
    [styles.label, styles.whiteLabel],
  ];
  const customFilledButton: [StyleProp<ViewStyle>, StyleProp<TextStyle>] = [
    [
      buttonColor ? { ...styles.button, borderColor: buttonColor } : styles.button,
      buttonColor ? { backgroundColor: buttonColor } : styles.lightBlueBG,
    ],
    [
      styles.label,
      {
        ...styles.whiteLabel,
        color: buttonTextColor,
      },
    ],
  ];

  const renderButton = (
    title: string,
    style: [StyleProp<ViewStyle>, StyleProp<TextStyle>],
    onPress?: () => void,
  ) => (
    <TouchableOpacity
      style={style[0]}
      onPress={() => {
        if (userXId && is_blocked) {
          blockUnblockUser(loggedInUser.userId, userXId, is_blocked, state, dispatch).then(
            success => {
              if (success) {
                TaggToast(toast, TaggToastType.Success, TaggToastTextList.PROFILE_UNBLOCLKED);
              }
            },
          );
        } else {
          onPress
            ? onPress()
            : handleFriendUnfriend(screenType, user, profile, dispatch, state, loggedInUser);
        }
      }}>
      <Text style={style[1]}>{is_blocked ? 'Unblock' : title}</Text>
    </TouchableOpacity>
  );

  switch (friendship_status) {
    case 'friends':
      return renderButton('Unfriend', custom ? customOutlineButton : outlineButton);
    case 'requested':
      if (friendship_requester_id !== userXId) {
        return renderButton('Requested', custom ? customFilledButton : filledButton);
      } else {
        return renderButton('Pending', custom ? customFilledButton : filledButton);
      }
    case 'no_record':
      return renderButton('Add Friend', custom ? customFilledButton : filledButton);
    default:
      return <Fragment />;
  }
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    // aspectRatio: 154 / 33,
    height: 35,
    borderWidth: 2,
    borderColor: TAGG_LIGHT_BLUE,
    borderRadius: 5,
  },
  transparentBG: {
    backgroundColor: 'transparent',
  },
  lightBlueBG: {
    backgroundColor: TAGG_LIGHT_BLUE,
  },
  label: {
    fontSize: normalize(13),
    fontWeight: '700',
    letterSpacing: 1,
  },
  blueLabel: {
    color: TAGG_LIGHT_BLUE,
  },
  whiteLabel: {
    color: 'white',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default FriendsButton;
