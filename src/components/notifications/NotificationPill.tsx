import React, { RefObject, useEffect, useRef, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Image, StyleSheet, Text, View } from 'react-native';
import { normalize } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import { useSelector } from 'react-redux';

import { images } from 'assets/images';
import { getNotificationsUnreadCount } from 'services';
import { RootState } from 'store/rootReducer';
import { isIPhoneX, numberWithCommas } from 'utils';

import { NOTIFICATION_ICON_GRADIENT } from '../../constants';

interface NotificationPillProps {
  parentRef: RefObject<View>;
  show: boolean;
}

export const NotificationPill: React.FC<NotificationPillProps> = ({ parentRef, show }) => {
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const { newNotificationReceived } = useSelector((state: RootState) => state.user);
  const [iconStart, setIconStart] = useState<number[]>([0, 0]);
  const [tipStart, setTipStart] = useState<number[]>([0, 0]);
  const [notificationSets, setNotificationSets] = useState<{
    CMT?: number;
    FRD_REQ?: number;
    P_VIEW?: number;
    MOM_TAG?: number;
    CLICK_TAG?: number;
    M_VIEW?: number;
    COIN?: number;
    NEW_MOM_TAG?: number;
  }>({});
  const [timeCount, setTimeCount] = useState<boolean>(false);
  const [timeOut, setTimeOut] = useState<boolean>(false);
  const pillRef = useRef<View>(null);
  const tipRef = useRef<Image>(null);
  const numItems = Object.keys(notificationSets).length;
  const showInsights =
    notificationSets.CLICK_TAG || notificationSets.M_VIEW || notificationSets.P_VIEW;
  const clearTimeout = !notificationSets.CMT && !showInsights && notificationSets.NEW_MOM_TAG;

  // If there are notifications, determines the size of the pill
  // and sets points for correct placement

  useEffect(() => {
    parentRef.current?.measure(
      (
        _fx: number,
        _fy: number,
        parentWidth: number,
        parentHeight: number,
        _px: number,
        _py: number,
      ) => {
        pillRef.current?.measure(
          (
            __fx: number,
            __fy: number,
            pillWidth: number,
            __pillHeight: number,
            __px: number,
            __py: number,
          ) => {
            tipRef.current?.measure(
              (
                ___fx: number,
                ___fy: number,
                tipWidth: number,
                tipHeight: number,
                ___px: number,
                ___py: number,
              ) => {
                setTipStart([parentWidth / 2 - tipWidth / 2, parentHeight + 5]);
                // some constant found during testing
                const DISTANCE_TO_EDGE_OF_SCREEN = isIPhoneX() ? 25 : 10;
                // do we have enough space to display a center aligned pill?
                // if not calculate the offset we need to left-shift the pill
                const offset =
                  pillWidth / 2 > DISTANCE_TO_EDGE_OF_SCREEN
                    ? pillWidth / 2 - DISTANCE_TO_EDGE_OF_SCREEN
                    : 0;
                if (pillWidth < 40) {
                  setIconStart([
                    parentWidth / 2 - pillWidth / 2 + offset,
                    parentHeight + tipHeight + 3,
                  ]);
                } else {
                  setIconStart([
                    parentWidth / 2 - pillWidth / 2 + offset - (pillWidth < 60 ? 20 : 50),
                    parentHeight + tipHeight + 3,
                  ]);
                }
                //New moments and tagg need to consitant notification pill
                setTimeCount(!clearTimeout);
              },
            );
          },
        );
      },
    );
  }, [notificationSets, parentRef, pillRef, tipRef]);

  // Used so that pill disappears after 10 seconds
  useEffect(() => {
    if (timeCount) {
      setTimeout(() => {
        setTimeOut(!clearTimeout);
      }, 10000);
    }
  }, [timeCount]);

  const updateNotificationsets = (
    notifiactionData: React.SetStateAction<{
      CMT?: number | undefined;
      FRD_REQ?: number | undefined;
      P_VIEW?: number | undefined;
      MOM_TAG?: number | undefined;
      CLICK_TAG?: number | undefined;
      M_VIEW?: number | undefined;
      COIN?: number | undefined;
      NEW_MOM_TAG?: number | undefined;
    }>,
  ) => {
    setTimeout(() => {
      if (notifiactionData) {
        setNotificationSets(notifiactionData);
      }
    }, 100);
  };

  //filtering notification data as per type
  const filterNotification = async (type: string) => {
    const key = 'notificationLastViewed';
    const previousLastViewed = await AsyncStorage.getItem(key);
    const lastViewed = previousLastViewed == null ? moment.unix(0) : moment(previousLastViewed);
    return (
      (notifications ?? []).filter(i => {
        const unread = lastViewed ? lastViewed.diff(moment(i.timestamp)) < 0 : false;
        return i.notification_type === type && i.verbage && unread;
      })?.length || 0
    );
  };

  // Gets data from backend to check for unreads
  useEffect(() => {
    const getCount = async () => {
      let data = await getNotificationsUnreadCount();
      if (notifications.length && newNotificationReceived) {
        const momentCoin = 10 * (await filterNotification('M_VIEW'));
        const profileCoin = 5 * (await filterNotification('CLICK_TAG'));
        const taggCoin = 10 * (await filterNotification('P_VIEW'));
        const newTaggAndMoment =
          (await filterNotification('DFT')) + (await filterNotification('MOMENT_FRIEND'));
        if (momentCoin || profileCoin || taggCoin || newTaggAndMoment) {
          const earnCoin = momentCoin + profileCoin + taggCoin;
          updateNotificationsets({ ...data, COIN: earnCoin, NEW_MOM_TAG: newTaggAndMoment });
        } else {
          updateNotificationsets({ ...data });
        }
      }
    };

    getCount();
  }, []);

  const insights = () => {
    let value = 0;
    if (notificationSets) {
      value = notificationSets.CLICK_TAG ? notificationSets.CLICK_TAG : 0;
      value = value + (notificationSets.P_VIEW ? notificationSets.P_VIEW : 0);
      value = value + (notificationSets.M_VIEW ? notificationSets.M_VIEW : 0);
    }
    return value;
  };

  return (
    <>
      {notificationSets && (numItems > 0 || notificationSets.NEW_MOM_TAG) && show && !timeOut && (
        <>
          <Image
            style={[styles.tip, { left: tipStart[0], top: tipStart[1] }]}
            source={images.main.purple_tip}
            ref={tipRef}
          />
          <View
            style={[styles.pillContainer, { left: iconStart[0], top: iconStart[1] }]}
            ref={pillRef}>
            <LinearGradient colors={NOTIFICATION_ICON_GRADIENT} style={styles.pillBackground}>
              {!notificationSets.CMT && !showInsights && notificationSets.NEW_MOM_TAG && (
                <>
                  <Image source={images.main.cosmoImg} style={styles.indicationIcon} />
                </>
              )}
              {notificationSets.CMT && (
                <>
                  <Image source={images.main.pill_icon_1} style={styles.indicationIcon} />
                  <Text style={styles.text}>{numberWithCommas(notificationSets.CMT)}</Text>
                </>
              )}

              {/* {notificationSets.P_VIEW && (
                <>
                  <Image source={images.main.pill_icon_3} style={styles.indicationIcon} />
                  <Text style={styles.text}>{numberWithCommas(notificationSets.P_VIEW)}</Text>
                </>
              )} */}
              {/* {!!notificationSets.COIN && (
                <>
                  <Image source={images.main.pill_icon_6} style={styles.indicationIcon} />
                  <Text style={styles.text}>{numberWithCommas(notificationSets.COIN)}</Text>
                </>
              )} */}
              {/* {notificationSets.MOM_TAG && (
                <>
                  <SvgXml
                    xml={icons.UserRound}
                    style={styles.indicationIcon}
                    width={13}
                    height={13}
                  />
                  <Text style={styles.text}>{numberWithCommas(notificationSets.MOM_TAG)}</Text>
                </>
              )} */}

              {showInsights && (
                <>
                  <Image source={images.main.pill_icon_5} style={styles.indicationIcon} />
                  <Text style={styles.text}>{numberWithCommas(insights())}</Text>
                </>
              )}
            </LinearGradient>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  pillContainer: {
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  pillBackground: {
    padding: 5,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    margin: 2,
    color: 'white',
    fontSize: normalize(10),
    marginRight: 5,
  },
  tip: {
    position: 'absolute',
    zIndex: 999,
    height: 12,
    width: 20,
    resizeMode: 'contain',
    transform: [
      {
        scaleY: -1,
      },
    ],
  },
  indicationIcon: {
    height: 14,
    width: 14,
    margin: 2,
    marginLeft: 5,
  },
});

export default NotificationPill;
