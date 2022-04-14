import React, { useContext, useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { ChatContext } from 'App';
import { Avatar } from 'components';
import { ERROR_FAILED_TO_CREATE_CHANNEL } from '../../../constants/strings';
import { loadImageFromURL } from 'services';
import { ProfilePreviewType, UserType } from 'types';
import { createChannel, normalize, SCREEN_WIDTH } from 'utils';

interface ChatResults {
  profileData: ProfilePreviewType;
  loggedInUser: UserType;
  setChatModalVisible: (open: boolean) => void;
}

const ChatResultsCell: React.FC<ChatResults> = ({
  profileData: { id, username, first_name, last_name, thumbnail_url },
  loggedInUser,
  setChatModalVisible,
}) => {
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const { chatClient, setChannel } = useContext(ChatContext);

  useEffect(() => {
    (async () => {
      if (thumbnail_url !== undefined) {
        try {
          const response = await loadImageFromURL(thumbnail_url);
          if (response) {
            setAvatar(response);
          }
        } catch (error) {
          logger.log('Error while downloading ', error);
          throw error;
        }
      }
    })();
  }, [thumbnail_url]);

  const navigation = useNavigation();
  const createChannelIfNotPresentAndNavigate = async () => {
    try {
      setChatModalVisible(false);
      const channel = await createChannel(loggedInUser.userId, id, chatClient);
      setChannel(channel);
      setTimeout(() => {
        navigation.navigate('Chat');
      }, 250);
    } catch (error) {
      Alert.alert(ERROR_FAILED_TO_CREATE_CHANNEL);
    }
  };

  const userCell = () => (
    <TouchableOpacity onPress={createChannelIfNotPresentAndNavigate} style={styles.cellContainer}>
      <Avatar style={styles.imageContainer} uri={avatar} />
      <View style={[styles.initialTextContainer, styles.multiText]}>
        <Text style={styles.initialTextStyle}>{`@${username}`}</Text>
        <Text style={styles.secondaryTextStyle}>{first_name + ' ' + last_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return userCell();
};

const styles = StyleSheet.create({
  cellContainer: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingVertical: 15,
    width: SCREEN_WIDTH,
  },
  imageContainer: {
    width: SCREEN_WIDTH * 0.112,
    height: SCREEN_WIDTH * 0.112,
    borderRadius: (SCREEN_WIDTH * 0.112) / 2,
  },
  categoryBackground: {
    backgroundColor: 'rgba(196, 196, 196, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: '40%',
    height: '40%',
  },
  initialTextContainer: {
    marginLeft: SCREEN_WIDTH * 0.08,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  initialTextStyle: {
    fontWeight: '500',
    fontSize: normalize(14),
  },
  secondaryTextStyle: {
    fontWeight: '500',
    fontSize: normalize(12),
    color: '#828282',
  },
  multiText: { justifyContent: 'space-between' },
});

export default ChatResultsCell;
