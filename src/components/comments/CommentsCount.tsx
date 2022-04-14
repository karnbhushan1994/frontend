import React, { useState } from 'react';

// import { useNavigation } from '@react-navigation/core';
import { Image, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { icons } from 'assets/icons';
import { AnalyticCategory, AnalyticVerb, ScreenType } from 'types';
import { normalize, track } from 'utils';

import CommentMomentDrawer from '../moments/CommentMomentDrawer';

interface CommentsCountProps {
  momentId: string;
  count: number;
  screenType: ScreenType | undefined;
  onPressCallback: () => void;
  momentuserid: string;
  isOpenDrawer: boolean;
}

const CommentsCount: React.FC<CommentsCountProps> = ({
  momentId,
  count,
  screenType,
  onPressCallback,
  momentuserid,
  isOwnProfile,
  moment,
  isOpenDrawer,
}) => {
  const [updatedCommentLength] = useState<number>(0);
  const [shareMoment, setShareMoment] = useState<boolean>(isOpenDrawer);

  return (
    <TouchableOpacity
      style={styles.countContainer}
      disabled={!screenType}
      onPress={() => {
        if (screenType) {
          track('CommentsButton', AnalyticVerb.Pressed, AnalyticCategory.Moment, {
            momentId,
          });
          // navigation.navigate('MomentCommentsScreen', {
          //   moment_id: momentId,
          //   screenType,
          //   getLatestCount: commentCount => {
          //     setupdatedCommentLength(commentCount);
          //   },
          // });

          setShareMoment(true);
          console.log(screenType);
          onPressCallback();
        }
      }}>
      {screenType && (
        <CommentMomentDrawer
          momentuserid={momentuserid}
          isOpen={shareMoment}
          setIsOpen={setShareMoment}
          momentId={momentId}
          commentCount={count}
          screenType={screenType}
          isOwnProfile={isOwnProfile}
          moment={moment}
        />
      )}
      <Image source={icons.MomentComment} style={styles.momentComment} />
      <Text style={styles.count}>
        {updatedCommentLength + count === 0
          ? 'Comment'
          : updatedCommentLength > count
          ? updatedCommentLength
          : count}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  countContainer: {
    minWidth: 70,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(24),
  },
  count: {
    fontWeight: '600',
    fontSize: normalize(12),
    lineHeight: normalize(16),
    letterSpacing: normalize(0.05),
    textAlign: 'center',
    color: 'white',
    marginTop: normalize(4),
  },
  momentComment: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
export default CommentsCount;
