import React from 'react';

import moment from 'moment';

import { View, Text, Image, StyleSheet } from 'react-native';
import { useMessageContext } from 'stream-chat-react-native-core';

import { normalize } from 'utils';

const MessageFooter: React.FC = () => {
  const message = useMessageContext();

  if (message.message.type === 'deleted') {
    return <></>;
  } else {
    const printTime = moment(message.message.created_at).format('h:mmA');
    if (message.lastGroupMessage) {
      return (
        <View
          style={[
            message.isMyMessage ? styles.userMessage : styles.userXMessage,
            styles.generalMessage,
          ]}>
          {readReceipts(message)}
          <Text style={styles.time}>{printTime}</Text>
        </View>
      );
    } else {
      return <></>;
    }
  }
};

const readReceipts = message => {
  const readByLocal = message.message.readBy;
  if (message.isMyMessage) {
    if (readByLocal) {
      return <Image source={require('assets/icons/messages/read_icon.png')} style={styles.icon} />;
    } else if (message.message.status === 'received') {
      return (
        <Image source={require('assets/icons/messages/delivered_icon.png')} style={styles.icon} />
      );
    } else if (message.message.status === 'sending') {
      return <Image source={require('assets/icons/messages/sent_icon.png')} style={styles.icon} />;
    } else {
      return <></>;
    }
  }
};

export const styles = StyleSheet.create({
  time: {
    fontSize: normalize(11),
    color: '#7A7A7A',
    lineHeight: normalize(13),
  },
  userMessage: {
    marginRight: 5,
  },
  userXMessage: { marginLeft: 5 },
  generalMessage: { marginTop: 4, flexDirection: 'row' },
  icon: { width: 15, height: 15 },
});

export default MessageFooter;
