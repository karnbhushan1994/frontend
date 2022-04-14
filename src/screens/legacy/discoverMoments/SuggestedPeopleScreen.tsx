import { SP_PAGE_SIZE } from '../../../constants';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlatList, RefreshControl, StatusBar, ViewToken } from 'react-native';
import { checkPermission } from 'react-native-contacts';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { Background, TabsGradient, TaggLoadingIndicator } from 'components';
import { getSuggestedPeople } from 'services/SuggestedPeopleService';
import { cancelFriendRequest, resetScreenType } from 'store/actions';
import { RootState } from 'store/rootReducer';
import {
  BackgroundGradientType,
  FriendshipStatusType,
  ProfilePreviewType,
  ScreenType,
  SuggestedPeopleDataType,
} from 'types';
import { fetchUserX, getUserAsProfilePreviewType, handleAddFriend } from 'utils';

import { userXInStore } from 'utils';

import SPBody from './SPBody';

const SuggestedPeopleScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const screenType = ScreenType.SuggestedPeople;
  const { suggested_people_linked } = useSelector((state: RootState) => state.user.profile) ?? {
    suggested_people_linked: -1,
  };
  const { userId: loggedInUserId } = useSelector((state: RootState) => state.user.user);
  const { suggestedPeopleImage } = useSelector((state: RootState) => state.user);
  const [people, setPeople] = useState<SuggestedPeopleDataType[]>([]);
  const state: RootState = useStore().getState();
  const [displayedUser, setDisplayedUser] = useState<SuggestedPeopleDataType>();
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [shouldResetData, setShouldResetData] = useState(false);
  const [hideStatusBar, setHideStatusBar] = useState(false);
  // boolean for showing/hiding loading indicator
  const [loading, setLoading] = useState(true);
  const [viewableItems, setViewableItems] = useState<ViewToken[]>([]);

  // set loading to false once there are people to display
  useEffect(() => {
    people.length ? setLoading(false) : setLoading(true);
  }, [people]);

  /*
   * The randomly-generated seed used by the API to order the suggested people.
   */
  const [randomizationSeed, setRandomizationSeed] = useState<number>(Math.random());

  const stausBarRef = useRef(hideStatusBar);

  // https://stackoverflow.com/a/57502343
  const viewabilityConfigCallback = useRef((info: { viewableItems: ViewToken[] }) => {
    setViewableItems(info.viewableItems);
  });

  useEffect(() => {
    if (viewableItems.length > 0) {
      setHideStatusBar(viewableItems[0].index !== 0);
      stausBarRef.current = viewableItems[0].index !== 0;
    }
  }, [viewableItems]);

  useEffect(() => {
    const handlePageChange = async () => {
      const checkAsync = await AsyncStorage.getItem('respondedToAccessContacts');
      const permission = await checkPermission();
      if (checkAsync === null && permission !== 'authorized') {
        navigation.navigate('RequestContactsAccess');
      }
    };

    handlePageChange();
  }, []);

  // loads data and append it to users based on current page
  useEffect(() => {
    loadMore();
  }, [page]);

  useEffect(() => {
    if (shouldResetData) {
      if (page !== 0) {
        setPage(0);
      } else {
        loadMore();
      }
    }
  }, [shouldResetData]);

  useEffect(() => {
    const appendSelf = async () => {
      const self: SuggestedPeopleDataType = {
        user: getUserAsProfilePreviewType(state.user.user, state.user.profile),
        mutual_friends: [],
        badges: [],
        social_links: [],
        suggested_people_url: suggestedPeopleImage,
        university: state.user.profile.university,
        friendship: {
          status: 'no_record',
          requester_id: '',
        },
        is_private: false,
      };
      people.unshift(self);
      setPeople(people);
    };
    if (suggested_people_linked < 2) {
      if (people.length > 1 && people[0].user.id !== loggedInUserId) {
        appendSelf();
      }
    }
  }, [suggestedPeopleImage]);

  const loadMore = async () => {
    const loadNextPage = async () =>
      await getSuggestedPeople(
        SP_PAGE_SIZE,
        shouldResetData ? 0 : page * SP_PAGE_SIZE,
        randomizationSeed,
      );

    loadNextPage().then(newUsers => {
      loadUserDataToStore(newUsers.map(ppl => ppl.user));
      if (shouldResetData) {
        setPeople([]);
      }
      setPeople(shouldResetData ? newUsers : people.concat(newUsers));
      setShouldResetData(false);
    });
  };

  const loadUserDataToStore = async (users: ProfilePreviewType[]) => {
    const loadUserData = async (user: ProfilePreviewType) => {
      if (!userXInStore(state, screenType, user.id)) {
        await fetchUserX(dispatch, { userId: user.id, username: user.username }, screenType);
      }
    };
    await Promise.all(users.map(user => loadUserData(user)));
  };

  // TODO: only reload data, don't reset screen type, which causes the entire
  // screen to re-render and makes for bad UX
  const onRefresh = () => {
    const reset = async () => {
      dispatch(resetScreenType(screenType));
      setShouldResetData(true);
    };
    setRefreshing(true);
    reset().then(() => {
      setRefreshing(false);
    });
    setRandomizationSeed(Math.random());
  };

  useFocusEffect(
    useCallback(() => {
      const navigateToAnimatedTutorial = () => {
        // if the user has finished the previous SP onboarding
        if (suggested_people_linked === 1) {
          navigation.navigate('AnimatedTutorial');
        }
      };
      navigateToAnimatedTutorial();
      StatusBar.setHidden(stausBarRef.current);
      StatusBar.setBarStyle('light-content');
      return () => {
        StatusBar.setHidden(false);
        StatusBar.setBarStyle('dark-content');
      };
    }, [navigation, suggested_people_linked]),
  );

  const updateDisplayedUser = async (
    user: ProfilePreviewType,
    status: FriendshipStatusType,
    requester_id: string,
  ) => {
    const localDisplayedUser: SuggestedPeopleDataType = {
      ...displayedUser,
      friendship: { status, requester_id },
    };
    setDisplayedUser(localDisplayedUser);

    setPeople(
      people.map(item => {
        if (item.user.id === user.id) {
          item.friendship.status = status;
          item.friendship.requester_id = requester_id;
        }
        return item;
      }),
    );
  };

  const onAddFriend = async (user: ProfilePreviewType) => {
    handleAddFriend(screenType, user, dispatch, state);
    updateDisplayedUser(user, 'requested', loggedInUserId);
  };

  const onCancelRequest = (user: ProfilePreviewType) => {
    dispatch(cancelFriendRequest(user.id));
    updateDisplayedUser(user, 'no_record', '');
  };

  useFocusEffect(() => {
    if (suggested_people_linked === 0) {
      navigation.navigate('SPWelcomeScreen');
    }
  });

  return loading ? (
    <>
      <TaggLoadingIndicator fullscreen />
      <Background gradientType={BackgroundGradientType.Dark} />
    </>
  ) : (
    <>
      <FlatList
        data={people}
        renderItem={item => (
          <SPBody
            itemIndex={item.index}
            item={item.item}
            onAddFriend={onAddFriend}
            onCancelRequest={onCancelRequest}
            loggedInUserId={loggedInUserId}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={viewabilityConfigCallback.current}
        onEndReached={() => setPage(page + 1)}
        onEndReachedThreshold={3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        pagingEnabled
      />
      <TabsGradient />
    </>
  );
};

export default SuggestedPeopleScreen;
