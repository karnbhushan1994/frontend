import React, { FC, useCallback, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import {
  Image,
  RefreshControl,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { images } from 'assets/images';
import { TabsGradient } from 'components';
import EmptyContentView from 'components/common/EmptyContentView';
import { Notification } from 'components/notifications';
import { MainStackParams } from 'routes';
import { loadUserNotifications, updateNewNotificationReceived } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, NotificationType } from 'types';
import { getDateAge, HeaderHeight, normalize, SCREEN_HEIGHT, SCREEN_WIDTH, track } from 'utils';

type NotificationsScreenRouteProps = RouteProp<MainStackParams, 'NotificationsScreen'>;
interface NotificationsScreenProps {
  route: NotificationsScreenRouteProps;
}

const NotificationsScreen: FC<NotificationsScreenProps> = ({ route }) => {
  const { screenType } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { newNotificationReceived } = useSelector((state: RootState) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  // used for figuring out which ones are unread
  const [lastViewed, setLastViewed] = useState<moment.Moment | undefined>(undefined);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const { user: loggedInUser } = useSelector((state: RootState) => state.user);
  const [sectionedNotifications, setSectionedNotifications] = useState<
    {
      title: 'Friend Requests' | 'Today' | 'Yesterday' | 'This Week';
      data: NotificationType[];
    }[]
  >([]);

  const DEFAULT_NOTIFICATIONS_SIZE = 2;

  const [footerEnabled, setFooterEnabled] = useState(false);
  const [requestLimit, setRequestLimit] = useState(DEFAULT_NOTIFICATIONS_SIZE);
  const [allFriendRequests, setFriendRequests] = useState<NotificationType[]>([]);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarVisible: false,
      });
    }, [navigation]),
  );

  const refreshNotifications = () => {
    const refrestState = async () => {
      dispatch(loadUserNotifications());
    };
    setRefreshing(true);
    refrestState().then(() => {
      setRefreshing(false);
    });
  };

  const onRefresh = useCallback(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.header}>
          <Text style={styles.headerText}>Notifications</Text>
        </View>
      ),
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const resetNewNotificationFlag = () => {
        if (newNotificationReceived) {
          dispatch(updateNewNotificationReceived(false));
        }
      };

      //Called everytime screen is focused
      if (newNotificationReceived) {
        refreshNotifications();
      }

      //Called when user leaves the screen
      return () => resetNewNotificationFlag();
    }, [newNotificationReceived, dispatch, refreshNotifications]),
  );

  // handles storing and fetching the "previously viewed" information
  useEffect(() => {
    const getAndUpdateLastViewed = async () => {
      const key = 'notificationLastViewed';
      const previousLastViewed = await AsyncStorage.getItem(key);
      setLastViewed(previousLastViewed == null ? moment.unix(0) : moment(previousLastViewed));
      await AsyncStorage.setItem(key, moment().toString());
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    };
    getAndUpdateLastViewed();
  }, [notifications]);

  // handles sectioning notifications to "date age"
  // mark notifications as read or unread
  useEffect(() => {
    const sortedNotifications = (notifications ?? [])
      .slice()
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    let todays = [];
    let yesterdays = [];
    let thisWeeks = [];
    let friendRequests = [];
    for (const n of sortedNotifications) {
      const notificationDate = moment(n.timestamp);
      const dateAge = getDateAge(notificationDate);
      if (dateAge === 'unknown') {
        continue;
      }
      const unread = lastViewed ? lastViewed.diff(notificationDate) < 0 : false;
      const newN = { ...n, unread };

      if (n.notification_type === 'FRD_REQ') {
        friendRequests.push(newN);
      } else {
        switch (dateAge) {
          case 'today':
            todays.push(newN);
            continue;
          case 'yesterday':
            yesterdays.push(newN);
            continue;
          case 'thisWeek':
            thisWeeks.push(newN);
            continue;
          default:
            continue;
        }
      }
    }
    setFriendRequests(friendRequests);
    setFooterEnabled(
      requestLimit === friendRequests.length && friendRequests.length > DEFAULT_NOTIFICATIONS_SIZE,
    );
    setSectionedNotifications(
      todays.length === 0 &&
        yesterdays.length === 0 &&
        thisWeeks.length === 0 &&
        friendRequests.length === 0
        ? []
        : [
            {
              title: 'Friend Requests',
              data: friendRequests.slice(0, requestLimit),
            },
            { title: 'Today', data: todays },
            { title: 'Yesterday', data: yesterdays },
            { title: 'This Week', data: thisWeeks },
          ],
    );
    if (notifications.length !== 0) {
      track('NotificationScreen', AnalyticVerb.Viewed, AnalyticCategory.Notification, {
        friendRequests: friendRequests.length,
        totalNotifications: todays.length + yesterdays.length + thisWeeks.length,
        notifications: {
          today: todays.length,
          yesterday: yesterdays.length,
          thisWeek: thisWeeks.length,
        },
      });
    }
  }, [lastViewed, notifications, requestLimit]);

  const renderNotification = ({ item }: { item: NotificationType }) => (
    <Notification item={item} screenType={screenType} loggedInUser={loggedInUser} />
  );

  const renderSectionHeader = ({
    section: { title, data },
  }: {
    section: { title: string; data: NotificationType[] };
  }) =>
    data.length !== 0 && (
      <View style={styles.sectionHeaderContainer}>
        <Text style={[styles.sectionFont, styles.sectionHeader, styles.sectionLocation]}>
          {title}
        </Text>
      </View>
    );

  const renderSectionFooter = ({ section: { title } }: { section: { title: string } }) => {
    if (title === 'Friend Requests') {
      if (footerEnabled) {
        return (
          <TouchableOpacity
            style={styles.sectionHeaderContainer}
            onPress={() => {
              track(
                'CollapseFriendRequestSection',
                AnalyticVerb.Pressed,
                AnalyticCategory.Notification,
                {
                  friendRequests: allFriendRequests.length,
                },
              );
              setRequestLimit(DEFAULT_NOTIFICATIONS_SIZE);
            }}>
            <View style={[styles.sectionLocation, styles.hiddenSectionContainer]}>
              <Image style={styles.hideImageStyles} source={images.main.hide_caret} />
              <Text style={[styles.sectionFont, styles.sectionFooter]}>{'Hide'}</Text>
            </View>
          </TouchableOpacity>
        );
      }

      if (allFriendRequests.length > DEFAULT_NOTIFICATIONS_SIZE) {
        return (
          <TouchableOpacity
            style={styles.sectionHeaderContainer}
            onPress={() => {
              track(
                'ExpandFriendRequestSection',
                AnalyticVerb.Pressed,
                AnalyticCategory.Notification,
                {
                  friendRequests: allFriendRequests.length,
                },
              );
              setRequestLimit(allFriendRequests.length);
            }}>
            <Text style={[styles.sectionFont, styles.sectionFooter, styles.sectionLocation]}>
              {`+ ${allFriendRequests.length - requestLimit} More`}
            </Text>
          </TouchableOpacity>
        );
      }
    }

    return null;
  };

  return (
    <View style={styles.background}>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        <SectionList
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          stickySectionHeadersEnabled={false}
          sections={sectionedNotifications}
          keyExtractor={(item, index) => item.timestamp.toString() + index.toString()}
          renderItem={renderNotification}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={renderSectionFooter}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          extraData={requestLimit}
          ListEmptyComponent={
            <View style={styles.emptyViewContainer}>
              <EmptyContentView viewType={'Notification'} />
            </View>
          }
        />
      </SafeAreaView>
      <TabsGradient />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: '20%',
    minHeight: (SCREEN_HEIGHT * 8) / 10,
  },
  container: {
    marginTop: HeaderHeight,
  },
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'white',
  },
  header: {
    width: SCREEN_WIDTH * 0.85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    marginLeft: '15%',
  },
  headerText: {
    fontWeight: '700',
    fontSize: normalize(18),
    lineHeight: normalize(21),
  },
  sectionHeaderContainer: {
    width: '100%',
    backgroundColor: 'white',
  },

  sectionLocation: {
    marginLeft: '8%',
    marginTop: '5%',
    marginBottom: '2%',
  },

  sectionFont: {
    fontWeight: '600',
    fontSize: normalize(12),
    lineHeight: normalize(14),
  },
  hiddenSectionContainer: {
    flexDirection: 'row',
  },
  hideImageStyles: { alignSelf: 'center', marginRight: 8 },
  sectionHeader: {
    color: '#828282',
  },
  sectionFooter: {
    color: '#698DD3',
  },
  emptyViewContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default NotificationsScreen;
