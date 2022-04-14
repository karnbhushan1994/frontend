import React, { useEffect, useState } from 'react';

import { RouteProp, useNavigation } from '@react-navigation/native';
import { FlatList, StatusBar, StyleSheet } from 'react-native';
import { Image, Text } from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from 'assets/images';
import { SearchBackground, SearchCategories, TabsGradient, TaggLoadingIndicator } from 'components';
import ExploreSectionUser from 'components/search/ExploreSectionUser';
import { headerBarOptions, MainStackParams } from 'routes';
import { getDiscoverUsers } from 'services/ExploreService';
import { ProfilePreviewType } from 'types';
import { HeaderHeight, normalize, SCREEN_HEIGHT, SCREEN_WIDTH, shuffle } from 'utils';

type DiscoverUsersRouteProps = RouteProp<MainStackParams, 'DiscoverUsers'>;

interface DiscoverUsersProps {
  route: DiscoverUsersRouteProps;
}

const DiscoverUsers: React.FC<DiscoverUsersProps> = ({ route }) => {
  const { name } = route.params.searchCategory;
  const [categoryName, setCategoryName] = useState<string | undefined>();
  const [users, setUsers] = useState<ProfilePreviewType[]>([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [showIcon1, setShowIcon1] = useState(true);
  const mtUser = (key: number) => ({
    id: key,
    username: '...',
    first_name: '',
    last_name: '',
    thumbnail_url: '',
  });
  const dummyUsers: any[] = [
    mtUser(-1),
    mtUser(-2),
    mtUser(-3),
    mtUser(-4),
    mtUser(-5),
    mtUser(-6),
    mtUser(-7),
    mtUser(-8),
    mtUser(-9),
  ];
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  navigation.setOptions({
    ...headerBarOptions('white', name),
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          setShowIcon1(!showIcon1);
          setShouldRefresh(true);
        }}>
        <Image
          source={showIcon1 ? images.main.shuffle1 : images.main.shuffle2}
          style={styles.shuffleIcon}
        />
      </TouchableOpacity>
    ),
  });

  useEffect(() => {
    setCategoryName(name);
  }, []);

  useEffect(() => {
    if (shouldRefresh) {
      setLoading(true);
      setTimeout(() => {
        setUsers(shuffle(users));
        setShouldRefresh(false);
        setLoading(false);
      }, 500);
    }
  }, [shouldRefresh, users]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (!categoryName) {
        return;
      }
      const fetched_users = await getDiscoverUsers(categoryName);
      if (fetched_users) {
        setUsers(fetched_users);
      }
      setLoading(false);
    };
    loadData();
  }, [categoryName]);

  const _renderItem = ({ item: user }: { item: ProfilePreviewType }) => (
    <ExploreSectionUser key={user.id} user={user} style={styles.user} />
  );

  return (
    <SearchBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        {loading && <TaggLoadingIndicator fullscreen={true} />}
        <FlatList
          data={loading ? dummyUsers : users.slice(0, 9)}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
          columnWrapperStyle={styles.columnWrapperStyle}
          numColumns={3}
          keyExtractor={item => item.id}
          renderItem={_renderItem}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            <>
              <Text style={styles.otherGroups}>Other Groups</Text>
              <SearchCategories useSuggestions={true} darkStyle={true} />
            </>
          )}
        />
        <TabsGradient />
      </SafeAreaView>
    </SearchBackground>
  );
};

const styles = StyleSheet.create({
  header: { width: SCREEN_WIDTH },
  headerText: {
    top: HeaderHeight,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: normalize(18),
    lineHeight: normalize(35),
    marginBottom: '5%',
  },
  scrollView: {
    top: HeaderHeight,
    marginTop: '10%',
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT - HeaderHeight,
    alignSelf: 'center',
    flexDirection: 'column',
  },
  user: {
    margin: '2%',
  },
  columnWrapperStyle: {
    width: SCREEN_WIDTH * 0.95,
    justifyContent: 'space-between',
  },
  contentContainerStyle: {
    width: SCREEN_WIDTH * 0.95,
    paddingBottom: SCREEN_HEIGHT * 0.2,
  },
  otherGroups: {
    color: 'white',
    fontSize: normalize(18),
    fontWeight: '600',
    lineHeight: normalize(35),
    alignSelf: 'center',
    marginTop: 20,
  },
  shuffleIcon: {
    width: 40,
    height: 40,
    marginRight: 20,
  },
});

export default DiscoverUsers;
