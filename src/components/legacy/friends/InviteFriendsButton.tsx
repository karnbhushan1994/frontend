import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { Alert, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { checkPermission, requestPermission } from 'react-native-contacts';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { normalize } from 'utils';

const InviteFriendsButton: React.FC = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={async () => {
        const permission = await checkPermission();
        switch (permission) {
          case 'authorized':
            navigation.navigate('InviteFriendsScreen');
            break;
          case 'denied':
            Alert.alert(
              '"Tagg" Would Like to Access Your Contacts',
              'This helps you quickly get in touch with friends on the app and more',
              [
                {
                  text: "Don't Allow",
                  style: 'cancel',
                },
                { text: 'Allow', onPress: () => Linking.openSettings() },
              ],
            );
            break;
          case 'undefined':
          default:
            const response = await requestPermission();
            if (response === 'authorized') {
              navigation.navigate('InviteFriendsScreen');
            }
            break;
        }
      }}>
      <SvgXml
        xml={icons.InviteFriendWhite}
        width={normalize(31)}
        height={normalize(20)}
        style={styles.inviteFriendsIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inviteFriendsIcon: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.7,
  },
});

export default InviteFriendsButton;
