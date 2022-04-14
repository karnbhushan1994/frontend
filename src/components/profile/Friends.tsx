import React from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useStore } from 'react-redux';

import { NO_USER } from 'store/initialStates';
import { RootState } from 'store/rootReducer';
import { ProfilePreviewType, ScreenType } from 'types';
import { normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';
import { handleUnfriend } from 'utils/friends';

import { TAGG_LIGHT_BLUE } from '../../constants';
import { ProfilePreview } from '../profile';

interface FriendsProps {
  result: Array<ProfilePreviewType>;
  screenType: ScreenType;
  userId: string | undefined;
  hideFriendsFeature?: boolean;
}

const Friends: React.FC<FriendsProps> = ({ result, screenType, userId, hideFriendsFeature }) => {
  const state: RootState = useStore().getState();
  const dispatch = useDispatch();
  const { user: loggedInUser = NO_USER } = state.user;

  return (
    <>
      {!hideFriendsFeature && (
        <Text style={[styles.subheaderText, styles.friendsSubheaderText]}>Friends</Text>
      )}
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {result.map(profilePreview => (
          <View key={profilePreview.id} style={styles.container}>
            <View style={styles.friend}>
              <ProfilePreview
                {...{ profilePreview }}
                previewType={'Friend'}
                screenType={screenType}
              />
            </View>
            {loggedInUser.userId === userId && (
              <TouchableOpacity
                style={styles.unfriendButton}
                onPress={() => handleUnfriend(screenType, profilePreview, dispatch, state)}>
                <Text style={styles.unfriendButtonTitle}>Unfriend</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'column',
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.85,
  },
  scrollViewContent: {
    alignSelf: 'center',
    paddingBottom: SCREEN_HEIGHT / 7,
    width: SCREEN_WIDTH * 0.85,
    marginTop: '1%',
  },
  addFriendHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '3%',
    marginTop: '2%',
  },
  subheader: {
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.85,
    marginVertical: '1%',
  },
  subheaderText: {
    color: '#828282',
    fontSize: normalize(12),
    fontWeight: '600',
    lineHeight: normalize(14.32),
  },
  friendsSubheaderText: {
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.85,
    marginVertical: '1%',
    marginBottom: '2%',
  },
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: normalize(42),
    alignItems: 'center',
    marginBottom: '5%',
  },
  friend: {
    alignSelf: 'center',
    height: '100%',
  },
  addFriendButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '55%',
    borderColor: TAGG_LIGHT_BLUE,
    borderWidth: 2,
    borderRadius: 3,
    padding: 0,
    backgroundColor: TAGG_LIGHT_BLUE,
  },
  addFriendButtonTitle: {
    color: 'white',
    padding: 0,
    fontSize: normalize(11),
    fontWeight: '700',
    lineHeight: normalize(13.13),
    letterSpacing: normalize(0.6),
    paddingHorizontal: '3.8%',
  },
  unfriendButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 82,
    height: '55%',
    borderColor: TAGG_LIGHT_BLUE,
    borderWidth: 2,
    borderRadius: 3,
    padding: 0,
  },
  unfriendButtonTitle: {
    color: TAGG_LIGHT_BLUE,
    padding: 0,
    fontSize: normalize(11),
    fontWeight: '700',
    lineHeight: normalize(13.13),
    letterSpacing: normalize(0.6),
    paddingHorizontal: '3.8%',
  },
});

export default Friends;
