import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';

import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import { AddTag } from 'components/addTag/AddTag';
import { MomentChart } from 'components/charts/MomentChart';
import { ProfileLinkChart } from 'components/charts/ProfileLinkChart';
import { ViewsChart } from 'components/charts/ViewsChart';
import { Divider } from 'components/divider/Divider';
import { RangePicker } from 'components/rangePicker';

import {
  getFriendTotal,
  getProfileLinks,
  getMomentInsightsSummary,
  getProfileViewsSummary,
  getTaggClicksSummary,
} from 'services';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, ProfileInsightsEnum } from 'types';
import { track } from 'utils';
import { getTokenOrLogout } from 'utils/users';

export const Insights = () => {
  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const [insights, setInsights] = useState(ProfileInsightsEnum.Week);
  const [data, setData] = useState({
    profile: {
      total_views: 0,
    },
    moments: {
      title: '',
      labels: [],
      graph: [],
      range: '',
    },
    tagg: {
      total: '',
      top_tagg: {
        title: '',
        link_type: '',
        views: 0,
        image: '',
      },
      range: '',
    },
    friend: {
      total: '',
      gender: [],
      ageRange: [],
      location: [],
      range: '',
    },
    profileLinks: {
      totalClicks: '',
      clickConversion: '',
      range: '',
    },
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      const token = await getTokenOrLogout(dispatch);
      const profile = (await getProfileViewsSummary(token, userId, insights)) as any;
      const moments = (await getMomentInsightsSummary(userId, insights)) as any;
      const tagg = (await getTaggClicksSummary(token, userId, insights)) as any;
      const friend = (await getFriendTotal(userId, insights)) as any;
      const profileLinks = (await getProfileLinks(userId, insights)) as any;
      setData({ profile, moments, tagg, friend, profileLinks });
    };
    init();
  }, [userId, insights]);
  const routeTaggScreen = () => {
    track('TaggClickCount', AnalyticVerb.Pressed, AnalyticCategory.Insights);
    navigation.navigate('TaggClickCountScreen');
  };
  const routePopularMoment = () => {
    track('MomentViews', AnalyticVerb.Pressed, AnalyticCategory.Insights);
    navigation.navigate('MostPopularMoment');
  };
  const routeProfileLink = () => {
    // navigation.navigate('ProfileLinks');
  };
  const routeProfileViews = () => {
    navigation.navigate('ProfileViewsInsights');
  };
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarVisible: false,
    });
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <RangePicker insights={insights} changeInsights={setInsights} />
        <Divider />
        <ScrollView>
          <ViewsChart onPress={routeProfileViews} profile={data.profile} insights={insights} />
          <Divider />
          <AddTag onPress={routeTaggScreen} tagg={data.tagg} />
          <Divider />
          <MomentChart insights={insights} moments={data.moments} route={routePopularMoment} />
          <Divider />
          <ProfileLinkChart
            isLocked={true}
            onPress={routeProfileLink}
            linkClicks={data.profileLinks}
          />
          <Divider />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { paddingVertical: 50, flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  date: {
    paddingHorizontal: 10,
    fontWeight: '700',
  },
});
