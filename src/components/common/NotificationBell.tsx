import React, { FC, useEffect, useRef, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import { setNotificationsReadDate } from 'services';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, ScreenType } from 'types';
import { haveUnreadNotifications, track } from 'utils';

import { NotificationPill } from '../notifications';
import NavigationIcon from './NavigationIcon';

interface NotificationBellProps {
  screenType: ScreenType;
  style: StyleProp<ViewStyle>;
}

const NotificationBell: FC<NotificationBellProps> = ({ screenType, style }) => {
  const navigation = useNavigation();
  const { newNotificationReceived } = useSelector((state: RootState) => state.user);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const [unreadNotificationsPresent, setUnreadNotificationsPresent] = useState<boolean>(false);
  const parentRef = useRef(null);
  const [showIcon, setShowIcon] = useState(true);

  useEffect(() => {
    haveUnreadNotifications(notifications).then(haveUnread =>
      setUnreadNotificationsPresent(haveUnread),
    );
  }, [notifications]);

  return (
    <Animated.View style={style}>
      <TouchableOpacity
        ref={parentRef}
        onPress={() => {
          track('NotificationBell', AnalyticVerb.Pressed, AnalyticCategory.Notification, {
            haveUnread: unreadNotificationsPresent,
            pillVisible: showIcon,
          });
          setShowIcon(false);
          setNotificationsReadDate();
          navigation.navigate('NotificationsScreen', { screenType });
        }}>
        <NavigationIcon
          newIcon={newNotificationReceived || unreadNotificationsPresent}
          tab="Notifications"
          disabled={true}
        />
      </TouchableOpacity>
      <NotificationPill parentRef={parentRef} show={showIcon} />
    </Animated.View>
  );
};

export default NotificationBell;
