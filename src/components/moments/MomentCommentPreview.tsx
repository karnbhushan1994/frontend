import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useStore } from 'react-redux';

import { MomentCommentPreviewType, ScreenType, UserType } from 'types';
import { navigateToProfile, normalize } from 'utils';
import { mentionPartTypes, renderTextWithMentions } from 'utils/comments';

interface MomentCommentPreviewProps {
  momentId: string;
  commentsCount: number;
  commentPreview: MomentCommentPreviewType | null;
  screenType: ScreenType;
}

const MomentCommentPreview: React.FC<MomentCommentPreviewProps> = ({
  momentId,
  commentsCount,
  commentPreview,
  screenType,
}) => {
  const navigation = useNavigation();
  const state = useStore().getState();
  const commentCountText =
    !commentsCount || commentsCount === 0 ? 'No Comments' : commentsCount + ' comments';

  return (
    <TouchableOpacity
      style={styles.commentsPreviewContainer}
      onPress={() =>
        navigation.push('MomentCommentsScreen', {
          moment_id: momentId,
          screenType,
        })
      }>
      <Text style={styles.whiteBold}>{commentCountText}</Text>
      {commentPreview && (
        <View style={styles.previewContainer}>
          <Image
            source={{
              uri: commentPreview.commenter.thumbnail_url,
            }}
            style={styles.avatar}
          />
          <Text style={styles.whiteBold} numberOfLines={1}>
            <Text> </Text>
            <Text>{commentPreview.commenter.username}</Text>
            <Text> </Text>
            {renderTextWithMentions({
              value: commentPreview.comment,
              styles: styles.normalFont,
              partTypes: mentionPartTypes('white', 'comment'),
              onPress: (user: UserType) =>
                navigateToProfile(state, useDispatch, navigation, screenType, user),
            })}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  commentsPreviewContainer: {
    height: normalize(50),
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginHorizontal: '5%',
    marginBottom: '2%',
  },
  whiteBold: {
    fontWeight: '700',
    color: 'white',
    fontSize: normalize(13),
  },
  previewContainer: {
    flexDirection: 'row',
    width: '95%',
  },
  avatar: {
    height: normalize(16),
    width: normalize(16),
    borderRadius: 99,
  },
  normalFont: {
    fontWeight: 'normal',
  },
});

export default MomentCommentPreview;
