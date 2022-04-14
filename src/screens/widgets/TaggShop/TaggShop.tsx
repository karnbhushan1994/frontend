import React, { FC, useEffect, useState } from 'react';

import { RouteProp } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  Image,
  ImageProps,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from 'react-native-animatable';

import LinearGradient from 'react-native-linear-gradient';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { ButtonWithGradientBackground } from 'components/widgets/buttonWithGradientBackground';
import ProgressLiner from 'components/widgets/progressLiner';
import TaggDetailView from 'components/widgets/taggDetail';

import { MainStackParams } from 'routes';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType, ScreenType } from 'types';

import { BACKGROUND_GRADIENT_MAP } from '../../../constants';
import { track } from '../../../utils';
import styles from './styles';

const lockIcon = require('assets/icons/findFriends/lock-icon.png');
const imgSrc = require('assets/navigationIcons/search.png');
const appleMusicBox = require('assets/socials/apple-music-box.png');
const depopBox = require('assets/socials/depop-box.png');
const twitchBox = require('assets/socials/twitch-box.png');

type TaggShopRouteProps = RouteProp<MainStackParams, 'TaggShop'>;

type TaggShopNavigationProps = StackNavigationProp<MainStackParams, 'TaggShop'>;

interface TaggShopProps {
  route: TaggShopRouteProps;
  navigation: TaggShopNavigationProps;
}

const TaggShopData = [
  {
    id: 1111,
    img: twitchBox,
    title: 'Twitch Tagg',
    locked: false,
  },
  {
    id: 2222,
    img: depopBox,
    title: 'Depop Tagg',
    locked: false,
    smallImg: true,
  },
  {
    id: 3333,
    img: appleMusicBox,
    title: 'Twitch Tagg',
    locked: true,
    completed: 256,
    quantity: 1156,
  },
];

interface LinkTaggProps {
  img: ImageProps;
  title: string;
  locked?: boolean;
  smallImg?: boolean;
  completed?: number;
  quantity?: number;
  onPress?: () => void;
}

const LinkTagg: FC<LinkTaggProps> = ({
  img,
  title,
  locked,
  smallImg,
  completed,
  quantity,
  onPress,
}) => (
  <TouchableOpacity style={styles.linkTagItem} onPress={() => onPress && !locked && onPress()}>
    <LinearGradient
      style={styles.linearGradient}
      colors={['rgba(0,0,0,0.76)', 'rgba(0,0,0,0.04)']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
    />
    <Image source={img} style={styles.blurBG} blurRadius={20} />
    <Image
      source={img}
      style={[styles.image, smallImg && styles.smallImage]}
      resizeMode={'contain'}
    />
    <View style={styles.titleButtonBlock}>
      <View>
        <Text style={styles.titleTop}>LINK TAGG</Text>
        <Text style={styles.titleBottom}>{title}</Text>
      </View>
      <ButtonWithGradientBackground
        onPress={() => {}}
        disabled={locked}
        buttonStartIcon={lockIcon}
      />
    </View>
    {completed && quantity ? (
      <View style={styles.progressBlockWrapper}>
        <View style={styles.progressBlock}>
          <ProgressLiner completed={completed} quantity={quantity} blackMode height={10} />
        </View>
        <Text style={styles.progressInfoText}>
          {completed}
          <Text style={styles.quantity}> / {quantity}</Text>
        </Text>
      </View>
    ) : null}
  </TouchableOpacity>
);

const TaggShop: React.FC<TaggShopProps> = () => {
  const navigation = useNavigation();
  const [taggDetailView, setTaggDetailView] = useState(false);
  const [taggDetailLogo, setTaggDetailLogo] = useState(undefined);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarVisible: false,
    });
  }, []);
  return (
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
              placeholder={'Search Widgets'}
              clearButtonMode="always"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.scoreListBlock}>
            <TouchableOpacity
              style={styles.yourListContainer}
              onPress={() => navigation.navigate('ExploreTaggs')}>
              <SvgXml xml={icons.Cart} height={18} width={18} style={styles.cartIcon} />
              <Text style={styles.scoreListText}>Explore Taggs</Text>
            </TouchableOpacity>
            {/* <View style={styles.yourListContainer}>
              <SvgXml xml={icons.MenuButtonOneGreen} height={30} width={30} />
              <Text style={styles.scoreListText}>Your Taggs List</Text>
            </View> */}
          </View>
          <Text style={styles.scoreListTitle}>Taggs For You</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContainer}>
            {TaggShopData.map(tag => (
              <LinkTagg
                key={tag.id}
                img={tag.img}
                title={tag.title}
                locked={tag.locked}
                smallImg={tag.smallImg}
                completed={tag.completed}
                quantity={tag.quantity}
                onPress={() => {
                  setTaggDetailLogo(tag.img);
                  setTaggDetailView(true);
                }}
              />
            ))}
            <TaggDetailView
              visible={taggDetailView}
              onClose={() => setTaggDetailView(false)}
              logo={taggDetailLogo}
              modalButtonPress={() => {
                track('AddTagg', AnalyticVerb.Pressed, AnalyticCategory.EditATagg);
                navigation.navigate('AddTagg', { screenType: ScreenType.Profile });
                setTaggDetailView(false);
              }}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TaggShop;
