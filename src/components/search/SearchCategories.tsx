import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';

import { useSelector } from 'react-redux';

import { getSuggestedSearchBubbleSuggestions } from 'services';
import { RootState } from 'store/rootReducer';
import { SearchCategoryType } from 'types';

import GradientBorderButton from '../common/GradientBorderButton';

interface SearchCategoriesProps {
  darkStyle?: boolean;
  useSuggestions: boolean;
}

const SearchCategories: React.FC<SearchCategoriesProps> = ({
  darkStyle = false,
  useSuggestions,
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {
    profile: { university = '' },
  } = useSelector((state: RootState) => state.user);
  const defaultButtons: SearchCategoryType[] = [21, 22, 23, 24].map((year, index) => ({
    id: index * -1,
    name: `${university.split(' ')[0]} '${year}`,
    category: university,
  }));
  const createLoadingCategory: (key: number) => SearchCategoryType = key => ({
    id: key,
    name: '...',
    category: '...',
  });
  const [buttons, setButtons] = useState<SearchCategoryType[]>([
    createLoadingCategory(1),
    createLoadingCategory(2),
    createLoadingCategory(3),
    createLoadingCategory(4),
  ]);

  useEffect(() => {
    const loadButtons = async () => {
      const localButtons = await getSuggestedSearchBubbleSuggestions();
      setButtons([]);
      if (localButtons) {
        setButtons(localButtons);
      }
    };
    if (useSuggestions) {
      loadButtons();
    } else {
      setButtons(defaultButtons);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        {buttons.map((searchCategory, index) => (
          <GradientBorderButton
            key={index}
            text={searchCategory.name}
            darkStyle={darkStyle}
            onPress={() => {
              if (searchCategory.name !== '...') {
                navigation.push('DiscoverUsers', {
                  searchCategory,
                });
              }
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
});
export default SearchCategories;
