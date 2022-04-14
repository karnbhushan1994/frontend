import React, { useEffect, useState } from 'react';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { SearchBar, TaggUserSelectionCell } from 'components';
import { MainStackParams } from 'routes';
import { getAllTaggUsers, loadSearchResults } from 'services';
import { MomentTagType, ProfilePreviewType } from 'types';
import { isIPhoneX, normalize, SCREEN_HEIGHT, SCREEN_WIDTH, StatusBarHeight } from 'utils';

import { SEARCH_ENDPOINT } from '../../constants';

type TagSelectionScreenRouteProps = RouteProp<MainStackParams, 'TagSelectionScreen'>;
interface TagSelectionScreenProps {
  route: TagSelectionScreenRouteProps;
}

const TagSelectionScreen: React.FC<TagSelectionScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { selectedTags } = route.params;
  const [users, setUsers] = useState<ProfilePreviewType[]>([]);
  const [tags, setTags] = useState<MomentTagType[]>(selectedTags);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [label, setLabel] = useState<string>('Recent');
  const paddingBottom = useBottomTabBarHeight();

  /*
   * Add back button, Send selected users to CaptionScreen
   */
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('TagFriendsScreen', {
              ...route.params,
              selectedTags: tags,
            });
          }}>
          <SvgXml
            xml={icons.BackArrow}
            height={normalize(18)}
            width={normalize(18)}
            color={'black'}
            style={styles.backButton}
          />
        </TouchableOpacity>
      ),
    });
  });

  /*
   *  Load the initial list users from search/suggested endpoint
   * that the loggedInUser might want to select
   */
  const loadUsers = async () => {
    const data = await getAllTaggUsers();
    const filteredData: ProfilePreviewType[] = data.filter(user => {
      const index = tags.findIndex(tag => tag.user.id === user.id);
      return index === -1;
    });
    setUsers([...filteredData, ...tags.map(tag => tag.user)]);
  };

  /*
   * Load list of users based on search query
   */
  const getQuerySuggested = async () => {
    if (query.length > 0) {
      const searchResults = await loadSearchResults(`${SEARCH_ENDPOINT}?query=${query}`);
      setUsers(searchResults ? searchResults.users : []);
    } else {
      setUsers([]);
    }
  };

  /*
   * Make calls to appropriate functions to load user lists for selection
   */
  useEffect(() => {
    if (query.length === 0) {
      setLabel('Recent');
      loadUsers();
    }

    if (!searching) {
      return;
    }

    if (query.length < 3) {
      return;
    }
    setLabel('');
    getQuerySuggested();
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          onChangeText={setQuery}
          onFocus={() => {
            setSearching(true);
          }}
          value={query}
        />
      </View>
      {label !== '' && <Text style={styles.title}>{label}</Text>}
      {users && (
        <FlatList
          data={users}
          contentContainerStyle={{ paddingBottom: paddingBottom }}
          keyExtractor={item => item.id}
          renderItem={item => (
            <TaggUserSelectionCell
              key={item.item.id}
              item={item.item}
              tags={tags}
              setTags={setTags}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBarHeight,
    backgroundColor: 'white',
    height: SCREEN_HEIGHT,
  },
  backButton: {
    marginLeft: 30,
    marginTop: 20,
  },
  searchBarContainer: {
    width: SCREEN_WIDTH * 0.9,
    alignSelf: 'flex-end',
    marginTop: isIPhoneX() ? 15 : 12,
    marginBottom: '3%',
  },
  title: {
    fontWeight: '700',
    fontSize: normalize(17),
    lineHeight: normalize(20.29),
    marginHorizontal: '7%',
    marginBottom: '2%',
  },
});

export default TagSelectionScreen;
