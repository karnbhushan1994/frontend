import React, { useContext, useEffect, useMemo, useState } from 'react';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChannelPreview, MessagesHeader } from 'components/messages';
import { Alert, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { useStore } from 'react-redux';
import { ChannelList, Chat } from 'stream-chat-react-native';

import { ChatContext } from 'App';
import { TabsGradient } from 'components';
import EmptyContentView from 'components/common/EmptyContentView';
import { MainStackParams } from 'routes';
import { RootState } from 'store/rootReducer';
import {
  LocalAttachmentType,
  LocalChannelType,
  LocalCommandType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType,
} from 'types';

import { connectChatAccount, HeaderHeight } from 'utils';

import NewChatModal from './NewChatModal';

type ChatListScreenNavigationProp = StackNavigationProp<MainStackParams, 'ChatList'>;
interface ChatListScreenProps {
  navigation: ChatListScreenNavigationProp;
}
/*
 * Screen that displays all of the user's active conversations.
 */
const ChatListScreen: React.FC<ChatListScreenProps> = () => {
  const { chatClient } = useContext(ChatContext);
  const [modalVisible, setChatModalVisible] = useState(false);
  const state: RootState = useStore().getState();
  const loggedInUserId = state.user.user.userId;
  const tabbarHeight = useBottomTabBarHeight();

  const memoizedFilters = useMemo(
    () => ({
      members: { $in: [loggedInUserId] },
      type: 'messaging',
    }),
    [],
  );

  const chatTheme = {
    channelListMessenger: {
      flatListContent: {
        backgroundColor: 'white',
        paddingBottom: tabbarHeight + HeaderHeight + 20,
      },
    },
  };

  useEffect(() => {
    if (loggedInUserId) {
      connectChatAccount(loggedInUserId, chatClient)
        .then(success => {
          if (!success) {
            Alert.alert('Something wrong with chat');
          }
        })
        .catch(err => {
          logger.log('Error connecting to chat: ', err);
          Alert.alert('Something wrong with chat');
        });
    }
  }, [loggedInUserId]);

  return (
    <View style={styles.background}>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        <MessagesHeader
          createChannel={() => {
            setChatModalVisible(true);
          }}
        />
        <Chat client={chatClient} style={chatTheme}>
          <View style={styles.chatContainer}>
            <ChannelList<
              LocalAttachmentType,
              LocalChannelType,
              LocalCommandType,
              LocalEventType,
              LocalMessageType,
              LocalReactionType,
              LocalUserType
            >
              filters={memoizedFilters}
              options={{
                presence: true,
                state: true,
                watch: true,
              }}
              sort={{ last_message_at: -1 }}
              maxUnreadCount={99}
              Preview={ChannelPreview}
              EmptyStateIndicator={() => <EmptyContentView viewType={'ChatList'} />}
            />
          </View>
        </Chat>
        <NewChatModal {...{ modalVisible, setChatModalVisible }} />
      </SafeAreaView>
      <TabsGradient />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#CCE4FC',
    padding: 15,
    borderRadius: 5,
  },
  chatContainer: {
    height: '100%',
    marginTop: 10,
  },
});

export default ChatListScreen;
