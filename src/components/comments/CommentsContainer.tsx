import { BE_THE_FIRST_TO_COMMENT, TaggToastTextList } from 'constants';

import React, { useContext, useEffect, useRef, useState } from 'react';

import moment from 'moment';
import { StyleSheet, View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';

import { CommentContext } from 'screens/profile/MomentCommentsScreen';
import { getComments } from 'services';
import { updateReplyPosted } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { CommentThreadType, CommentType, ScreenType, TaggToastType } from 'types';
import { SCREEN_HEIGHT } from 'utils';

import { TaggToast } from '../toasts';
import CommentTile from './CommentTile';

export type CommentsContainerProps = {
  screenType: ScreenType;
  objectId: string;
  commentId?: string;
  shouldUpdate: boolean;
  setShouldUpdate: (update: boolean) => void;
  isThread: boolean;
  setCommentsLengthParent: (length: number) => void;
  moment_user_id: string;
  setIsOpen: (update: boolean) => void;
};

/**
 * Comments Container to be used for both comments and replies
 */

const CommentsContainer: React.FC<CommentsContainerProps> = ({
  screenType,
  objectId,
  isThread,
  shouldUpdate,
  setShouldUpdate,
  commentId,
  setCommentsLengthParent,
  moment_user_id,
  setIsOpen,
  isOwnProfile,
  moment: Moment,
}) => {
  const { setCommentsLength, commentTapped } = useContext(CommentContext);
  const { userId: loggedInUserId } = useSelector((state: RootState) => state.user.user);
  const [commentsList, setCommentsList] = useState<CommentType[]>([]);
  const [apiInProgress, setapiInProgress] = useState<boolean>(false);
  const [hasLength, sethasLength] = useState<boolean>(false);
  const dispatch = useDispatch();
  const ref = useRef<any>(null);
  const ITEM_HEIGHT = SCREEN_HEIGHT / 7.0;
  const toast = useToast();

  const countComments = (comments: CommentType[]) => {
    let count = 0;
    for (let i = 0; i < comments.length; i++) {
      count += 1 + comments[i].replies_count;
    }
    return count;
  };

  useEffect(() => {
    const loadComments = async () => {
      setapiInProgress(true);
      await getComments(objectId, isThread).then(comments => {
        setapiInProgress(false);
        if (comments && subscribedToLoadComments) {
          setCommentsList(comments);
          if (commentId) {
            const commentUnavailable = comments.findIndex(c => c.comment_id === commentId);
            if (commentUnavailable === -1) {
              TaggToast(toast, TaggToastType.Error, TaggToastTextList.COMMENT_UNAVAILABLE);
            }
          }
          if (setCommentsLength) {
            setCommentsLength(comments.length);
          }
          setShouldUpdate(false);
        }
        setCommentsLengthParent(countComments(comments));
        let len = countComments(comments);
        if (len == 0) {
          sethasLength(true);
        } else {
          sethasLength(false);
        }
      });
    };
    let subscribedToLoadComments = true;
    if (shouldUpdate) {
      loadComments();
    }
    return () => {
      subscribedToLoadComments = false;
    };
  }, [shouldUpdate]);

  // scrolls to the comment
  useEffect(() => {
    if (commentId) {
      const index = commentsList.findIndex(item => item.comment_id === commentId);
      if (index > 0) {
        let comments = [...commentsList];
        const temp = comments[index];
        comments[index] = comments[0];
        comments[0] = temp;
        setCommentsList(comments);
      }
    } else if (!isThread && !commentTapped) {
      setTimeout(() => {
        ref.current?.scrollToEnd({ animated: true });
      }, 500);
    }
    return () => {
      if (commentId && isThread) {
        setTimeout(() => {
          dispatch(updateReplyPosted(undefined));
        }, 200);
      }
    };
  }, [commentId]);

  const renderComment = ({ item }: { item: CommentType | CommentThreadType }) => (
    <CommentTile
      key={item.comment_id}
      commentObject={item}
      screenType={screenType}
      isThread={isThread}
      shouldUpdateParent={shouldUpdate}
      setShouldUpdateParent={setShouldUpdate}
      canDelete={item.commenter.id === loggedInUserId}
      myMoment={moment_user_id === loggedInUserId}
      moment_user_id={moment_user_id}
      setIsOpen={setIsOpen}
      isOwnProfile={isOwnProfile}
      moment={Moment}
    />
  );

  return (
    <View style={styles.flex1}>
      {hasLength && !apiInProgress ? (
        <View style={styles.emptyListView}>
          <Text style={styles.emptyListText}>{BE_THE_FIRST_TO_COMMENT}</Text>
        </View>
      ) : (
        <FlatList
          data={commentsList.sort(
            (a, b) => moment(a.date_created).unix() - moment(b.date_created).unix(),
          )}
          ref={ref}
          keyExtractor={(item, index) => index.toString()}
          decelerationRate={'fast'}
          snapToAlignment={'start'}
          snapToInterval={ITEM_HEIGHT}
          renderItem={renderComment}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          pagingEnabled
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    justifyContent: 'center',
  },
  emptyListView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyListText: {
    color: '#828282',
    fontSize: 14,
    fontWeight: '400',
  },
  flex1: {
    flex: 1,
  },
});

export default CommentsContainer;
