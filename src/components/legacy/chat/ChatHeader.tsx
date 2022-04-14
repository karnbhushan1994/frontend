
import {TAGG_LIGHT_BLUE_2} from '../../constants';

import React, {useContext} from 'react';

import {useNavigation} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useStore} from 'react-redux';

import {ChatContext} from 'App';
import {Avatar} from 'components/common';
import {ScreenType} from 'types';
import {ChatHeaderHeight, fetchUserX, normalize, StatusBarHeight, userXInStore} from 'utils';
import {formatLastSeenText, getMember, isOnline} from 'utils/messages';

type ChatHeaderProps = {
  screenType: ScreenType;
};

const ChatHeader: React.FC<ChatHeaderProps> = props => {
  const { screenType } = props;
  const { channel } = useContext(ChatContext);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const state = useStore().getState();
  const member = getMember(channel, state);
  const online = isOnline(member?.user?.last_active);
  const lastSeen = formatLastSeenText(member?.user?.last_active);

  const toProfile = async () => {
    if (member && member.user && member.user.username) {
      if (!userXInStore(state, screenType, member.user.id)) {
        await fetchUserX(
          dispatch,
          { userId: member.user.id, username: member.user.username },
          screenType,
        );
      }
      navigation.navigate('Profile', {
        userXId: member.user.id,
        screenType: screenType,
        showShareModalParm: false,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tappables} onPress={toProfile}>
        <View>
          <Avatar style={styles.avatar} uri={member?.user?.thumbnail_url as string} />
          {online && <View style={styles.online} />}
        </View>
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {member?.user?.first_name} {member?.user?.last_name}
          </Text>
          <Text style={styles.lastSeen}>{lastSeen}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ChatHeaderHeight - StatusBarHeight,
    paddingLeft: '15%',
  },
  tappables: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  avatar: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(40) / 2,
  },
  online: {
    position: 'absolute',
    backgroundColor: TAGG_LIGHT_BLUE_2,
    width: normalize(16),
    height: normalize(16),
    borderRadius: normalize(16) / 2,
    borderColor: 'white',
    borderWidth: 3,
    top: 0,
    right: 0,
  },
  content: {
    flex: 1,
    height: '80%',
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginLeft: '5%',
  },
  name: {
    fontWeight: '700',
    fontSize: normalize(15),
    lineHeight: normalize(18),
  },
  lastSeen: {
    color: '#828282',
    fontWeight: '500',
    fontSize: normalize(12),
    lineHeight: normalize(14),
  },
});

export default ChatHeader;
