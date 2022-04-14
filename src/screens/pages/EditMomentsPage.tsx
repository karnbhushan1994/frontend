import { DELETE_PAGE, HOMEPAGE, SUCCESS_EDIT_MOMENT_PAGE, TaggAlertTextList } from 'constants';

import React, { useCallback, useState } from 'react';

import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { TextInput } from 'react-native-gesture-handler';

import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons/index';
import { TaggAlert, TaggLoadingIndicator } from 'components';
import SimpleButton from 'components/widgets/SimpleButton';

import { MainStackParams } from 'routes';
import { editMomentPageTitleService } from 'services';
import { loadUserMomentCategories, loadUserMoments, updateMomentCategories } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, ScreenType } from 'types';
import { normalize, SCREEN_HEIGHT, SCREEN_WIDTH, track } from 'utils';

type EditMomentsPageRouteProp = RouteProp<MainStackParams, 'EditMomentsPage'>;
type EditMomentsPageNavigationProp = StackNavigationProp<MainStackParams, 'EditMomentsPage'>;

interface EditMomentsPageProp {
  route: EditMomentsPageRouteProp;
  navigation: EditMomentsPageNavigationProp;
}
const EditMomentsPage: React.FC<EditMomentsPageProp> = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);
  const { currentPageName: oldPageName } = route.params;
  const { momentCategories = [] } = useSelector((state: RootState) => state.momentCategories);
  const [newPageName, setNewPageName] = useState<string>(oldPageName);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeletePageAlert, setShowDeletePageAlert] = useState<boolean>(false);
  //To hide/display tab bar since this screen must not have a tab bar
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarVisible: false,
      });
      return () => {
        navigation.getParent()?.setOptions({
          tabBarVisible: true,
        });
      };
    }, [navigation]),
  );

  // Function to make a call to a service to edit page title service
  const handleSave = async () => {
    setLoading(true);
    const success = await editMomentPageTitleService(oldPageName, newPageName);
    if (success) {
      track('SaveEditMomentPage', AnalyticVerb.Finished, AnalyticCategory.EditAPage);

      await Promise.all([
        dispatch(loadUserMoments(user.userId)),
        dispatch(loadUserMomentCategories(user.userId)),
      ]);

      setLoading(false);

      Alert.alert(SUCCESS_EDIT_MOMENT_PAGE);
      navigation.navigate('Profile', {
        userXId: undefined,
        screenType: ScreenType.Profile,
        redirectToPage: newPageName,
        showShareModalParm: false,
      });
    } else {
      setLoading(false);
      track('SaveEditMomentPage', AnalyticVerb.Failed, AnalyticCategory.EditAPage);
    }
  };

  return (
    <View style={styles.fullScreenContainer}>
      {loading && <TaggLoadingIndicator fullscreen />}
      <View style={styles.contentContainer}>
        <Text style={styles.pageTitle}>{`Edit ${oldPageName}`}</Text>
        <Text style={styles.pageSubTitle}>{'Edit title and delete page'}</Text>
        <>
          <Text style={styles.changePageTitleLabel}>{'Change Page Title'}</Text>
          <TextInput
            style={styles.changePageTitleInput}
            placeholder={oldPageName}
            placeholderTextColor={'#808080'}
            defaultValue={oldPageName}
            onChangeText={setNewPageName}
          />
        </>
        <TouchableOpacity style={styles.deleteSection} onPress={() => setShowDeletePageAlert(true)}>
          <Image source={icons.DeleteCircleRedIcon} style={styles.icon} />
          <Text style={styles.deleteText}>{DELETE_PAGE}</Text>
        </TouchableOpacity>
        <SimpleButton
          title={'Save'}
          onPress={handleSave}
          containerStyles={styles.buttonContainer}
          disabled={false}
        />
        <TaggAlert
          alertVisible={showDeletePageAlert}
          setAlertVisible={setShowDeletePageAlert}
          title={TaggAlertTextList.DELETE_PAGE.title}
          subheading={TaggAlertTextList.DELETE_PAGE.subheading}
          acceptButtonText={TaggAlertTextList.DELETE_PAGE.acceptButtonText}
          handleAccept={async () => {
            const updateInProgress = (value: boolean) => {
              if (setLoading) {
                setLoading(value);
              }
            };

            track('DeletePage', AnalyticVerb.Finished, AnalyticCategory.EditAPage);
            if (oldPageName === HOMEPAGE) {
              setShowDeletePageAlert(false);
              Alert.alert('Cannot Delete Home Page');
            } else {
              let filteredPages = await momentCategories.filter(mC => mC !== oldPageName);
              await Promise.all([dispatch(updateMomentCategories(filteredPages))]);
              await Promise.all([dispatch(loadUserMomentCategories(user.userId))]);
              updateInProgress(false);
              setShowDeletePageAlert(false);
              navigation.goBack();
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    backgroundColor: '#fff',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.91,
  },
  pageTitle: {
    fontSize: normalize(17),
    fontWeight: '700',
    lineHeight: normalize(21.48),
    letterSpacing: normalize(0.3),
    textAlign: 'center',
    top: '5%',
  },
  pageSubTitle: {
    fontSize: normalize(13),
    color: '#828282',
    fontWeight: '400',
    lineHeight: normalize(15.51),
    letterSpacing: normalize(0.3),
    textAlign: 'center',
    top: '5%',
  },
  changePageTitleLabel: {
    fontSize: normalize(13),
    color: '#000',
    fontWeight: '600',
    lineHeight: normalize(21.09),
    top: '25%',
  },
  changePageTitleInput: {
    top: '25%',
    backgroundColor: '#e8e8e8',
    width: '100%',
    height: normalize(41),
    borderRadius: normalize(8),
    paddingLeft: '4%',
    fontWeight: '500',
  },

  deleteSection: {
    flexDirection: 'row',
    top: '70%',
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 10,
    color: 'red',
  },
  deleteText: {
    color: '#EF1F51',
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
    top: '50%',
  },
});

export default EditMomentsPage;
