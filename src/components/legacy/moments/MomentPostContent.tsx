import React, { useContext, useEffect, useRef, useState } from 'react';

import { useNavigation } from '@react-navigation/native';

import { Image, StyleSheet, Text, View, ViewProps } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, { EasingNode } from 'react-native-reanimated';
import Video from 'react-native-video';
import { useDispatch, useStore } from 'react-redux';

import { AddComment } from 'components/comments';
import { MomentTags } from 'components/common';

import { MomentContext } from 'screens/profile/IndividualMoment';
import { RootState } from 'store/rootReducer';
import {
  MomentCommentPreviewType,
  MomentPostType,
  MomentTagType,
  ScreenType,
  UserType,
} from 'types';
import {
  getLoggedInUserAsProfilePreview,
  getTimePosted,
  navigateToProfile,
  normalize,
  SCREEN_WIDTH,
} from 'utils';
import { mentionPartTypes, renderTextWithMentions } from 'utils/comments';

import MomentCommentPreview from '../MomentCommentPreview';
import {images} from "assets/images";

interface MomentPostContentProps extends ViewProps {
  screenType: ScreenType;
  moment: MomentPostType;
  momentTags: MomentTagType[];
}
const MomentPostContent: React.FC<MomentPostContentProps> = ({
  screenType,
  moment,
  style,
  momentTags,
}) => {
  const [tags, setTags] = useState<MomentTagType[]>(momentTags);
  const state: RootState = useStore().getState();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const imageRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [fadeValue, setFadeValue] = useState<Animated.Value<number>>(new Animated.Value(0));
  const [commentCount, setCommentCount] = useState<number>(moment.comments_count);
  const [commentPreview, setCommentPreview] = useState<MomentCommentPreviewType | null>(
    moment.comment_preview,
  );
  const { keyboardVisible } = useContext(MomentContext);
  const [hideText, setHideText] = useState(false);
  const isVideo = !(
    moment.moment_url.endsWith('jpg') ||
    moment.moment_url.endsWith('JPG') ||
    moment.moment_url.endsWith('PNG') ||
    moment.moment_url.endsWith('png')
  );

  useEffect(() => {
    setTags(momentTags);
  }, [momentTags]);

  useEffect(() => {
    const fade = async () => {
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 250,
        easing: EasingNode.linear,
      }).start();
    };
    fade();
  }, [fadeValue]);

  useEffect(() => {
    if (!keyboardVisible && hideText) {
      setHideText(false);
    }
  }, [keyboardVisible, hideText]);
  return (
    <View style={[styles.container, style]}>
      <TouchableWithoutFeedback
        onPress={() => {
          setVisible(!visible);
          setFadeValue(new Animated.Value(0));
        }}>
        {isVideo ? (
          <View ref={imageRef}>
            <Video
              // ref={imageRef}
              source={{
                uri: moment.moment_url,
              }}
              // HLS m3u8 version
              // source={{
              //   uri: 'https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8',
              // }}
              // mp4 version
              // source={{
              //   uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              // }}
              volume={1}
              style={styles.image}
              repeat={true}
            />
          </View>
        ) : (
          <Image
            ref={imageRef}
            style={styles.image}
            source={{ uri: moment.moment_url }}
            resizeMode={'cover'}
          />
        )}
        {tags.length > 0 && (
          <Image source={images.main.tag_indicate} style={styles.tagIcon} />
        )}
      </TouchableWithoutFeedback>
      {visible && (
        <Animated.View style={[styles.tapTag, { opacity: fadeValue }]}>
          <MomentTags editing={false} tags={tags} setTags={() => null} imageRef={imageRef} />
        </Animated.View>
      )}
      {!hideText && (
        <>
          {moment.caption !== '' &&
            renderTextWithMentions({
              value: moment.caption,
              styles: styles.captionText,
              partTypes: mentionPartTypes('white', 'caption'),
              onPress: (user: UserType) =>
                navigateToProfile(state, dispatch, navigation, screenType, user),
            })}
          <MomentCommentPreview
            momentId={moment.moment_id}
            commentsCount={commentCount}
            commentPreview={commentPreview}
            screenType={screenType}
          />
        </>
      )}
      <AddComment
        placeholderText={'Add a comment here!'}
        momentId={moment.moment_id}
        callback={message => {
          setCommentPreview({
            commenter: getLoggedInUserAsProfilePreview(state),
            comment: message,
          });
          setCommentCount(commentCount + 1);
        }}
        onFocus={() => {
          setHideText(true);
        }}
        isKeyboardAvoiding={false}
        theme={'dark'}
      />
      <Text style={styles.text}>{getTimePosted(moment.date_created)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: SCREEN_WIDTH,
    aspectRatio: 1,
    marginBottom: '3%',
  },
  text: {
    marginHorizontal: '5%',
    color: 'white',
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 5,
  },
  captionText: {
    position: 'relative',
    marginHorizontal: '5%',
    color: '#ffffff',
    fontWeight: '500',
    fontSize: normalize(13),
    lineHeight: normalize(15.51),
    letterSpacing: normalize(0.6),
    marginBottom: normalize(18),
  },
  tapTag: {
    position: 'absolute',
  },
  tagIcon: {
    width: normalize(30),
    height: normalize(30),
    position: 'absolute',
    bottom: '7%',
    left: normalize(20),
  },
});
export default MomentPostContent;
