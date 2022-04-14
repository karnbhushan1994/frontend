import React, { useEffect, useState } from 'react';

import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image, SafeAreaView, ScrollView, StatusBar, TextInput, View } from 'react-native';
import { Text } from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

import { images } from 'assets/images';
import ChallengeDetailView from 'components/widgets/challengeDetail';
import { Explore } from 'components/widgets/explore';
import StreakPopUp from 'components/widgets/streakPopUp';
import { TaggsBlock } from 'components/widgets/taggsBlock';
import { TaggShopData } from 'constants/widgets';
import { MainStackParams } from 'routes';
import { getTopTaggsToday } from 'services';
import { BackgroundGradientType, WidgetType } from 'types';

import { BACKGROUND_GRADIENT_MAP } from '../../../constants';

import styles from './styles';

const imgSrc = images.main.search;

/**
 * Home Screen for displaying Tagg Badge Selections
 **/

type ExploreTaggsRouteProps = RouteProp<MainStackParams, 'ExploreTaggs'>;

type ExploreTaggsNavigationProps = StackNavigationProp<MainStackParams, 'ExploreTaggs'>;

interface ExploreTaggsProps {
  route: ExploreTaggsRouteProps;
  navigation: ExploreTaggsNavigationProps;
}

const ExploreTaggs: React.FC<ExploreTaggsProps> = () => {
  // const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [challengeDetailView, setChallengeDetailView] = useState(false);
  const [streakCount] = useState(36);
  const [todayTopTaggs, setTodayTopTaggs] = useState<WidgetType[]>([]);

  useEffect(() => {
    getTopTaggsToday().then(data => {
      const taggs: WidgetType[] = [];
      data.forEach(item => {
        const Constructor = TaggShopData.find(_ => _.link_type === item);

        if (Constructor) {
          taggs.push(Constructor);
        }
      });

      setTodayTopTaggs(taggs);
    });
  }, []);
  return (
    <LinearGradient
      colors={BACKGROUND_GRADIENT_MAP[BackgroundGradientType.Dark]}
      style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <SafeAreaView>
        <ScrollView style={styles.listContainer}>
          <View style={styles.searchBarStyle}>
            <Image source={imgSrc} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholderTextColor={'#E7C9FF'}
              placeholder={'Search Taggs'}
              // onSubmitEditing={handleSubmit}
              clearButtonMode="always"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.scoreListBlock}>
            <Text style={styles.exploreTitle}>Explore</Text>
          </View>
          <View style={styles.content}>
            <Explore />
            <TaggsBlock title={'Trending'} subTitle={'Top Taggs Today'} tagsData={todayTopTaggs} />

            <StreakPopUp
              streakCount={streakCount}
              modalButtonPress={() => setModalVisible(false)}
              visible={modalVisible}
            />
            <ChallengeDetailView
              visible={challengeDetailView}
              onClose={() => setChallengeDetailView(false)}
              completed={1}
              quantity={4}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ExploreTaggs;
