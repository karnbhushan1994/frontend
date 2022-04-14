import 'react-native-gesture-handler';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';

import { AppRegistry, LogBox } from 'react-native';

import { Text, TextInput } from 'react-native';

import appsFlyer from 'react-native-appsflyer';

import logger from 'utils/logger';

import { name as appName } from './app.json';
import App from './src';

import 'react-native-url-polyfill/auto';

appsFlyer.initSdk(
  {
    devKey: 'EMpvHzrcqsWwfyP8qZPow9',
    isDebug: false,
    appId: '1537853613',
    onInstallConversionDataListener: true, //Optional
    onDeepLinkListener: true, //Optional
    timeToWaitForATTUserAuthorization: 10, //for iOS 14.5
  },
  result => {
    console.log('AppsFlyer integration result: ');
    console.log(result);
  },
  error => {
    console.error(error);
  },
);

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

messaging().setBackgroundMessageHandler(async remoteMessage => {
  logger.log('Message handled in background ', remoteMessage);
});

crashlytics().log('App mounted.');

LogBox.ignoreAllLogs(); //TODO uncomment if needed

AppRegistry.registerComponent(appName, () => App);
