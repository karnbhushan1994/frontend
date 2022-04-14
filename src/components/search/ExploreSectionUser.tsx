import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewProps,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { loadImageFromURL } from 'services';
import { RootState } from 'store/rootReducer';
import { ProfilePreviewType, ScreenType } from 'types';
import { fetchUserX, normalize, userXInStore } from 'utils';

import { Avatar } from '../common';

/**
 * Search Screen for user recommendations and a search
 * tool to allow user to find other users
 */

interface ExploreSectionUserProps extends ViewProps {
  user: ProfilePreviewType;
  externalStyles?: Record<string, StyleProp<ViewStyle | TextStyle>>;
  screenType?: ScreenType;
}
const ExploreSectionUser: React.FC<ExploreSectionUserProps> = ({
  user,
  externalStyles,
  screenType,
}) => {
  const { id, username, first_name, last_name } = user;
  const [avatar, setAvatar] = useState<string>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { user: loggedInUser } = useSelector((state: RootState) => state.user);
  const state: RootState = useStore().getState();

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const response = await loadImageFromURL(user.thumbnail_url);
      if (response) {
        setAvatar(response);
      }
    })();
  }, []);

  const handlePress = async () => {
    if (screenType && !userXInStore(state, screenType, user.id)) {
      await fetchUserX(dispatch, { userId: user.id, username: user.username }, screenType);
    }
    const userXId = loggedInUser.username === user.username ? undefined : id;
    navigation.push('Profile', {
      userXId,
      screenType,
    });
  };
  return (
    <TouchableOpacity style={[styles.container, externalStyles?.container]} onPress={handlePress}>
      <LinearGradient
        colors={['#9F00FF', '#27EAE9']}
        useAngle
        angle={90}
        angleCenter={{ x: 0.5, y: 0.5 }}
        style={styles.gradient}>
        <Avatar style={styles.profile} uri={avatar} />
      </LinearGradient>
      <Text style={[styles.name, externalStyles?.name]} numberOfLines={2}>
        {first_name} {last_name}
      </Text>
      <Text
        style={[styles.username, externalStyles?.username]}
        numberOfLines={1}>{`@${username}`}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 100,
    paddingVertical: 10,
  },
  gradient: {
    height: 62,
    aspectRatio: 1,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profile: {
    height: 55,
    aspectRatio: 1,
    borderRadius: 38,
  },
  name: {
    fontWeight: '600',
    flexWrap: 'wrap',
    fontSize: normalize(14),
    lineHeight: normalize(15),
    color: '#fff',
    textAlign: 'center',
  },
  username: {
    fontWeight: '500',
    fontSize: normalize(11),
    lineHeight: normalize(15),
    color: '#fff',
  },
});
export default ExploreSectionUser;
