import { Alert, Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import { TAGG_PURPLE } from '../constants';

export const openTaggLink = async (url: string | undefined) => {
  if (!url) {
    return null;
  }
  try {
    if (!(url.startsWith('http://') || url.startsWith('https://'))) {
      url = 'https://' + url;
    }
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: TAGG_PURPLE,
        preferredControlTintColor: 'white',
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
      });
    } else {
      Linking.openURL(url);
    }
  } catch (error) {
    Alert.alert(error);
  }
};
