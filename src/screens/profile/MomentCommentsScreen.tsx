import React, { useCallback, useEffect, useState } from 'react';

import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TabsGradient } from '../../components';
import { AddComment } from '../../components/';
import CommentsContainer from '../../components/comments/CommentsContainer';
import { ADD_COMMENT_TEXT } from '../../constants/strings';
import { MainStackParams } from '../../routes/main';
import { CommentThreadType, CommentType, ScreenType } from '../../types';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../utils';

/**
 * Comments Screen for an image uploaded
 * Displays all comments for a particular moment uploaded by the user followed by a text area to add the comment.
 * Comment is posted when return is pressed on the keypad.
 */

type MomentCommentsScreenRouteProps = RouteProp<MainStackParams, 'MomentCommentsScreen'>;

interface MomentCommentsScreenProps {
  route: MomentCommentsScreenRouteProps;
}

type MomentCommentContextType = {
  commentTapped: CommentType | CommentThreadType | undefined;
  setCommentTapped: (comment: CommentType | CommentThreadType | undefined) => void;
  shouldUpdateAllComments: boolean;
  setShouldUpdateAllComments: (available: boolean) => void;
  setCommentsLength: (available: number) => void;
};

export const CommentContext = React.createContext({} as MomentCommentContextType);

const MomentCommentsScreen: React.FC<MomentCommentsScreenProps> = props => {
  const navigation = useNavigation();
  //const { moment_id, screenType, comment_id /*, getLatestCount*/ } = route.params;
  const {
    moment_id,
    screenType,
    comment_id,
    setcommentCount,
    moment_user_id,
    setIsOpen,
    isOwnProfile,
    moment,
  } = props.route?.params ? props.route.params : props;

  //Receives comment length from child CommentsContainer
  const [commentsLength, setCommentsLength] = useState<number>(0);
  const [shouldUpdateAllComments, setShouldUpdateAllComments] = React.useState(true);

  //Keeps track of the current comments object in focus so that the application knows which comment to post a reply to
  const [commentTapped, setCommentTapped] = useState<CommentType | CommentThreadType | undefined>();
  /**  Show and hide tab bar on comments screen except when user is on discover moments,
   * where the tab bar is always hidden unless the user is on the DM feed
   */
  useFocusEffect(
    useCallback(() => {
      if (screenType !== ScreenType.DiscoverMoments) {
        navigation.getParent()?.setOptions({
          tabBarVisible: false,
        });
        return () => {
          navigation.getParent()?.setOptions({
            tabBarVisible: true,
          });
        };
      }
    }, [navigation]),
  );

  useEffect(() => {
    // navigation.setOptions({
    //   ...headerBarOptions('black', `${commentsLength} Comments`),
    // });
    if (setcommentCount) {
      setcommentCount(commentsLength);
    }
    // getLatestCount(commentsLength);
  }, [commentsLength, navigation]);

  return (
    <CommentContext.Provider
      value={{
        commentTapped,
        setCommentTapped,
        shouldUpdateAllComments,
        setShouldUpdateAllComments,
      }}>
      {/* <TouchableWithoutFeedback onPress={() => setCommentTapped(undefined)}> */}
      <View style={styles.background}>
        <SafeAreaView>
          <View
            style={{
              ...styles.body,
              height: setcommentCount ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.85,
            }}>
            <CommentsContainer
              objectId={moment_id}
              commentId={comment_id}
              moment_user_id={moment_user_id}
              screenType={screenType}
              shouldUpdate={shouldUpdateAllComments}
              setShouldUpdate={setShouldUpdateAllComments}
              setIsOpen={setIsOpen}
              isThread={false}
              setCommentsLengthParent={setCommentsLength}
              isOwnProfile={isOwnProfile}
              moment={moment}
            />
            <AddComment
              placeholderText={
                !commentTapped
                  ? ADD_COMMENT_TEXT()
                  : ADD_COMMENT_TEXT(commentTapped.commenter.username)
              }
              momentId={moment_id}
              isOwnProfile={isOwnProfile}
              setIsOpen={setIsOpen}
            />
          </View>
        </SafeAreaView>

        <TabsGradient />
      </View>
      {/* </TouchableWithoutFeedback> */}
    </CommentContext.Provider>
  );
};

const styles = StyleSheet.create({
  background: {
    height: '100%',
    backgroundColor: '#f7f7f7',
  },
  body: {
    // marginTop: HeaderHeight,
    width: SCREEN_WIDTH, // * 0.95,
    // paddingTop: '3%',
    backgroundColor: 'white',
  },
});

export default MomentCommentsScreen;
