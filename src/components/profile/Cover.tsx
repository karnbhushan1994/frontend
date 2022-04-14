import React, { useState, useEffect } from 'react';

import { useIsFocused } from '@react-navigation/native';
import { Image, StyleSheet, View, TouchableOpacity, Text, ImageBackground } from 'react-native';

import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { loadUserData, resetHeaderAndProfileImage } from 'store/actions';
import { ScreenType } from 'types';
import { normalize, patchProfile, validateImageLink } from 'utils';

import { COVER_HEIGHT, IMAGE_WIDTH } from '../../constants';

import { RootState } from '../../store/rootReducer';

interface CoverProps {
  userXId: string | undefined;
  screenType: ScreenType;
}
const Cover: React.FC<CoverProps> = ({ userXId, screenType }) => {
  const dispatch = useDispatch();
  const { cover, user } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );

  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validImage, setValidImage] = useState<boolean>(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    checkCover(cover);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkCover(cover);
  }, [cover, isFocused]);

  useEffect(() => {
    checkCover(cover);
    if (needsUpdate) {
      const userId = user.userId;
      const username = user.username;
      dispatch(resetHeaderAndProfileImage());
      dispatch(loadUserData({ userId, username }));
    }
  }, [dispatch, needsUpdate]);

  const handleNewImage = async () => {
    setLoading(true);
    const result = await patchProfile('header', user.userId);
    setLoading(true);
    if (result) {
      setUpdating(true);
      setNeedsUpdate(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const checkCover = async (url: string | undefined) => {
    const valid = await validateImageLink(url);
    if (valid !== validImage) {
      setValidImage(valid);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        defaultSource={require('../../assets/images/main/cover-placeholder.png')}
        source={{ uri: cover, cache: 'reload' }}>
        {loading && (
          <Image
            source={require('../../assets/gifs/loading-animation.gif')}
            style={styles.loadingLarge}
          />
        )}
        {!validImage && userXId === undefined && !loading && !updating && (
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="ADD HEADER PICTURE"
            onPressIn={() => handleNewImage()}>
            <SvgXml xml={icons.GreyPurplePlus} style={styles.plus} />
            <Text style={styles.text}>Add Picture</Text>
          </TouchableOpacity>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: IMAGE_WIDTH,
    height: COVER_HEIGHT,
  },
  plus: {
    position: 'absolute',
    top: 75,
    right: 125,
  },
  text: {
    color: 'white',
    position: 'absolute',
    fontSize: normalize(16),
    top: 80,
    right: 20,
  },
  touch: {
    flex: 1,
  },
  loadingLarge: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: COVER_HEIGHT * 0.2,
    width: IMAGE_WIDTH * 0.2,
    aspectRatio: 1,
    top: 100,
  },
});
export default Cover;
