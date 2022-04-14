import React, { Fragment } from 'react';

import { Image, StyleSheet, Text } from 'react-native';

import { images } from 'assets/images';
import { normalize, SCREEN_WIDTH } from 'utils';

import { TaggPrompt } from '../common';

export const InviteFriendsPrompt: React.FC = () => (
  <TaggPrompt
    messageHeader={'Invite Friends To Tagg!'}
    messageBody={
      'A new feature that lets you invite your friends to Tagg. \nClick on your friends list to do so!'
    }
    logoType={'invite_friends'}
    hideCloseButton={true}
    noPadding={true}
    onClose={() => {}}
  />
);

export const PrivateAccountsPrompt: React.FC = () => (
  <TaggPrompt
    messageHeader={'Private or Public!'}
    messageBody={
      'You can now choose to make your account private!\nHead over to the privacy tab in settings to check it out'
    }
    logoType={'private_accounts'}
    hideCloseButton={true}
    noPadding={true}
    onClose={() => {}}
  />
);

export const NewChatPrompt: React.FC = () => {
  const handWaveRegex = '\u{1F44B}';
  const message = `Introducing messaging, another way to engage with\nfriends on campus! Send a ${handWaveRegex} to a friend now!`;
  return (
    <TaggPrompt
      messageHeader={'Chat!'}
      messageBody={message}
      logoType={'chat'}
      logoLink={'ChatList'}
      externalStyles={{
        icon: {
          width: SCREEN_WIDTH * 0.9,
          height: normalize(70),
        },
      }}
      hideCloseButton={true}
      noPadding={true}
      onClose={() => {}}
    />
  );
};

interface SPPromptNotificationProps {
  showSPNotifyPopUp: boolean;
}

export const SPPromptNotification: React.FC<SPPromptNotificationProps> = ({ showSPNotifyPopUp }) =>
  showSPNotifyPopUp ? (
    <TaggPrompt
      messageHeader={'New Suggested People Page!'}
      messageBody={
        <>
          <Text>A new page where you can discover new profiles. Just press the new </Text>
          <Image style={styles.icon} source={images.navigation.home} />
          <Text> button on the tab bar to check it out!</Text>
        </>
      }
      logoType={'tagg'}
      hideCloseButton={true}
      noPadding={true}
      onClose={() => {}}
    />
  ) : (
    <Fragment />
  );

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    tintColor: 'grey',
  },
});
