import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';

import crashlytics from '@react-native-firebase/crashlytics';
import { useNavigation } from '@react-navigation/native';
import { Alert, Animated, StyleSheet } from 'react-native';
import { Text, View } from 'react-native-animatable';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { icons } from 'assets/icons';
import { CommentContext } from 'screens/profile/MomentCommentsScreen';
import { deleteComment, getCommentsCount, handleLikeUnlikeComment } from 'services';
import { RootState } from 'store/rootReducer';
import { CommentThreadType, CommentType, ScreenType, UserType } from 'types';
import { getTimePosted, navigateToProfile, normalize } from 'utils';
import { mentionPartTypes, renderTextWithMentions } from 'utils/comments';

import { hapticFeedback } from 'utils/hapticFeedback';

import { TAGG_LIGHT_BLUE } from '../../constants';
import { ERROR_FAILED_TO_DELETE_COMMENT } from '../../constants/strings';

import { LikeButton } from '../common';
import { ProfilePreview } from '../profile';
import { MomentMoreInfoDrawer } from '../profile';
import CommentsContainer from './CommentsContainer';

/**
 * Displays users's profile picture, comment posted by them and the time difference between now and when a comment was posted.
 */

interface CommentTileProps {
  commentObject: CommentType | CommentThreadType;
  screenType: ScreenType;
  isThread: boolean;
  shouldUpdateParent: boolean;
  setShouldUpdateParent: (update: boolean) => void;
  canDelete: boolean;
  moment_user_id: string;
  myMoment: boolean;
  moment: any;
  isOwnProfile: boolean;
  setIsOpen: (update: boolean) => void;
}

