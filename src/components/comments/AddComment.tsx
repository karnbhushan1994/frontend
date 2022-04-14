import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
//import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useDispatch, useSelector } from 'react-redux';

import { makeAction } from 'makeAction';
import { CommentContext } from 'screens/profile/MomentCommentsScreen';
import { postComment } from 'services';
import { updateReplyPosted, loadUserProfileInfo } from 'store/actions';
import { showCommunityPopup } from 'store/reducers/communityReducer';
import { RootState } from 'store/rootReducer';

import { Banner, CommentThreadType, CommentType, TaggScoreBannerText } from 'types';
import { normalize, SCREEN_HEIGHT } from 'utils';
import { mentionPartTypes } from 'utils/comments';

import { CommentTextField } from './CommentTextField';
import MentionInputControlled from './MentionInputControlled';

export interface AddCommentProps {
  momentId: string;
  placeholderText: string;
  callback?: (message: string) => void;
  onFocus?: () => void;
  isKeyboardAvoiding?: boolean;
  theme?: 'dark' | 'white';
}

const AddComment: React.FC<AddCommentProps> = ({
  momentId,
  placeholderText,
  callback = _ => null,
  onFocus = () => null,
  isKeyboardAvoiding = true,
  theme = 'white',
  isOwnProfile,
  setIsOpen,
}) => {
  const { setShouldUpdateAllComments, commentTapped, setCommentTapped } =
    useContext(CommentContext);
  const [inReplyToMention, setInReplyToMention] = useState('');
  const [comment, setComment] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isDisableCommentBtn, setDisableCommentBtn] = useState(true);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const ref = useRef<TextInput>(null);
  const isReplyingToComment = commentTapped !== undefined && !('parent_comment' in commentTapped);
  const isReplyingToReply = commentTapped !== undefined && 'parent_comment' in commentTapped;
  const objectId: string = commentTapped
    ? 'parent_comment' in commentTapped
      ? (commentTapped as CommentThreadType).parent_comment.comment_id
      : (commentTapped as CommentType).comment_id
    : momentId;
  const addComment = async () => {
    if (isDisableCommentBtn) {
      setComment('');
      setInReplyToMention('');
      Keyboard.dismiss();
      setDisableCommentBtn(false);
      const trimmed = comment.trim();
      if (trimmed === '') {
        return;
      }
      const message = inReplyToMention + trimmed;
      const postedComment = await postComment(
        message,
        objectId,
        isReplyingToComment || isReplyingToReply,
      );

      if (postedComment) {
        await callback(message);
        const isFirstCommnet = postedComment?.show_community_pop_up;
        if (isFirstCommnet) {
          setTimeout(() => {
            setIsOpen(false);
            console.log('open popup');
            dispatch(showCommunityPopup(true));
          }, 1200);
        }

        if (!isOwnProfile) {
          setTimeout(() => {
            dispatch(makeAction(Banner.SHOW, true));
            dispatch(makeAction(Banner.TEXT, TaggScoreBannerText.COMMENT));
            dispatch(makeAction(Banner.POINT, '+ 1'));
          }, 800);
        }
        setTimeout(() => {
          setDisableCommentBtn(true);
        }, 800);
        // setTimeout(() => {
        //   setDisableCommentBtn(true);
        //   dispatch(makeAction(Banner.SHOW, true));
        //   dispatch(makeAction(Banner.TEXT, TaggScoreBannerText.COMMENT));
        //   dispatch(makeAction(Banner.POINT, '+ 1'));
        // }, 800);

        setComment('');
        setInReplyToMention('');
        dispatch(loadUserProfileInfo(user.userId));

        //Set new reply posted object
        //This helps us show the latest reply on top
        //Data set is kind of stale but it works
        if (isReplyingToComment || isReplyingToReply) {
          dispatch(
            updateReplyPosted({
              comment_id: postedComment.comment_id,
              parent_comment: { comment_id: objectId },
            }),
          );
        }
        setShouldUpdateAllComments(true);
      }
    }
  };

  useEffect(() => {
    const showKeyboard = () => setKeyboardVisible(true);
    Keyboard.addListener('keyboardWillShow', showKeyboard);
    return () => Keyboard.removeListener('keyboardWillShow', showKeyboard);
  }, []);

  useEffect(() => {
    const hideKeyboard = () => setKeyboardVisible(false);
    // setCommentTapped(undefined);
    Keyboard.addListener('keyboardWillHide', hideKeyboard);
    return () => Keyboard.removeListener('keyboardWillHide', hideKeyboard);
  }, []);

  useEffect(() => {
    if (isReplyingToComment || isReplyingToReply) {
      // bring up keyboard
      ref.current?.focus();
    }
    if (commentTapped && isReplyingToReply) {
      const commenter = (commentTapped as CommentThreadType).commenter;
      setInReplyToMention(`@[${commenter.username}](${commenter.id}) `);
    } else {
      setInReplyToMention('');
    }
  }, [isReplyingToComment, isReplyingToReply, commentTapped]);

  const mainContent = () => (
    <View
      style={[
        theme === 'white' ? styles.containerWhite : styles.containerDark,
        keyboardVisible && theme !== 'dark' ? styles.whiteBackround : {},
      ]}>
      <View style={styles.textContainer}>
        <MentionInputControlled
          containerStyle={styles.text}
          placeholderTextColor={theme === 'dark' ? '#828282' : undefined}
          placeholder={placeholderText}
          value={inReplyToMention + comment}
          onFocus={onFocus}
          onChange={(newText: string) => {
            // skipping the `inReplyToMention` text
            setComment(newText.substring(inReplyToMention.length, newText.length));
          }}
          inputRef={ref}
          partTypes={mentionPartTypes('blue', 'comment')}
          addComment={addComment}
          NewText={CommentTextField}
          theme={theme}
          keyboardVisible={keyboardVisible}
          comment={comment}
        />
      </View>
    </View>
  );
  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      setCommentTapped(undefined);
    });
  });

  return isKeyboardAvoiding ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={SCREEN_HEIGHT * 0.28}>
      {mainContent()}
    </KeyboardAvoidingView>
  ) : (
    mainContent()
  );
};

const styles = StyleSheet.create({
  containerDark: {
    alignItems: 'center',
    width: '100%',
  },
  containerWhite: {
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    //width: '95%',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '3%',
    borderRadius: 25,
    height: normalize(45),
    backgroundColor: '#e8e8e8',
  },
  text: {
    flex: 1,
    maxHeight: 100,
  },
  whiteBackround: {
    backgroundColor: '#fff',
  },
});

export default AddComment;
