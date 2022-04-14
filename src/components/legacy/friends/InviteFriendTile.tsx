import { TAGG_LIGHT_BLUE } from 'constants';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import {
  ERROR_FAILED_TO_INVITE_CONTACT,
  ERROR_NO_CONTACT_INVITE_LEFT,
  INVITE_USER_SMS_BODY,
  SUCCESS_CONFIRM_INVITE_CONTACT_MESSAGE,
  SUCCESS_CONFIRM_INVITE_CONTACT_TITLE,
  SUCCESS_LAST_CONTACT_INVITE
} from '../../constants/strings';
import {
  InviteContactType,
  SearchResultType
} from '../../screens/legacy/profile/InviteFriendsScreen';
import { inviteFriendService } from '../../services';
import { RootState } from '../../store/rootReducer';
import { AnalyticCategory, AnalyticVerb } from '../../types';
import { normalize, track } from '../../utils';

interface InviteFriendTileProps {
  item: InviteContactType;
  remind: boolean;
  results: SearchResultType;
  setResults: Function;
  invitesLeft: number;
  setInvitesLeft: (updateInvites: number) => void;
}

const InviteFriendTile: React.FC<InviteFriendTileProps> = ({
  item,
  invitesLeft,
  setInvitesLeft,
  remind,
  results,
  setResults,
}) => {
  const [invited, setInvited] = useState<boolean>(remind);
  const { name } = useSelector((state: RootState) => state.user.profile);
  const [formatedPhoneNumber, setFormattedPhoneNumber] = useState<string>('');
  const handleInviteFriend = async () => {
    // If user has been invited already, don't show alerts and change invite count
    if (invited) {
      const response = await inviteFriendService(
        item.phoneNumber,
        item.firstName,
        item.lastName,
        true,
      );
      const inviteCode = response?.invite_code;
      if (inviteCode) {
        // Open iMessage
        Linking.openURL(
          `sms:${item.phoneNumber}&body=${INVITE_USER_SMS_BODY(item.firstName, name, inviteCode)}`,
        );
      }
    } else {
      if (invitesLeft < 1) {
        Alert.alert(ERROR_NO_CONTACT_INVITE_LEFT);
      }
      Alert.alert(
        SUCCESS_CONFIRM_INVITE_CONTACT_TITLE(String(invitesLeft)),
        SUCCESS_CONFIRM_INVITE_CONTACT_MESSAGE,
        [
          {
            text: 'No!',
            style: 'cancel',
            onPress: () =>
              track('Invite', AnalyticVerb.Canceled, AnalyticCategory.InviteFriends, {
                invitesLeft: invitesLeft,
              }),
          },
          {
            text: 'Yes!',
            onPress: async () => {
              const response = await inviteFriendService(
                item.phoneNumber,
                item.firstName,
                item.lastName,
                false,
              );
              const inviteCode = response?.invite_code;
              if (!inviteCode) {
                setInvited(false);
                Alert.alert(ERROR_FAILED_TO_INVITE_CONTACT);
              }
              track('InvitedFriend', AnalyticVerb.Finished, AnalyticCategory.InviteFriends, {
                invitesLeft: invitesLeft - 1,
              });
              // Add user to Pending Users list
              const newPendingUser: InviteContactType = {
                phoneNumber: item.phoneNumber,
                firstName: item.firstName,
                lastName: item.lastName,
              };

              // Filtering user from nonUsersFromContacts list
              const filteredNonUsers = results.nonUsersFromContacts.filter(
                (user: InviteContactType) => user.phoneNumber !== item.phoneNumber,
              );

              // Open iMessages
              Linking.openURL(
                `sms:${item.phoneNumber}&body=${INVITE_USER_SMS_BODY(
                  item.firstName,
                  name,
                  inviteCode,
                )}`,
              );

              // Update results after navigating out of the app
              setTimeout(() => {
                setInvited(true);
                setInvitesLeft(invitesLeft - 1);
                setResults({
                  ...results,
                  pendingUsers: [...results.pendingUsers, newPendingUser],
                  nonUsersFromContacts: filteredNonUsers,
                });
              }, 500);

              if (invitesLeft === 1) {
                Alert.alert(SUCCESS_LAST_CONTACT_INVITE);
              }
            },
          },
        ],
      );
    }
  };

  useEffect(() => {
    const formatPhoneNumer = () => {
      const unformatted_number: string = item.phoneNumber;
      const part_one: string = unformatted_number.substring(2, 5);
      const part_two: string = unformatted_number.substring(5, 8);
      const part_three: string = unformatted_number.substring(8, unformatted_number.length);
      const temp = '(' + part_one + ')' + part_two + '-' + part_three;
      setFormattedPhoneNumber(temp);
    };
    formatPhoneNumer();
  });

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <View style={styles.bodyContainer}>
          <Text style={styles.label}>{item.firstName + ' ' + item.lastName}</Text>
          <Text style={styles.phoneNumber}>{formatedPhoneNumber}</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, invited ? styles.pendingButton : styles.inviteButton]}
          onPress={handleInviteFriend}>
          <Text
            style={[
              styles.buttonTitle,
              invited ? styles.pendingButtonTitle : styles.inviteButtonTitle,
            ]}>
            {invited ? 'Remind' : 'Invite'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: normalize(42),
    marginBottom: '5%',
  },
  bodyContainer: {
    flexDirection: 'column',
    height: normalize(42),
    justifyContent: 'space-around',
  },
  label: {
    fontWeight: '500',
    fontSize: normalize(14),
  },
  phoneNumber: {
    fontSize: normalize(12),
    fontWeight: '400',
    color: '#6C6C6C',
    letterSpacing: normalize(0.1),
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 82,
    height: 25,
    borderWidth: 2,
    borderRadius: 2,
    padding: 0,
    borderColor: TAGG_LIGHT_BLUE,
  },
  pendingButton: {
    backgroundColor: TAGG_LIGHT_BLUE,
  },
  inviteButton: {
    backgroundColor: 'transparent',
  },
  buttonTitle: {
    padding: 0,
    fontSize: normalize(11),
    fontWeight: '700',
    lineHeight: normalize(13.13),
    letterSpacing: normalize(0.6),
    paddingHorizontal: '3.8%',
  },
  pendingButtonTitle: {
    color: 'white',
  },
  inviteButtonTitle: {
    color: TAGG_LIGHT_BLUE,
  },
});

export default InviteFriendTile;
