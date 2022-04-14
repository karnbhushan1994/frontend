import React, { useEffect, useRef, useState } from 'react';

import { RouteProp } from '@react-navigation/core';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Video from 'react-native-video';

import { MomentTags } from 'components';
import { TagFriendsFooter } from 'components/moments';
import { headerBarOptions, MainStackParams } from 'routes';
import { MomentTagType } from 'types';
import { HeaderHeight, isIPhoneX, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';
import logger from 'utils/logger';

type TagFriendsScreenRouteProps = RouteProp<MainStackParams, 'TagFriendsScreen'>;
interface TagFriendsScreenProps {
  route: TagFriendsScreenRouteProps;
}
const TagFriendsScreen: React.FC<TagFriendsScreenProps> = ({ route }) => {
  const { media, selectedTags } = route.params;
  const screenIsFocused = useIsFocused();
  const navigation = useNavigation();
  const imageRef = useRef(null);
  const [tags, setTags] = useState<MomentTagType[]>([]);
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [bottomBound, setBottomBound] = useState<number>(0);
  const [topHeight, setTopHeight] = useState<number>(0);
  const [topBound, setTopBound] = useState<number>(0);

  /*
   * Update list of tagged users from route params
   */
  useEffect(() => {
    setTags(selectedTags ? selectedTags : []);
  }, [selectedTags]);

  useEffect(() => {
    const title = media.isVideo
      ? ''
      : tags.length === 0
      ? 'Tap on photo to tag friends!'
      : 'Press and drag to move';
    navigation.setOptions({
      ...headerBarOptions('white', title),
      headerRight: () => (
        <TouchableOpacity
          style={styles.buttonContainer}
          // Altering the opacity style of TouchableOpacity doesn't work,
          // so the next two lines are needed
          disabled={tags.length === 0}
          activeOpacity={tags.length === 0 ? 0 : 1}
          onPress={handleDone}>
          <Text
            style={[
              styles.shareButtonTitle,
              // makes the Done buttomn invisible if there are no tags
              // eslint-disable-next-line react-native/no-inline-styles
              { opacity: tags.length !== 0 ? 1 : 0 },
            ]}>
            Done
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [tags]);

  /*
   * Navigate back to Tag Users Screen, send selected users
   */
  const handleDone = () => {
    // Makes sure that this can only be pressed if there are tags
    if (tags.length !== 0) {
      navigation.navigate('CaptionScreen', {
        ...route.params,
        selectedTags: tags,
      });
    }
  };

  const setMediaDimensions = (width: number, height: number) => {
    const imageAspectRatio = width / height;
    const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

    // aspectRatio is wider than or equal to screen
    if (imageAspectRatio >= screenRatio) {
      setImageWidth(SCREEN_WIDTH);
      setImageHeight(SCREEN_WIDTH / imageAspectRatio);
    }
    // aspectRatio is taller than screen
    if (imageAspectRatio < screenRatio) {
      setImageHeight(SCREEN_HEIGHT);
      setImageWidth(SCREEN_HEIGHT * imageAspectRatio);
    }
  };

  /*
   * Calculate boundary (if any) for drag from bottom and top
   */
  useEffect(() => {
    // Bottom dead zone
    if (SCREEN_HEIGHT / 2 - imageHeight / 2 < SCREEN_HEIGHT * 0.15) {
      if (SCREEN_HEIGHT / 2 - imageHeight / 2 < 0) {
        setBottomBound(SCREEN_HEIGHT * 0.15);
      } else {
        setBottomBound(SCREEN_HEIGHT * 0.15 - (SCREEN_HEIGHT / 2 - imageHeight / 2));
      }
    }

    // Top dead zone
    if (SCREEN_HEIGHT / 2 - imageHeight / 2 < topHeight) {
      if (SCREEN_HEIGHT / 2 - imageHeight / 2 < 0) {
        setTopBound(topHeight + 15);
      } else {
        setTopBound(topHeight - (SCREEN_HEIGHT / 2 - imageHeight / 2) + 15);
      }
    }
  }, [imageHeight, imageWidth, topHeight]);

  /*
   * Calculating image width and height with respect to it's enclosing view's dimensions. Only works for images.
   */
  useEffect(() => {
    if (imageRef && imageRef.current && !media.isVideo) {
      Image.getSize(
        media.uri,
        (w, h) => {
          setMediaDimensions(w, h);
        },
        err => logger.log(err),
      );
    }
  }, []);

  return (
    <View style={styles.contentContainer}>
      <View style={[styles.innerContainer, { paddingTop: SCREEN_HEIGHT / 2 - imageHeight / 2 }]}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('TagSelectionScreen', {
              selectedTags: tags,
            })
          }>
          {media.isVideo ? (
            <View
              style={{
                width: imageWidth,
                height: imageHeight,
                marginHorizontal: (SCREEN_WIDTH - imageWidth) / 2,
              }}
              ref={imageRef}>
              <Video
                style={{
                  width: imageWidth,
                  height: imageHeight,
                }}
                source={{ uri: media.uri }}
                ignoreSilentSwitch={'ignore'}
                repeat={true}
                paused={!screenIsFocused}
                onLoad={response => {
                  const { width, height, orientation } = response.naturalSize;
                  // portrait will flip width and height
                  if (orientation === 'portrait') {
                    setMediaDimensions(height, width);
                  } else {
                    setMediaDimensions(width, height);
                  }
                }}
              />
            </View>
          ) : (
            <Image
              ref={imageRef}
              style={{
                width: imageWidth,
                height: imageHeight,
                marginHorizontal: (SCREEN_WIDTH - imageWidth) / 2,
              }}
              source={{ uri: media.uri }}
            />
          )}
        </TouchableWithoutFeedback>
      </View>
      <View
        style={styles.titleContainer}
        onLayout={event => {
          const { y, height } = event.nativeEvent.layout;
          setTopHeight(y + height);
        }}
      />
      {tags.length !== 0 && !media.isVideo && (
        <MomentTags
          tags={tags}
          setTags={setTags}
          editing={true}
          imageRef={imageRef}
          deleteFromList={user => setTags(tags.filter(tag => tag.user.id !== user.id))}
          boundaries={{ top: topBound, bottom: bottomBound }}
        />
      )}
      {tags.length !== 0 && (
        <View style={styles.footerContainer}>
          <TagFriendsFooter tags={tags} setTags={setTags} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'black',
    height: SCREEN_HEIGHT,
    alignContent: 'center',
  },
  button: {
    zIndex: 9999,
  },
  buttonContainer: {
    right: 20,
  },
  shareButtonTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    zIndex: 9999,
  },
  header: {
    marginTop: isIPhoneX() ? HeaderHeight : '10%',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  footerContainer: {
    marginTop: '3%',
    backgroundColor: 'black',
    padding: '5%',
    flexDirection: 'column',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    position: 'absolute',
    paddingBottom: 0,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.15,
  },
  innerContainer: {
    position: 'absolute',
  },
});

export default TagFriendsScreen;