const CommentTile: React.FC<CommentTileProps> = ({
  commentObject,
  screenType,
  setShouldUpdateParent,
  shouldUpdateParent,
  canDelete,
  isThread,
  moment_user_id,
  setIsOpen,
  moment,
  myMoment,
}) => {
  const { setCommentTapped } = useContext(CommentContext);
  const timePosted = getTimePosted(commentObject.date_created);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [shouldUpdateChild, setShouldUpdateChild] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [liked, setLiked] = useState(commentObject.user_reaction !== null);
  const swipeRef = useRef<Swipeable>(null);
  const { replyPosted } = useSelector((state: RootState) => state.user);
  const state: RootState = useStore().getState();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (shouldUpdateParent) {
      setShouldUpdateChild(true);
    }
  }, [shouldUpdateParent]);

  useEffect(() => {
    if (replyPosted && !isThread) {
      if (replyPosted.parent_comment.comment_id === commentObject.comment_id) {
        setShowReplies(true);
      }
    }
  }, [replyPosted]);

  const toggleAddComment = () => {
    setCommentTapped(commentObject);
    setShowKeyboard(!showKeyboard);
  };

  const toggleReplies = async () => {
    if (showReplies && isThread) {
      const comment = (commentObject as CommentThreadType).parent_comment;
      //To update count of replies in case we deleted a reply
      comment.replies_count = parseInt(await getCommentsCount(comment.comment_id, true), 10);
    }
    setShouldUpdateChild(true);
    setShowReplies(!showReplies);
  };

  /**
   * Method to compute text to be shown for replies button
   */
  const getRepliesText = (comment: CommentType) =>
    showReplies
      ? 'Hide '
      : comment.replies_count > 0
      ? `Replies (${comment.replies_count}) `
      : 'Replies';

  const renderRightAction = (text: string, color: string) => {
    const pressHandler = async () => {
      swipeRef.current?.close();
      const success = await deleteComment(commentObject.comment_id, isThread);
      if (success) {
        setShouldUpdateParent(true);
      } else {
        Alert.alert(ERROR_FAILED_TO_DELETE_COMMENT);
      }
    };
    return (
      <Animated.View>
        <RectButton style={[styles.rightAction, { backgroundColor: color }]} onPress={pressHandler}>
          <SvgXml
            xml={icons.TrashOutline}
            width={normalize(25)}
            height={normalize(25)}
            color={'white'}
          />
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };
  const renderReportAction = (text: string, color: string) => {
    const pressHandler = async () => {
      swipeRef.current?.close();
      setDrawerVisible(true);
      // const success = await deleteComment(commentObject.comment_id, isThread);
      // if (success) {
      //   setShouldUpdateParent(true);
      // } else {
      //   Alert.alert(ERROR_FAILED_TO_DELETE_COMMENT);
      // }
    };

    return (
      <Animated.View>
        <RectButton style={[styles.rightAction, { backgroundColor: color }]} onPress={pressHandler}>
          <SvgXml xml={icons.Report} width={normalize(25)} height={normalize(25)} color={'white'} />
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (_: Animated.AnimatedInterpolation) =>
    canDelete || myMoment ? (
      <>
        <View style={styles.swipeActions}>{renderRightAction('Delete', '#c42634')}</View>
        {!canDelete && (
          <View style={styles.swipeActions}>{renderReportAction('Report', '#c4c4c4')}</View>
        )}
      </>
    ) : (
      <View style={styles.swipeActions}>{renderReportAction('Report', '#c4c4c4')}</View>
    );

  const onPressLikeButton = () => {
    handleLikeUnlikeComment(commentObject, liked);
    !liked && hapticFeedback('keyboardPress');
    crashlytics().log('comment like pressed with haptoc feedback.');
  };
  const onCommentPress = (user: UserType) => {
    setIsOpen(false);
    navigateToProfile(state, dispatch, navigation, screenType, user);
  };
  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      friction={2}
      containerStyle={styles.swipableContainer}>
      <View style={[styles.container, isThread ? styles.moreMarginWithThread : {}]}>
        <View style={styles.commentHeaderContainer}>
          <ProfilePreview
            profilePreview={commentObject.commenter}
            previewType={'Comment'}
            screenType={screenType}
            userIcon={true}
            moment_user_id={moment_user_id}
            setIsOpen={setIsOpen}
          />
          <View style={styles.likeContainer}>
            <LikeButton
              liked={liked}
              setLiked={setLiked}
              onPress={onPressLikeButton}
              style={styles.likeButton}
            />
            <Text style={styles.likeCount}>
              {commentObject.user_reaction !== null
                ? commentObject.reaction_count + (liked ? 0 : -1)
                : commentObject.reaction_count + (liked ? 1 : 0)}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.body} onPress={toggleAddComment}>
          {renderTextWithMentions({
            value: commentObject.comment,
            styles: styles.comment,
            partTypes: mentionPartTypes('blue'),
            onPress: (user: UserType) => onCommentPress(user),
          })}
          <View style={styles.commentInfoContainer}>
            <View style={styles.row}>
              <SvgXml xml={icons.ClockIcon01} style={styles.clockIcon} />
              <Text style={styles.date_time}>{' ' + timePosted}</Text>
            </View>
            <View style={styles.row}>
              {/* <TouchableOpacity
                style={styles.row}
                disabled={commentObject.reaction_count === 0 && !liked}
                onPress={() => {
                  navigation.navigate('CommentReactionScreen', {
                    comment: commentObject,
                    screenType: screenType,
                  });
                }}
                >
                <Text style={[styles.date_time, styles.likeCount]}>
                  {commentObject.user_reaction !== null
                    ? commentObject.reaction_count + (liked ? 0 : -1)
                    : commentObject.reaction_count + (liked ? 1 : 0)}
                </Text>
                <Text style={styles.date_time}>Likes</Text>
              </TouchableOpacity> */}
              {/* Show replies text only if there are some replies present  */}
              {!isThread && (commentObject as CommentType).replies_count > 0 && (
                <TouchableOpacity
                  style={styles.repliesTextAndIconContainer}
                  onPress={toggleReplies}>
                  <Text style={styles.repliesText}>
                    {getRepliesText(commentObject as CommentType)}
                  </Text>
                  <SvgXml
                    xml={icons.ArrowDown}
                    width={12}
                    height={11}
                    color={TAGG_LIGHT_BLUE}
                    style={!showReplies ? styles.repliesDownArrow : styles.repliesUpArrow}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* Show replies if toggle state is true */}
      {showReplies && (
        <View>
          <CommentsContainer
            objectId={commentObject.comment_id}
            screenType={screenType}
            shouldUpdate={shouldUpdateChild}
            setShouldUpdate={setShouldUpdateChild}
            isThread={true}
            moment_user_id={moment_user_id}
            setIsOpen={setIsOpen}
            moment={moment}
          />
        </View>
      )}

      {screenType && (
        <MomentMoreInfoDrawer
          isOpen={drawerVisible}
          setIsOpen={setDrawerVisible}
          isOwnProfile={false}
          screenType={screenType}
          moment={moment}
          momentTagId=""
        />
      )}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 1,
    paddingTop: '3%',
    paddingHorizontal: '3%',
    marginHorizontal: '2%',
    paddingBottom: '5%',
  },
  swipeActions: {
    flexDirection: 'row',
  },
  moreMarginWithThread: {
    marginLeft: '14%',
  },
  commentHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    marginRight: 10,
  },
  body: {
    marginLeft: 56,
  },
  comment: {
    marginBottom: '2%',
    marginRight: '10%',
  },
  date_time: {
    color: 'gray',
    fontSize: normalize(12),
  },
  clockIcon: {
    width: 12,
    height: 12,
    alignSelf: 'center',
  },
  commentInfoContainer: {
    flexDirection: 'row',
    marginTop: '3%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeCount: {
    color: 'black',
    top: 10,
    marginLeft: 5,
    // marginRight: 5,
  },
  likeContainer: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  repliesTextAndIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  repliesText: {
    color: TAGG_LIGHT_BLUE,
    fontWeight: '500',
    fontSize: normalize(12),
    marginRight: '1%',
  },
  repliesDownArrow: {
    // transform: [{ rotate: '270deg' }],
    transform: [{ rotate: '0deg' }],
    marginTop: '1%',
  },
  repliesUpArrow: {
    // transform: [{ rotate: '90deg' }],
    transform: [{ rotate: '180deg' }],
    marginTop: '1%',
  },
  actionText: {
    color: 'white',
    fontSize: normalize(12),
    fontWeight: '500',
    backgroundColor: 'transparent',
    paddingHorizontal: '5%',
    marginTop: '5%',
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  swipableContainer: {
    backgroundColor: 'white',
  },
});

export default CommentTile;
