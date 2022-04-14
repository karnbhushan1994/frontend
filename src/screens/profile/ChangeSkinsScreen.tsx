import { SKINS_LIST, TAGG_LIGHT_BLUE_2 } from 'constants';

import React, { Fragment, useState } from 'react';

import { useNavigation } from '@react-navigation/core';

import {
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import { useSelector } from 'react-redux';

import { images } from 'assets/images';
import { Background } from 'components';
import { ButtonWithGradientBackground } from 'components/widgets/buttonWithGradientBackground';

import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType, SkinListType } from 'types';
import { normalize, SCREEN_HEIGHT, SCREEN_WIDTH, track } from 'utils';
import { hapticFeedback } from 'utils/hapticFeedback';

//const imgSrc = images.main.search;

const ChangeSkinsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const { tagg_score } = useSelector((state: RootState) => state.user.profile);
  const [score, setScore] = useState(tagg_score);
  const renderItem = ({ item }: { item: SkinListType }) => {
    if (item === null) {
      return <Fragment />;
    } else {
      return (
        <TouchableOpacity activeOpacity={1} style={styles.imageContainer}>
          <Image source={item.demoPicture} style={styles.image} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.displayName}</Text>
            <ButtonWithGradientBackground title={'Change'} onPress={() => handleNavigate(item)} />
          </View>
        </TouchableOpacity>
      );
    }
  };

  const handleNavigate = async (item: any) => {
    Alert.alert(
      'Are you sure you want to change this?',
      'Your last skin will be archived',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            track('ChangeSkin', AnalyticVerb.Finished, AnalyticCategory.EditSkin, {
              skin: item.name,
              primaryColor: item.primaryColor,
              secondaryColor: item.secondaryColor,
            });
            navigation.navigate('PostChangeSkinScreen', {
              name: item.name,
              demoPicture: item.demoPicture,
              primaryColor: item.primaryColor,
              secondaryColor: item.secondaryColor,
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Background gradientType={BackgroundGradientType.Dark}>
        <SafeAreaView>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <TouchableOpacity
                style={styles.yourListContainer}
                disabled={true}
                onPress={() => setScore(tagg_score)}>
                <Text style={styles.scoreListText}>{score}</Text>
                <Image source={images.main.score_coin} style={styles.coin} />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>New Skins</Text>
            <View style={styles.scrollViewContainer}>
              <Carousel
                data={SKINS_LIST}
                layout="default"
                renderItem={renderItem}
                sliderWidth={SCREEN_WIDTH}
                itemWidth={SCREEN_WIDTH - 200}
                onSnapToItem={i => {
                  setCurrentPage(i);
                  hapticFeedback('impactLight');
                }}
                removeClippedSubviews={false}
              />
              <Pagination
                activeDotIndex={currentPage}
                dotsLength={SKINS_LIST.length}
                dotColor={TAGG_LIGHT_BLUE_2}
                inactiveDotColor={'#e0e0e0'}
                containerStyle={styles.paginationStyle}
              />
            </View>
          </View>
        </SafeAreaView>
      </Background>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    marginHorizontal: '8%',
    marginTop: '8%',
  },
  nameContainer: {
    marginTop: -10,
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    color: '#fff',
  },
  paginationStyle: {
    marginLeft: '12%',
  },
  searchBarStyle: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#120227',
    borderRadius: 17,
    paddingVertical: 5,
    paddingHorizontal: 17,
    marginBottom: 8,
    marginTop: 28,
  },
  scrollViewContainer: {
    width: '100%',
    marginLeft: '-10%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  yourListContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    color: '#fff',
    fontSize: normalize(25),
    fontWeight: '700',
  },
  scoreListText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    textAlign: 'left',
    paddingLeft: 4,
  },
  input: {
    flex: 1,
    color: '#E7C9FF',
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: SCREEN_HEIGHT * 0.64,
  },
  image: {
    height: '80%',
    width: '100%',
    resizeMode: 'contain',
  },
  coin: {
    width: 20,
    height: 20,
    bottom: -1,
  },
});

export default ChangeSkinsScreen;
