import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { getDeviceId, getDeviceName } from 'react-native-device-info';

import logger from 'utils/logger';

import { FCM_ENDPOINT } from '../constants';
import * as RootNavigation from '../RootNavigation';

class FCMService {
  setUpPushNotifications = () => {
    // Requesting user to permit notifications
    this.checkPermission();

    // Registering with FCM to receive unique device/app token
    this.registerAppWithFCM();

    //Store registration_id/device token to AsyncStorage
    this.getToken();

    // Receive a notification
    this.createNotificationListeners();

    // // Schedule a local notification
    // PushNotification.localNotificationSchedule({
    //   //... You can use all the options from localNotifications
    //   message: 'My Notification Message', // (required)
    //   date: new Date(Date.now() + 60 * 1000), // in 60 secs
    //   allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    // });

    // // Send local notification when app in foreground since remote notifications
    // // aren't displayed when app is in the foreground
    // PushNotification.localNotification({
    //   //... You can use all the options from localNotifications
    //   message: 'My Notification Message', // (required)
    //   date: new Date(Date.now() + 60 * 1000), // in 60 secs
    //   allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    //});
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = async () => {
    try {
      const permission = await messaging().hasPermission();
      // Permission might be 0 (not allowed), 1 (allowed), -1(unknown)
      if (permission !== 1) {
        await messaging().requestPermission({
          sound: true,
          announcement: true,
          badge: true,
          alert: true,
        });
      }
    } catch (error) {
      logger.log('[FCMService] Permission Rejected ', error);
    }
  };

  // Receiving fcm unique device token to receive remote messages through fcm
  getToken = async () => {
    messaging()
      .getToken()
      .then(async fcmToken => {
        if (fcmToken) {
          await AsyncStorage.setItem('@fcmToken', fcmToken);
          return fcmToken;
        }
      })
      .catch(error => {
        logger.log('[FCMService] getToken rejected', error);
      });
    return '';
  };

  sendFcmTokenToServer = async () => {
    const registration_id: string | null = await AsyncStorage.getItem('@fcmToken');
    const device_id = getDeviceId();
    const type = Platform.OS;
    let active: boolean = false;
    let name: string = '';
    await getDeviceName().then(deviceName => {
      name = deviceName;
    });

    await messaging()
      .hasPermission()
      .then(hasPermission => {
        active = hasPermission === 1;
      });
    const token = await AsyncStorage.getItem('token');

    if (registration_id && type) {
      let response = await fetch(FCM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        },
        body: JSON.stringify({
          registration_id,
          type,
          device_id,
          name,
          active,
        }),
      });

      if (response.status === 201) {
        logger.log('Successfully stored device token!');
      } else {
        logger.log('Failed to store device token!');
      }
    }
  };

  deactivateFcmService = async () => {
    // TODO: Make PATCH call to deactivate device
    logger.log('Deactivating FCM device');
  };

  createNotificationListeners = () => {
    // Called when app is opened from backrground state
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        if (remoteMessage.category === 'CHAT') {
          RootNavigation.navigate('ChatList');
        } else {
          RootNavigation.navigate('NotificationsScreen');
        }
      }
    });

    messaging().onMessage(remoteMessage => {
      logger.log('Received a remote notification!!', remoteMessage.notification?.body);
    });

    messaging().onTokenRefresh(fcmToken => {
      AsyncStorage.setItem('@fcmToken', fcmToken).catch(err => {
        logger.log('Failed to store new token!');
        logger.log(err);
      });
    });
  };
}

export const fcmService = new FCMService();
