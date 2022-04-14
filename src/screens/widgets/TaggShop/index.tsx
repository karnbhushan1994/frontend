import React, { useEffect, useState } from 'react';

import { RouteProp } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  FlatList,
  Image,
  ImageProps,
  Keyboard,
  ListRenderItem,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text } from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

import { images } from 'assets/images';
import { LinkTagg } from 'components/widgets/linkTags';
import TaggDetailView from 'components/widgets/taggDetail';

import { MainStackParams } from 'routes';

import { BackgroundGradientType, WidgetType } from 'types';

import { useDebounce } from 'utils/hooks';

import { BACKGROUND_GRADIENT_MAP } from '../../../constants';
import { TaggShopData } from '../../../constants/widgets';

import styles from './styles';

const imgSrc = images.main.search;

type TaggShopRouteProps = RouteProp<MainStackParams, 'TaggShop'>;

type TaggShopNavigationProps = StackNavigationProp<MainStackParams, 'TaggShop'>;

interface TaggShopProps {
  route: TaggShopRouteProps;
  navigation: TaggShopNavigationProps;
}

const TaggShop: React.FC<TaggShopProps> = ({ route }) => {
  const navigation = useNavigation();
  const { activeTab: screenType, filter, title } = route.params;
  const [taggDetailView, setTaggDetailView] = useState(false);
  const [taggDetailLogo, setTaggDetailLogo] = useState(undefined);
  const [searchItems, setSearchItems] = useState<WidgetType[]>([]);
  const [search, setSearch] = useState('');
  const [, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const [taggShopData] = useState<WidgetType[]>(TaggShopData);

  /**
   * To filter tagg shop data displayed according to selected filter:
   * Social Media, Video, Music, Product, App Store
   */
  useEffect(() => {
    setLoading(false);
    let filteredData = taggShopData;
    if (filter) {
      filteredData = filteredData.filter(item => {
        const subTitle = item.subTitle?.toLowerCase().replace('tagg', '').trim() || '';
        return JSON.stringify(filter).search(subTitle) !== -1;
      });
    }

    if (debouncedSearch.length) {
      filteredData = filteredData.filter(
        item => JSON.stringify(item).match(new RegExp(debouncedSearch, 'ig')),
        // JSON.stringify(item.title && item.subTitle).match(new RegExp(debouncedSearch, 'ig')),
      );
    }
    setSearchItems(filteredData);
  }, [debouncedSearch, filter, taggShopData]);

  const [taggData, setTaggData] = useState<{
    id: number;
    img?: ImageProps;
    title: string;
    subTitle?: string;
    locked: boolean;
    screenType?: string;
  }>({
    id: 0,
    title: '',
    locked: false,
  });

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarVisible: false,
    });
  }, []);

  const _renderItem: ListRenderItem<any> = ({ item }) => (
    <LinkTagg
      id={item.id}
      key={item.id}
      img={item.img}
      title={item.title}
      locked={item.locked}
      subTitle={item.subTitle}
      smallImg={item.smallImg}
      completed={item.completed}
      quantity={item.quantity}
      onPress={() => {
        setTaggDetailLogo(item.img);
        setTaggDetailView(true);
        setTaggData(item);
      }}
      item_color_start={item.item_color_start}
      item_color_end={item.item_color_end}
    />
  );
  // @ts-ignore
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={BACKGROUND_GRADIENT_MAP[BackgroundGradientType.Dark]}
        style={styles.container}>
        <StatusBar barStyle={'light-content'} />
        <SafeAreaView>
          <View style={styles.listContainer}>
            <View style={styles.searchBarStyle}>
              <Image source={imgSrc} style={styles.searchIcon} />
              <TextInput
                style={styles.input}
                placeholderTextColor={'#E7C9FF'}
                placeholder={'Search Taggs'}
                clearButtonMode="always"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={text => {
                  setLoading(true);
                  setSearch(text);
                }}
              />
            </View>
            <View style={styles.content}>
              {/* <View style={styles.scoreListBlock}>
                <TouchableOpacity
                  style={styles.yourListContainer}
                  onPress={() => {
                    track('ExploreTaggs', AnalyticVerb.Pressed, AnalyticCategory.Taggs);
                    navigation.navigate('ExploreTaggs');
                  }}>
                  <SvgXml xml={icons.Cart} height={18} width={18} style={styles.cartIcon} />
                  <Text style={styles.scoreListText}>Explore Taggs</Text>
                </TouchableOpacity>
              </View> */}
              <Text style={styles.scoreListTitle}>{`${title ? title : 'Available'} Taggs`}</Text>
              <FlatList
                data={searchItems}
                renderItem={_renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text>No data found</Text>}
                contentContainerStyle={styles.scrollViewContainer}
                keyExtractor={(_, index) => index.toString()}
              />
              <TaggDetailView
                visible={taggDetailView}
                onClose={() => setTaggDetailView(false)}
                available={!taggData.locked}
                logo={taggDetailLogo}
                modalButtonPress={() => {
                  navigation.navigate('AddTagg', { data: taggData, screenType });
                  setTaggDetailView(false);
                }}
                data={taggData}
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default TaggShop;
