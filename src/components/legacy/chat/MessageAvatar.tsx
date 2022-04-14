import React, { useContext } from 'react';

import { StyleSheet, View } from 'react-native';
import { useStore } from 'react-redux';
import { useMessageContext } from 'stream-chat-react-native-core';

import { ChatContext } from 'App';
import { Avatar } from 'components/common';
import { getMember, normalize } from 'utils';

const MessageAvatar: React.FC = () => {
  const { channel } = useContext(ChatContext);
  const state = useStore().getState();
  const member = getMember(channel, state);
  const message = useMessageContext();

  return (
    <View style={styles.messageAvatarContainer}>
      {message.lastGroupMessage === true && (
        <Avatar style={styles.messageAvatar} uri={member?.user?.thumbnail_url as string} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageAvatarContainer: {
    width: normalize(20),
    zIndex: 1,
    bottom: 20,
    marginRight: '2%',
  },
  messageAvatar: {
    borderRadius: 50,
    width: normalize(18),
    height: normalize(18),
  },
});

export default MessageAvatar;
