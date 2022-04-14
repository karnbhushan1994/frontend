import React, { useEffect, useState } from 'react';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { Background, MomentCategory } from 'components';

import { MainStackParams } from 'routes';
import { loadUserMomentCategories, updateMomentCategories } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from 'types';
import { normalize, SCREEN_WIDTH, track } from 'utils';
import logger from 'utils/logger';

import { MOMENT_CATEGORIES, TAGG_LIGHT_BLUE_2 } from '../../constants';
import { ERROR_SOMETHING_WENT_WRONG } from '../../constants/strings';

type CategorySelectionRouteProps = RouteProp<MainStackParams, 'CategorySelection'>;

type CategorySelectionNavigationProps = StackNavigationProp<MainStackParams, 'CategorySelection'>;

interface CategorySelectionProps {
  route: CategorySelectionRouteProps;
  navigation: CategorySelectionNavigationProps;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { newCustomCategory } = route.params;
  const { momentCategories = [] } = useSelector((state: RootState) => state.momentCategories);
  const { user } = useSelector((state: RootState) => state.user);

  // Stores all the categories that will be saved to the store
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  /**
   * Stores all the custom categories for the UI, allow easier logic for
   * unchecking a custom category.
   *
   * Each uncommited custom category should also have a copy in selectedCategories
   * since that's the final value that will be stored in the store.
   */
  const [uncommitedCustomCategories, setUncommitedCustomCategories] = useState<string[]>([]);

  const customCategories = momentCategories.filter(mc => !MOMENT_CATEGORIES.includes(mc));

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity onPress={handleButtonPress}>
        <Text style={styles.createLabel}>Create</Text>
      </TouchableOpacity>
    ),
  });

  useEffect(() => {
    if (newCustomCategory) {
      setUncommitedCustomCategories([...uncommitedCustomCategories, newCustomCategory]);
      selectedCategories.push(newCustomCategory);
    }
  }, [newCustomCategory]);

  /**
   * Handle selection of a new category
   * case isAdded:
   *    Return without doing anything
   * case isSelected:
   *    Add to the selected categories
   * case not isSelected:
   *    Remove from the selected categories
   */
  const onSelect = (category: string, isSelected: boolean, isAdded: boolean) => {
    if (isAdded) {
      return;
    }
    if (isSelected) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(item => item !== category));
    }
  };

  /**
   * Handle deselection of custom category.
   *
   * Custom categories is "added" and "selected" by CreateCustomCategory screen.
   * User can only "deselect" an uncommited custom category.
   *
   * case isAdded || isSelected:
   *    Return without doing anything
   * default:
   *    Remove from selected categories AND uncommitedCustomCategories
   */
  const onDeselectCustomCategory = (category: string, isSelected: boolean, isAdded: boolean) => {
    if (isAdded || isSelected) {
      return;
    }
    setSelectedCategories(selectedCategories.filter(item => item !== category));
    setUncommitedCustomCategories(uncommitedCustomCategories.filter(item => item !== category));
  };

  const handleButtonPress = async () => {
    track('CreateButton', AnalyticVerb.Pressed, AnalyticCategory.AddAPage, {
      categories: momentCategories.length + selectedCategories.length,
    });
    if (momentCategories.length + selectedCategories.length === 0) {
      Alert.alert('Please select at least 1 category');
      return;
    }
    try {
      await Promise.all([
        dispatch(updateMomentCategories(momentCategories.concat(selectedCategories))),
      ]);
      await Promise.all([dispatch(loadUserMomentCategories(user.userId))]);
      track('AddAPage', AnalyticVerb.Finished, AnalyticCategory.AddAPage);
      navigation.navigate('Profile', {
        redirectToPage: selectedCategories[0],
        showShareModalParm: false,
      });
    } catch (error) {
      logger.log(error);
      Alert.alert(ERROR_SOMETHING_WENT_WRONG);
    }
  };

  /**
   * Using a scroll view to accomodate dynamic category creation later on
   */
  return (
    <ScrollView bounces={false}>
      <Background style={styles.container} gradientType={BackgroundGradientType.Dark}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.subtext}>Create a Page</Text>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.createCategory}
            onPress={() => {
              track('CreateCustomPage', AnalyticVerb.Pressed, AnalyticCategory.AddAPage);
              navigation.push('CreateCustomCategory', {
                existingCategories: momentCategories.concat(selectedCategories),
                fromScreen: route.name,
              });
            }}>
            <SvgXml xml={icons.PlusIcon} width={30} height={30} color="white" />
            <Text style={styles.createCategoryLabel}>Create your own page</Text>
          </TouchableOpacity>
          <View style={styles.linkerContainer}>
            {/* commited custom categories */}
            {customCategories.map((category, index) => (
              <MomentCategory
                key={index}
                categoryType={category}
                isSelected={selectedCategories.includes(category)}
                isAdded={true}
                onSelect={onDeselectCustomCategory}
              />
            ))}
            {/* uncommited custom categroies */}
            {uncommitedCustomCategories.map((category, index) => (
              <MomentCategory
                key={index}
                categoryType={category}
                isSelected={selectedCategories.includes(category)}
                isAdded={false}
                onSelect={onDeselectCustomCategory}
              />
            ))}
            {customCategories.length + uncommitedCustomCategories.length !== 0 && (
              <View style={styles.divider} />
            )}
            {MOMENT_CATEGORIES.map((category, index) => (
              <MomentCategory
                key={index}
                categoryType={category}
                isSelected={selectedCategories.includes(category)}
                isAdded={momentCategories.includes(category)}
                onSelect={onSelect}
              />
            ))}
          </View>
        </View>
      </Background>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: '10%',
  },
  linkerContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: '10%',
  },
  subtext: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: '8%',
    marginHorizontal: '10%',
    marginTop: '15%',
  },
  createCategory: {
    backgroundColor: '#53329B',
    width: SCREEN_WIDTH * 0.9,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: '5%',
  },
  createCategoryLabel: {
    color: 'white',
    marginLeft: '3%',
    fontSize: 18,
    fontWeight: '500',
  },
  divider: {
    borderColor: 'white',
    borderBottomWidth: 1,
    width: SCREEN_WIDTH * 0.9,
    marginVertical: '2%',
  },
  createLabel: {
    color: TAGG_LIGHT_BLUE_2,
    marginRight: 20,
    fontSize: normalize(15),
    fontWeight: '800',
  },
});

export default CategorySelection;
