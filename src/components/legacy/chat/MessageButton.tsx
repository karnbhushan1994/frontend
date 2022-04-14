import React from 'react';
import { Fragment, useContext } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Alert, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useStore } from 'react-redux';


import { ChatContext } from '../../../App';
import { ERROR_UNABLE_CONNECT_CHAT } from '../../../constants/strings';
import { RootState } from 'store/rootReducer';
import { FriendshipStatusType } from 'types';
import { createChannel } from 'utils';

import { BasicButton } from 'components/common';

interface MessageButtonProps {
  userXId: string;
  isBlocked: boolean;
  friendship_status: FriendshipStatusType;
  friendship_requester_id?: string;
  solid?: boolean;
  externalStyles?: Record<string, StyleProp<ViewStyle | TextStyle>>;
}

const MessageButton: React.FC<MessageButtonProps> = ({
  userXId,
  isBlocked,
  friendship_status,
  friendship_requester_id,
  solid,
  externalStyles,
}) => {
  const navigation = useNavigation();
  const { chatClient, setChannel } = useContext(ChatContext);

  const state: RootState = useStore().getState();
  const loggedInUserId = state.user.user.userId;

  const canMessage = () => {
    if (
      userXId &&
      !isBlocked &&
      (friendship_status === 'no_record' ||
        friendship_status === 'friends' ||
        (friendship_status === 'requested' && friendship_requester_id === loggedInUserId))
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onPressMessage = async () => {
    if (chatClient.user && userXId) {
      const channel = await createChannel(loggedInUserId, userXId, chatClient);
      setChannel(channel);
      navigation.navigate('Chat');
    } else {
      Alert.alert(ERROR_UNABLE_CONNECT_CHAT);
    }
  };

  return canMessage() ? (
    <BasicButton
      title={'Message'}
      onPress={onPressMessage}
      externalStyles={externalStyles}
      solid={solid ? solid : false}
    />
  ) : (
    <Fragment />
  );
};

export default MessageButton;
