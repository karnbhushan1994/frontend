import { TaggAlertTextList, TaggToastTextList } from 'constants';

import React, { memo, useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { Avatar, TaggAlert, TaggToast } from 'components';
import SimpleButton from 'components/widgets/SimpleButton';

import { blockUnblockUser, loadBlockedList } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, ScreenType, TaggToastType } from 'types';
import { navigateToProfile, track } from 'utils';

interface ListItemProps {
  item: any;
  loggedInUser: string;
}

const RenderEmptyComponent = () => (
  <View style={styles.emptyView}>
    <Text style={styles.emptyViewText}>No Blocked Profiles</Text>
  </View>
);

const ListItem = memo(({ item, loggedInUser }: ListItemProps) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showBlockUserAlert, setShowBlockUserAlert] = useState<boolean>(false);

  const state = useStore().getState();
  const toast = useToast();
  const dispatch = useDispatch();
  const handleSubmit = async (blockedUserId: string) => {
    setLoading(true);
    await blockUnblockUser(loggedInUser, blockedUserId, true, state, dispatch).then(
      async success => {
        if (success) {
          await dispatch(loadBlockedList(loggedInUser));
          TaggToast(toast, TaggToastType.Success, TaggToastTextList.PROFILE_UNBLOCLKED);
        }
      },
    );
    setLoading(false);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigateToProfile(state, dispatch, navigation, ScreenType.Profile, {
          userId: item?.id,
          username: item?.username,
        });
      }}
      style={styles.item}>
      <Avatar uri={item.profile_pic} style={styles.image} userIcon={true} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {item?.first_name} {item?.last_name}
        </Text>
        <Text style={styles.subText}>User is currently blocked</Text>
      </View>
      <SimpleButton
        title={'Unblock'}
        onPress={() => setShowBlockUserAlert(true)}
        containerStyles={styles.buttonContainer}
        loader={loading}
      />
      <TaggAlert
        alertVisible={showBlockUserAlert}
        setAlertVisible={setShowBlockUserAlert}
        title={TaggAlertTextList.UNBLOCK_USER.title}
        subheading={TaggAlertTextList.UNBLOCK_USER.subheading}
        acceptButtonText={TaggAlertTextList.UNBLOCK_USER.acceptButtonText}
        handleAccept={async () => {
          track('BlockUser', AnalyticVerb.Finished, AnalyticCategory.EditAPage);
          handleSubmit(item?.id);

          // Hide block user alert
          setShowBlockUserAlert(false);
        }}
      />
    </TouchableOpacity>
  );
});

type BlockedProfilesProps = {
  navigation: any;
};
const BlockedProfiles: React.FC<BlockedProfilesProps> = ({ navigation }) => {
  const { blockedUsers } = useSelector((state: RootState) => state.blocked);
  const { user } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const getBlockedUserList = async () => {
    await dispatch(loadBlockedList(user.userId));
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => getBlockedUserList());
    return () => unsubscribe;
  }, []);

  if (blockedUsers && blockedUsers.length === 0) {
    return <RenderEmptyComponent />;
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.text}>Today</Text> */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={blockedUsers}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => <ListItem loggedInUser={user?.userId} item={item} />}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={RenderEmptyComponent}
      />
    </SafeAreaView>
  );
};

export default BlockedProfiles;

const styles = StyleSheet.create({
  container: {
    marginTop: 100, // HeaderHeight,
    flex: 1,
    flexDirection: 'column',
  },
  flatListContainer: {
    //flex: 1,
    paddingBottom: 100,
  },
  text: {
    marginHorizontal: 20,
    marginBottom: 16,
    color: '#999',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'gray',
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    // marginBottom: 8,
  },
  subText: {
    fontSize: 12,
  },
  buttonContainer: {
    width: 83,
    height: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    //paddingHorizontal: 20,
    paddingVertical: 0,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyViewText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888',
  },
});
