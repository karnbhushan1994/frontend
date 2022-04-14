import React, { useEffect, useState } from 'react';

import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Text } from 'react-native-animatable';
import Animated from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import GestureRecognizer from 'react-native-swipe-gestures';

import { useDispatch, useStore } from 'react-redux';

import { icons } from 'assets/icons';

import { ScreenType } from 'types';

import MomentCommentsScreen from '../../screens/profile/MomentCommentsScreen';

import { loadUserMoments } from '../../store/actions';

import { RootState } from '../../store/rootReducer';

interface CommentMomentDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  showHeader: boolean;
  setCommentsLengthParent: (length: number) => void;
  momentId: string;
  commentCount: number;
  screenType: ScreenType | undefined;
  momentuserid: string;
}

const CommentMomentDrawer: React.FC<CommentMomentDrawerProps> = props => {
  const { isOpen, setIsOpen, momentId, screenType, momentuserid, isOwnProfile, moment } = props;
  const [commentCount, setcommentCount] = useState(0);
  const [keboardstate, setkeboardstate] = useState<boolean>(false);
  const dispatch = useDispatch();
  const state: RootState = useStore().getState();
  const loggedInUserId = state.user.user.userId;

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      setkeboardstate(true);
    });
    Keyboard.addListener('keyboardDidShow', () => {
      setkeboardstate(false);
    });
  });
  const checkKeyboardState = () => {
    if (!keboardstate) {
      Keyboard.dismiss();
    } else {
      dispatch(loadUserMoments(loggedInUserId));
      setIsOpen(false);
    }
  };
  return (
    <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={() => {}}>
      <View style={styles.modalWrapper}>
        <TouchableWithoutFeedback onPress={checkKeyboardState}>
          <Animated.View style={[styles.backgroundView]} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <GestureRecognizer
            onTouchEnd={() => {
              dispatch(loadUserMoments(loggedInUserId));
              setIsOpen(false);
            }}
            style={styles.header}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>
                {commentCount === 1 ? `${commentCount} Comment` : `${commentCount} Comments`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeIconWrapper}
              onPress={() => {
                dispatch(loadUserMoments(loggedInUserId));
                setIsOpen(false);
              }}>
              <SvgXml xml={icons.CloseOutline} height={40} width={40} color={'#000'} />
            </TouchableOpacity>
          </GestureRecognizer>
          <MomentCommentsScreen
            moment_id={momentId}
            moment_user_id={momentuserid}
            screenType={screenType}
            comment_id={null}
            setcommentCount={setcommentCount}
            setIsOpen={setIsOpen}
            isOwnProfile={isOwnProfile}
            moment={moment}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    width: '100%',
  },
  container: {
    width: '100%',
    height: '80%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
  },
  closeIconWrapper: {
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  header: {
    backgroundColor: '#fff',
    // height: HeaderHeight,
    width: '100%',
    padding: '3%',
  },
  title: {
    fontWeight: '700',
    fontSize: 22,
    alignSelf: 'center',
    marginBottom: 6,
    maxWidth: '75%',
    textAlign: 'center',
  },
  buttonStyles: {
    width: 280,
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundView: {
    height: '20%',
  },
});

export default CommentMomentDrawer;
