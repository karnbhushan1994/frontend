import React from 'react';

import { FlatList, Image, ImageProps, Text, TouchableOpacity, View } from 'react-native';

import { images } from 'assets/images';

import { navigate } from 'RootNavigation';

import { AnalyticCategory, AnalyticVerb } from 'types';
import { track } from 'utils';

import styles from './styles';

const data = [
  {
    coverImg: images.explore.profile_skins,
    title: 'Profile Skins',
    onPress: () => {
      navigate('ChangeSkinsScreen');
    },
  },
  {
    coverImg: images.explore.social_media,
    title: 'Social Media',
    onPress: () => {
      navigate('FilteredTaggShop', { filter: ['social media'], title: 'Social Media' });
    },
  },
  {
    coverImg: images.explore.video,
    title: 'Video',
    onPress: () => {
      navigate('FilteredTaggShop', { filter: ['video', 'streaming'], title: 'Video' });
    },
  },
  {
    coverImg: images.explore.music,
    title: 'Music',
    onPress: () => {
      navigate('FilteredTaggShop', { filter: ['music'], title: 'Music' });
    },
  },
  {
    coverImg: images.explore.product,
    title: 'Product',
    onPress: () => {
      navigate('FilteredTaggShop', { filter: ['product'], title: 'Product' });
    },
  },
  {
    coverImg: images.explore.utility,
    title: 'Utility',
    onPress: () => {
      navigate('FilteredTaggShop', { filter: ['app store'], title: 'Utility' });
    },
  },
];

export const Explore: React.FC = () => {
  const _renderItem = ({
    title,
    coverImg,
    onPress,
  }: {
    coverImg: ImageProps;
    title: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={styles.exploreItem}
      onPress={() => {
        track(`ExploreTaggs: ${title}`, AnalyticVerb.Selected, AnalyticCategory.Taggs);
        onPress();
      }}>
      <Image source={coverImg} style={styles.exploreItemBg} />
      <Text style={styles.exploreItemTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.explore}>
      <View style={styles.horizontal}>
        <FlatList
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={({ item }) => _renderItem(item)}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.horizontal}
        />
      </View>
      {/*<ScrollView horizontal style={styles.horizontal}>*/}
      {/*  <View style={styles.exploreItem}>*/}
      {/*    <Image source={explore1} style={styles.exploreItemBg} />*/}
      {/*    /!*<Text style={styles.exploreItemTitle}>Profile Skins</Text>*!/*/}
      {/*  </View>*/}
      {/*  <View style={styles.exploreItem}>*/}
      {/*    <Image source={explore2} style={styles.exploreItemBg} />*/}
      {/*    /!*<Text style={styles.exploreItemTitle}>Links</Text>*!/*/}
      {/*  </View>*/}
      {/*  <View style={styles.exploreItem}>*/}
      {/*    <Image source={explore3} style={styles.exploreItemBg} />*/}
      {/*    /!*<Text style={styles.exploreItemTitle}>Musics</Text>*!/*/}
      {/*  </View>*/}
      {/*</ScrollView>*/}
    </View>
  );
};
