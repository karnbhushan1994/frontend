import React from 'react';

import { useSelector } from 'react-redux';

import { RootState } from 'store/rootReducer';
import { ProfilePreviewType, CategoryPreviewType } from 'types';

import SearchResultsCell from './SearchResultCell';

interface SearchResultsProps {
  results: ProfilePreviewType[];
  categories: CategoryPreviewType[];
}
const SearchResults: React.FC<SearchResultsProps> = ({ results, categories }) => {
  /**
   * Added the following swicth case to make Results on Search and Recents screen a list
   * Flex is love
   */
  const { user: loggedInUser } = useSelector((state: RootState) => state.user);
  return (
    <>
      {categories
        .slice(0)
        .reverse()
        .map((category: CategoryPreviewType) => (
          <SearchResultsCell key={category.name} profileData={category} {...{ loggedInUser }} />
        ))}
      {results
        .slice(0)
        .reverse()
        .map((profile: ProfilePreviewType) => (
          <SearchResultsCell key={profile.id} profileData={profile} {...{ loggedInUser }} />
        ))}
    </>
  );
};

export default SearchResults;
