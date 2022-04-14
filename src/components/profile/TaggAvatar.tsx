import React, { useEffect, useState } from 'react';

import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { loadUserData, resetHeaderAndProfileImage } from 'store/actions';
import { ScreenType } from 'types';
import { patchProfile, validateImageLink } from 'utils';

import { RootState } from '../../store/rootReducer';
import { Avatar } from '../common';

const PROFILE_DIM = 100;

interface TaggAvatarProps {
  style?: object;
  userXId: string | undefined;
  screenType: ScreenType;
  editable: boolean;
}
const TaggAvatar: React.FC<TaggAvatarProps> = ({
  style,
  screenType,
  userXId,
  editable = false,
}) => {
  const { avatar, user } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );
  const dispatch = useDispatch();
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validImage, setValidImage] = useState<boolean>(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    checkAvatar(avatar);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAvatar(avatar);
  }, [avatar, isFocused]);

  useEffect(() => {
    checkAvatar(avatar);
    if (needsUpdate) {
      const userId = user.userId;
      const username = user.username;
      dispatch(resetHeaderAndProfileImage());
      dispatch(loadUserData({ userId, username }));
    }
  }, [dispatch, needsUpdate]);

  const handleNewImage = async () => {
    setLoading(true);
    const result = await patchProfile('profile', user.userId);
    setLoading(true);
    if (result) {
      setUpdating(true);
      setNeedsUpdate(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const checkAvatar = async (url: string | undefined) => {
    const valid = await validateImageLink(url);
    if (valid !== validImage) {
      setValidImage(valid);
    }
  };

  return (
    <>
      <Avatar
        style={[styles.image, style]}
        uri={avatar}
        loading={loading}
        loadingStyle={styles.loadingLarge}
      />
      {editable && !validImage && userXId === undefined && !loading && !updating && (
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="ADD PROFILE PICTURE"
          onPressIn={() => handleNewImage()}>
          <SvgXml xml={icons.PurplePlus} style={styles.plus} />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    height: PROFILE_DIM,
    width: PROFILE_DIM,
    borderRadius: PROFILE_DIM / 2,
    overflow: 'hidden',
  },
  plus: {
    position: 'absolute',
    bottom: 35,
    right: 0,
  },
  loadingLarge: {
    height: PROFILE_DIM * 0.8,
    width: PROFILE_DIM * 0.8,
    alignSelf: 'center',
    justifyContent: 'center',
    aspectRatio: 2,
  },
});

export default TaggAvatar;
