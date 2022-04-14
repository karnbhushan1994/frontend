import React from 'react';

import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useStore } from 'react-redux';

import { ProfilePreview } from 'components/profile';
import { TAGG_LIGHT_BLUE } from '../../constants/constants';
import { RootState } from 'store/rootReducer';
import { ScreenType } from 'types/types';
import { normalize } from 'utils';
import { handleAddFriend } from 'utils/friends';

import { SearchResultType } from '../InviteFriendsScreen';

interface UsersFromContactsProps {
  screenType: ScreenType;
  results: SearchResultType;
  setResults: Function;
}

const UsersFromContacts: React.FC<UsersFromContactsProps> = ({
  screenType,
  results,
  setResults,
}) => {
  const dispatch = useDispatch();
  const state: RootState = useStore().getState();
  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        data={results.usersFromContacts}
        keyExtractor={item => item.username}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.ppContainer}>
            <View style={styles.friend}>
              <ProfilePreview
                {...{ profilePreview: item }}
                previewType={'Friend'}
                screenType={screenType}
              />
            </View>
            <TouchableOpacity
              style={styles.addFriendButton}
              onPress={() => {
                handleAddFriend(screenType, item, dispatch, state).then(success => {
                  if (success) {
                    let users = results.usersFromContacts;
                    const filteredUsers = users.filter(user => user.username !== item.username);
                    setResults({
                      ...results,
                      usersFromContacts: filteredUsers,
                    });
                  }
                });
              }}>
              <Text style={styles.addFriendButtonTitle}>Add Friend</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </>
  );
};

export default UsersFromContacts;

const styles = StyleSheet.create({
  ppContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: normalize(42),
    alignItems: 'center',
    marginBottom: '5%',
    marginHorizontal: 10,
  },
  friend: {
    alignSelf: 'center',
    height: '100%',
  },
  addFriendButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 82,
    height: 25,
    borderColor: TAGG_LIGHT_BLUE,
    borderWidth: 2,
    borderRadius: 2,
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
});
