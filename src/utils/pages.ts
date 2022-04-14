import { HOMEPAGE } from 'constants';

import { Dispatch } from 'react';

import { NavigationProp } from '@react-navigation/native';
import { Alert } from 'react-native';

import { loadUserMomentCategories, updateMomentCategories } from 'store/actions';
import { AnalyticCategory, AnalyticVerb } from 'types';

import { track } from './analytics';

//Function to raise an alert to delete a page
export const handleDeletePage = async (
  screenType: string, // TODO: Confirm type
  momentCategories: string[], // TODO: Confirm type
  userId: string,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
  setInProgess?: any,
) => {
  const updateInProgress = (value: boolean) => {
    if (setInProgess) {
      setInProgess(value);
    }
  };
  Alert.alert(
    'Are you sure you want to delete this page?',
    'All moments will be deleted along with this page.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          track('DeletePage', AnalyticVerb.Finished, AnalyticCategory.EditAPage);
          if (screenType === HOMEPAGE) {
            Alert.alert('Cannot Delete Home Page');
          } else {
            updateInProgress(true);
            let filteredPages = await momentCategories.filter(mC => mC !== screenType);
            await Promise.all([dispatch(updateMomentCategories(filteredPages))]);
            await Promise.all([dispatch(loadUserMomentCategories(userId))]);
            updateInProgress(false);
            navigation.goBack();
          }
        },
      },
    ],
    { cancelable: true },
  );
};
