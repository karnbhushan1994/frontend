import React, { Fragment, useContext, useEffect, useState } from 'react';

import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { SvgXml } from 'react-native-svg';

import { ChatContext } from 'App';
import { icons } from 'assets/icons';
import { normalize } from 'utils';

type MessagesHeaderProps = {
  createChannel: () => void;
};

const MessagesHeader: React.FC<MessagesHeaderProps> = ({ createChannel }) => {
  const { chatClient } = useContext(ChatContext);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const newCount = chatClient.user?.total_unread_count as number;
    if (newCount) {
      setUnread(newCount);
    }
    const listener = chatClient?.on(e => {
      if (e.total_unread_count) {
        setUnread(e.total_unread_count);
      }
    });

    return () => {
      if (listener) {
        listener.unsubscribe();
      }
    };
  }, [chatClient]);

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Messages</Text>
      {unread !== 0 ? (
        <Text style={styles.unreadText}>{unread > 99 ? '99+' : unread} unread</Text>
      ) : (
        <Fragment />
      )}
      <View style={styles.flex} />
      <TouchableOpacity style={styles.compose} onPress={createChannel}>
        <SvgXml xml={icons.Compose} width={normalize(20)} height={normalize(20)} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    marginHorizontal: '8%',
    marginTop: '5%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontWeight: '700',
    fontSize: normalize(18),
    lineHeight: normalize(21),
  },
  unreadText: {
    color: '#8F01FF',
    marginLeft: 10,
    fontWeight: '700',
    lineHeight: normalize(17),
    fontSize: normalize(14),
  },
  compose: {},
});

export default MessagesHeader;
