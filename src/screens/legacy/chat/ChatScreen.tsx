import React, { useCallback, useContext, useEffect } from 'react';

import { useFocusEffect } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Channel,
  Chat,
  DeepPartial,
  MessageInput,
  MessageList,
  Theme,
  useAttachmentPickerContext,
} from 'stream-chat-react-native';

import { ChatContext } from 'App';
import {
  ChatHeader,
  ChatInput,
  DateHeader,
  MessageAvatar,
  MessageFooter,
  TypingIndicator,
} from 'components';
import { TAGG_LIGHT_BLUE_2 } from '../../../constants/constants';
import { MainStackParams } from 'routes';
import { ScreenType } from 'types';
import { HeaderHeight, normalize, SCREEN_WIDTH } from 'utils';

type ChatScreenNavigationProp = StackNavigationProp<MainStackParams, 'Chat'>;
interface ChatScreenProps {
  navigation: ChatScreenNavigationProp;
}
/*
 * Screen that displays all of the user's active conversations.
 */
const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const { channel, chatClient } = useContext(ChatContext);
  const { setTopInset } = useAttachmentPickerContext();
  const insets = useSafeAreaInsets();
  const chatTheme: DeepPartial<Theme> = {
    colors: {
      accent_blue: TAGG_LIGHT_BLUE_2,
    },
    messageList: {
      container: {
        backgroundColor: 'white',
        width: SCREEN_WIDTH * 0.95,
        alignSelf: 'center',
      },
    },
    messageInput: {
      container: {
        backgroundColor: '#f8f8f8',
        height: 70,
      },
      inputBox: {
        fontSize: 16,
      },
    },
    avatar: {
      container: {
        borderRadius: 10,
        width: normalize(18),
        height: normalize(18),
      },
    },
    messageSimple: {
      avatarWrapper: {
        container: {
          width: normalize(20),
          zIndex: 1,
          bottom: 20,
        },
      },
      container: {
        paddingTop: 8,
        flexDirection: 'row',
      },
      content: {
        deletedContainer: {},
        deletedContainerInner: {
          borderColor: 'transparent',
          borderBottomLeftRadius: 10,
          borderTopLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
        },
        deletedMetaText: {
          paddingHorizontal: 10,
        },
        deletedText: {
          em: {
            fontSize: 15,
            fontStyle: 'italic',
            fontWeight: '400',
          },
        },
        metaContainer: {
          marginLeft: 5,
        },
        container: {},
        containerInner: {
          backgroundColor: '#E4F0F2',
          borderColor: 'transparent',
          borderBottomLeftRadius: 10,
          borderTopLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
        },
        markdown: {
          text: {
            fontSize: 16,
          },
        },
      },
      status: {
        statusContainer: {},
      },
    },
  };

  const loggedInUsersMessageTheme = {
    messageSimple: {
      content: {
        containerInner: {
          backgroundColor: '#DEE6F4',
        },
        container: {
          left: 0,
        },
      },
    },
  };

  useEffect(() => {
    setTopInset(insets.top + HeaderHeight);
  });

  //Function to get the parent TabBar navigator and setting the option for this screen.
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarVisible: false,
      });
      return () => {
        navigation.getParent()?.setOptions({
          tabBarVisible: true,
        });
      };
    }, [navigation]),
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        styles.textBoxStyles, // Update : removed hacky soln for a common height. Original : unable to figure out the padding issue, a hacky solution {paddingBottom: isIPhoneX() ? tabbarHeight + 20 : tabbarHeight + 50},
      ]}>
      <ChatHeader screenType={ScreenType.Chat} />
      <Chat client={chatClient} style={chatTheme}>
        <Channel
          channel={channel}
          keyboardVerticalOffset={0}
          OverlayReactionList={() => null}
          messageActions={({ copyMessage, deleteMessage }) => [copyMessage, deleteMessage]}
          InlineDateSeparator={DateHeader}
          StickyHeader={() => null}
          ScrollToBottomButton={() => null}
          MessageFooter={MessageFooter}
          TypingIndicator={TypingIndicator}
          myMessageTheme={loggedInUsersMessageTheme}
          MessageAvatar={MessageAvatar}>
          <MessageList onThreadSelect={() => {}} />
          <MessageInput Input={ChatInput} />
        </Channel>
      </Chat>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  textBoxStyles: { paddingBottom: 60 },
});

export default ChatScreen;
