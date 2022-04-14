import { NAME_A_PAGE } from 'constants';

import React, { useCallback, useState } from 'react';

import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import { Background } from 'components';
import { makeAction } from 'makeAction';
import { MainStackParams } from 'routes';
import {
  loadUserMomentCategories,
  loadUserProfileInfo,
  updateMomentCategories,
} from 'store/actions';
import { RootState } from 'store/rootReducer';
import {
  AnalyticCategory,
  AnalyticVerb,
  BackgroundGradientType,
  Banner,
  TaggScoreBannerText,
} from 'types';
import { SCREEN_HEIGHT, SCREEN_WIDTH, track } from 'utils';

type CreateCustomCategoryRouteProps = RouteProp<MainStackParams, 'CreateCustomCategory'>;

type CreateCustomCategoryNavigationProps = StackNavigationProp<
  MainStackParams,
  'CreateCustomCategory'
>;

interface CreateCustomCategoryProps {
  route: CreateCustomCategoryRouteProps;
  navigation: CreateCustomCategoryNavigationProps;
}

const CreateCustomCategory: React.FC<CreateCustomCategoryProps> = ({ route, navigation }) => {
  /**
   * Same component to be used for category selection while onboarding and while on profile
   */
  const { momentCategories: existingCategories = [] } = useSelector(
    (state: RootState) => state.momentCategories,
  );

  const { fromScreen } = route.params;

  const [newCategory, setNewCategory] = useState('');
  const { user } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

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

  const handleButtonPress = async () => {
    if (existingCategories.includes(newCategory.trim())) {
      Alert.alert('Looks like you already have that one created!');
    } else {
      if (newCategory.trim() !== '') {
        track('CreateCustomCategory', AnalyticVerb.Finished, AnalyticCategory.Moment);
        await Promise.all([
          dispatch(updateMomentCategories([...existingCategories, newCategory.trim()])),
        ]);
        await Promise.all([
          dispatch(loadUserMomentCategories(user.userId)),
          dispatch(loadUserProfileInfo(user.userId)),
        ]);
        if (fromScreen === 'ChoosingCategoryScreen') {
          navigation.navigate('CaptionScreen', {
            selectedCategory: newCategory.trim(),
          });
        } else {
          await navigation.navigate('Profile', {
            redirectToPage: newCategory.trim(),
            showShareModalParm: false,
          });
          setTimeout(() => {
            dispatch(makeAction(Banner.SHOW, true));
            dispatch(makeAction(Banner.TEXT, TaggScoreBannerText.PAGE_CREATE));
            dispatch(makeAction(Banner.POINT, '+ 10'));
          }, 800);
        }
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Background style={styles.container} gradientType={BackgroundGradientType.Dark}>
        <KeyboardAvoidingView style={styles.innerContainer} behavior={'padding'}>
          <Text style={styles.title}>{NAME_A_PAGE}</Text>
          <TextInput
            style={styles.input}
            selectionColor={'white'}
            onChangeText={setNewCategory}
            autoFocus={true}
          />
          <TouchableOpacity onPress={handleButtonPress} style={styles.finalAction}>
            <Text style={styles.finalActionLabel}>{'Create'}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Background>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minHeight: SCREEN_HEIGHT,
  },
  innerContainer: {
    height: '40%',
    top: '20%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    width: SCREEN_WIDTH * 0.75,
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  finalAction: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#8F01FF',
  },
  finalActionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
});

export default CreateCustomCategory;
