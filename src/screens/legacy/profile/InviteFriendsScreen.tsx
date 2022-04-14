import React, { useEffect, useMemo, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import {
  FlatList,
  Keyboard,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { checkPermission } from 'react-native-contacts';

import { SearchBar, TabsGradient } from 'components';
import { InviteFriendTile } from 'components/friends';
import { headerBarOptions } from 'routes';
import { getRemainingInviteCount, usersFromContactsService } from 'services/UserFriendsService';
import {
  extractContacts,
  HeaderHeight,
  isIPhoneX,
  normalize,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  StatusBarHeight,
} from 'utils';

import { TAGG_LIGHT_BLUE } from '../../constants';

export type InviteContactType = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type SearchResultType = {
  nonUsersFromContacts: InviteContactType[];
  pendingUsers: InviteContactType[];
};

const InviteFriendsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [nonUsersFromContacts, setNonUsersFromContacts] = useState<InviteContactType[]>([]);
  const [pendingUsers, setPendingUsers] = useState<InviteContactType[]>([]);
  const [results, setResults] = useState<SearchResultType>({
    nonUsersFromContacts: nonUsersFromContacts,
    pendingUsers: pendingUsers,
  });
  const [query, setQuery] = useState('');
  const [invitesLeft, setInvitesLeft] = useState(0);

  useEffect(() => {
    // Get number of invites from the backend and set the state
    const getInitialInvitesCount = async () => {
      const intialInvites = await getRemainingInviteCount();
      setInvitesLeft(intialInvites);
    };
    getInitialInvitesCount();
  }, []);

  useEffect(
    () =>
      navigation.setOptions({
        ...headerBarOptions('black', `You have ${invitesLeft} Invites`),
      }),
    [invitesLeft],
  );

  useEffect(() => {
    const handleFindFriends = () => {
      extractContacts().then(async retrievedContacts => {
        const permission = await checkPermission();
        if (permission === 'authorized') {
          let response = await usersFromContactsService(retrievedContacts);
          await setNonUsersFromContacts(response.invite_from_contacts);
          await setPendingUsers(response.pending_users);
          setResults({
            nonUsersFromContacts: response.invite_from_contacts,
            pendingUsers: response.pending_users,
          });
        } else {
          Linking.openSettings();
        }
      });
    };
    handleFindFriends();
  }, []);

  /*
   * Main handler for changes in query.
   */
  useEffect(() => {
    const search = async () => {
      if (query.length > 0) {
        const searchResultsPendingUsers = pendingUsers
          ? pendingUsers.filter(
              (item: InviteContactType) =>
                (item.firstName + ' ' + item.lastName).toLowerCase().startsWith(query) ||
                item.lastName.toLowerCase().startsWith(query),
            )
          : [];
        const searchResultsNonUsers = nonUsersFromContacts
          ? nonUsersFromContacts.filter(
              (item: InviteContactType) =>
                (item.firstName + ' ' + item.lastName).toLowerCase().startsWith(query) ||
                item.lastName.toLowerCase().startsWith(query),
            )
          : [];
        setResults({
          nonUsersFromContacts: searchResultsNonUsers,
          pendingUsers: searchResultsPendingUsers,
        });
      } else {
        setResults({
          nonUsersFromContacts: nonUsersFromContacts || [],
          pendingUsers: pendingUsers || [],
        });
      }
    };
    search();
  }, [query]);

  const PendingList = useMemo(
    () => (
      <FlatList
        contentContainerStyle={styles.nonUsersFlatListContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        data={results.pendingUsers}
        keyExtractor={item => item.phoneNumber}
        renderItem={({ item }) => (
          <InviteFriendTile
            item={item}
            remind={true}
            invitesLeft={invitesLeft}
            setInvitesLeft={setInvitesLeft}
            results={results}
            setResults={setResults}
          />
        )}
      />
    ),
    [results.pendingUsers],
  );

  const InviteList = useMemo(
    () => (
      <FlatList
        contentContainerStyle={styles.nonUsersFlatListContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        data={results.nonUsersFromContacts}
        keyExtractor={item => item.phoneNumber}
        renderItem={({ item }) => (
          <InviteFriendTile
            item={item}
            remind={false}
            invitesLeft={invitesLeft}
            setInvitesLeft={setInvitesLeft}
            results={results}
            setResults={setResults}
          />
        )}
      />
    ),
    [results.nonUsersFromContacts],
  );

  return (
    <View style={styles.mainContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ marginTop: HeaderHeight + StatusBarHeight }}>
          <StatusBar barStyle="dark-content" />
          <ScrollView
            style={styles.body}
            contentContainerStyle={{ paddingBottom: SCREEN_HEIGHT * 0.1 }}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                Sharing is caring, invite friends, and create moments together!
              </Text>
            </View>
            <View style={styles.container}>
              <SearchBar
                onChangeText={setQuery}
                onBlur={() => {
                  Keyboard.dismiss();
                }}
                value={query}
              />
            </View>
            <View
              style={[
                styles.subheader,
                {
                  height: 75 * (results.pendingUsers ? results.pendingUsers.length : 1),
                },
              ]}>
              <Text style={styles.subheaderText}>Pending Users</Text>
              {PendingList}
            </View>
            <View style={styles.subheader}>
              <Text style={styles.subheaderText}>Invite your friends!</Text>
              {InviteList}
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <TabsGradient />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { backgroundColor: 'white', height: SCREEN_HEIGHT },
  body: {
    paddingTop: 10,
    height: SCREEN_HEIGHT,
    backgroundColor: '#fff',
  },
  headerContainer: {
    width: SCREEN_WIDTH * 0.85,
    height: isIPhoneX() ? SCREEN_HEIGHT * 0.06 : SCREEN_HEIGHT * 0.08,
    alignSelf: 'center',
  },
  nonUsersFlatListContainer: { paddingBottom: 130 },
  subheader: {
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.85,
    marginBottom: '5%',
  },
  subheaderText: {
    color: '#828282',
    fontSize: normalize(12),
    fontWeight: '600',
    lineHeight: normalize(14.32),
    marginBottom: '5%',
  },
  headerText: {
    textAlign: 'center',
    color: '#828282',
    fontSize: normalize(12),
    fontWeight: '600',
    lineHeight: normalize(14.32),
    marginBottom: '5%',
  },
  container: {
    width: '100%',
    height: normalize(42),
    marginBottom: '3%',
  },
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

export default InviteFriendsScreen;
