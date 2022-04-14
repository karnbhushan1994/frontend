
import {TAGG_LIGHT_BLUE_2} from '../../constants';

import React, {useContext, useState} from 'react';

import {useNavigation} from '@react-navigation/core';

import {Image, StyleSheet, Text, View} from 'react-native';
import {RectButton, Swipeable, TouchableOpacity} from 'react-native-gesture-handler';
import {SvgXml} from 'react-native-svg';
import {useStore} from 'react-redux';
import {ChannelPreviewMessengerProps} from 'stream-chat-react-native';

import {ChatContext} from 'App';
import {icons} from 'assets/icons';
import {Avatar} from 'components/common';
import {
    LocalAttachmentType,
    LocalChannelType,
    LocalCommandType,
    LocalEventType,
    LocalMessageType,
    LocalReactionType,
    LocalUserType,
} from '../../../types';
import {normalize, SCREEN_HEIGHT, SCREEN_WIDTH} from 'utils';
import {getMember, isOnline} from 'utils/messages';
import {images} from "assets/images";

const ChannelPreview: React.FC<
  ChannelPreviewMessengerProps<
    LocalAttachmentType,
    LocalChannelType,
    LocalCommandType,
    LocalEventType,
    LocalMessageType,
    LocalReactionType,
    LocalUserType
  >
> = props => {
  const { channel } = props;
  const { setChannel } = useContext(ChatContext);
  const state = useStore().getState();
  const navigation = useNavigation();
  const member = getMember(channel, state);
  const online = isOnline(member?.user?.last_active);
  const unread = channel.state.unreadCount > 0;
  const [isMuted, setIsMuted] = useState(channel.muteStatus().muted);
  const mutedImage = isMuted

    ? images.main.unmute
    : images.main.mute;

  // Hide channel if no message was exchanged
  if (channel.state.messages.length === 0) {
    return null;
  }

  return (
    <Swipeable
      overshootLeft={false}
      overshootRight={false}
      renderRightActions={() => (
        <View style={styles.swipeableContainer}>
          <RectButton
            style={styles.muteButton}
            onPress={() => {
              if (isMuted) {
                channel.unmute();
              } else {
                channel.mute();
              }
              setIsMuted(!isMuted);
            }}>
            <Image source={mutedImage} style={styles.icon} />
            <Text style={styles.actionText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
          </RectButton>
          <RectButton
            style={styles.deleteButton}
            onPress={() => {
              channel.hide();
            }}>
            <SvgXml xml={icons.TrashOutline} style={styles.icon} color={'white'} />
            <Text style={styles.actionText}>Delete</Text>
          </RectButton>
        </View>
      )}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          setChannel(channel);
          navigation.navigate('Chat');
        }}>
        <View>
          <Avatar style={styles.avatar} uri={member?.user?.thumbnail_url as string} />
          {online && <View style={styles.online} />}
        </View>
        <View style={styles.content}>
          <Text style={[styles.name, unread ? styles.unread : {}]} numberOfLines={1}>
            {member?.user?.first_name} {member?.user?.last_name}
          </Text>
          <Text style={[styles.lastMessage, unread ? styles.unread : {}]} numberOfLines={1}>
            {channel.state.messages.length > 0
              ? channel.state.messages[channel.state.messages.length - 1].text
              : ''}
          </Text>
        </View>
        {unread && <View style={styles.purpleDot} />}
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: Math.round(SCREEN_HEIGHT / 9),
    width: Math.round(SCREEN_WIDTH * 0.85),
    alignSelf: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(62) / 2,
  },
  online: {
    position: 'absolute',
    backgroundColor: TAGG_LIGHT_BLUE_2,
    width: normalize(18),
    height: normalize(18),
    borderRadius: normalize(18) / 2,
    borderColor: 'white',
    borderWidth: 2,
    bottom: 0,
    right: 0,
  },
  content: {
    flex: 1,
    height: '60%',
    flexDirection: 'column',
    marginLeft: '5%',
  },
  name: {
    fontWeight: '500',
    fontSize: normalize(14),
    lineHeight: normalize(17),
  },
  lastMessage: {
    color: '#828282',
    fontWeight: '500',
    fontSize: normalize(12),
    lineHeight: normalize(14),
    paddingTop: '5%',
  },
  unread: {
    fontWeight: '700',
    color: 'black',
  },
  purpleDot: {
    backgroundColor: '#8F01FF',
    width: normalize(10),
    height: normalize(10),
    borderRadius: normalize(10) / 2,
    marginLeft: '5%',
  },
  swipeableContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  muteButton: {
    width: 72,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C4C4C4',
  },
  deleteButton: {
    width: 72,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C42634',
  },
  actionText: {
    color: 'white',
    fontSize: normalize(12),
    fontWeight: '500',
    backgroundColor: 'transparent',
    paddingHorizontal: '5%',
    marginTop: '5%',
  },
  icon: {
    width: normalize(25),
    height: normalize(25),
  },
});

export default ChannelPreview;
