import AsyncStorage from '@react-native-community/async-storage';

import logger from 'utils/logger';

import { SEARCH_ENDPOINT_SUGGESTED } from '../constants';
import { loadSearchResults } from '../services';
import { CategoryPreviewType, ProfilePreviewType } from '../types';

/*
 * AsyncStorage key for list of recently-searched users.
 */
const recentlySearchedUsersKey = '@recently_searched_users';

/*
 * Stores `user` in AsyncStorage as a recently-searched user.
 */
export const addUserToRecentlySearched = async (user: ProfilePreviewType) => {
  let users: ProfilePreviewType[];
  // retrieve and update recently-searched categories list
  try {
    const usersJSON = await AsyncStorage.getItem(recentlySearchedUsersKey);
    if (usersJSON) {
      users = JSON.parse(usersJSON);
      // if category already exists, move it to the end
      for (let i = 0; i < users.length; i++) {
        // TODO: speed up comparison by adding some id field to category
        if (users[i].id === user.id) {
          users.splice(i, 1);
          break;
        }
      }
      users.push(user);
    } else {
      users = [user];
    }
    // store updated list of recently-searched categories
    try {
      AsyncStorage.setItem(recentlySearchedUsersKey, JSON.stringify(users));
    } catch (e) {
      logger.log(e);
    }
  } catch (e) {
    logger.log(e);
  }
};

/*
 * Retrieves and returns user's recently-searched categories from AsyncStorage.
 */
export const getRecentlySearchedUsers = async (): Promise<ProfilePreviewType[]> => {
  try {
    const usersJSON = await AsyncStorage.getItem(recentlySearchedUsersKey);
    if (usersJSON) {
      return JSON.parse(usersJSON);
    }
  } catch (e) {
    logger.log(e);
  }
  return [];
};

/*
 * AsyncStorage key for list of recently-searched categories.
 */
const recentlySearchedCategoriesKey = '@recently_searched_categories';

/*
 * Stores `category` in AsyncStorage as a recently-searched category.
 */
export const addCategoryToRecentlySearched = async (category: CategoryPreviewType) => {
  let categories: CategoryPreviewType[];
  // retrieve and update recently-searched categories list
  try {
    const categoriesJSON = await AsyncStorage.getItem(recentlySearchedCategoriesKey);
    if (categoriesJSON) {
      categories = JSON.parse(categoriesJSON);
      // if category already exists, move it to the end
      for (let i = 0; i < categories.length; i++) {
        // TODO: speed up comparison by adding some id field to category
        if (categories[i].name === category.name) {
          categories.splice(i, 1);
          break;
        }
      }
      categories.push(category);
    } else {
      categories = [category];
    }
    // store updated list of recently-searched categories
    try {
      AsyncStorage.setItem(recentlySearchedCategoriesKey, JSON.stringify(categories));
    } catch (e) {
      logger.log(e);
    }
  } catch (e) {
    logger.log(e);
  }
};

/*
 * Retrieves and returns user's recently-searched categories from AsyncStorage.
 */
export const getRecentlySearchedCategories = async (): Promise<CategoryPreviewType[]> => {
  try {
    const categoriesJSON = await AsyncStorage.getItem('@recently_searched_categories');
    if (categoriesJSON) {
      return JSON.parse(categoriesJSON);
    }
  } catch (e) {
    logger.log(e);
  }
  return [];
};

/*
 * Retrieves and returns a list of suggested tagg users
 */
export const loadTaggUserSuggestions = async (): Promise<ProfilePreviewType[]> => {
  const searchResults = await loadSearchResults(`${SEARCH_ENDPOINT_SUGGESTED}`);
  return searchResults ? searchResults.users : [];
};
