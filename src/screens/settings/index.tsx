import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { AddTag } from 'components/addTag/AddTag';
import { MomentChart } from 'components/charts/MomentChart';
import { ViewsChart } from 'components/charts/ViewsChart';
import { Divider } from 'components/divider/Divider';
import { RangePicker } from 'components/rangePicker';
import { getProfileMoments, getProfileViews, getTaggClick } from 'services';
import { RootState } from 'store/rootReducer';
import { ProfileInsightsEnum } from 'types';
import { getTokenOrLogout } from 'utils/users';

export const Settings = () => {
  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const [insights, setInsights] = useState(ProfileInsightsEnum.Week);
  const [data, setData] = useState({
    views: {
      title: '',
      labels: [],
      graph: [],
      range: '',
    },
    moments: {
      title: '',
      labels: [],
      graph: [],
      range: '',
    },
    tagg: {
      total: '',
      overview: {},
      individual: [],
      range: '',
    },
  });

  const average = (numbers: number[]): string => {
    const av = numbers.reduce((p, c) => p + c, 0) / numbers.length;
    if (av >= 1000000000) {
      return Number((av / 1000000000).toFixed(1)) + 'M';
    } else if (av >= 1000000) {
      return Number((av / 1000000).toFixed(1)) + 'M';
    } else if (av >= 1000) {
      return Number((av / 1000).toFixed(1)) + 'K';
    }
    return '';
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      const token = await getTokenOrLogout(dispatch);
      const views = (await getProfileViews(token, userId, insights)) as any;
      const moments = (await getProfileMoments(userId, insights)) as any;
      const tagg = (await getTaggClick(userId, insights)) as any;
      setData({ views, moments, tagg });
    };
    init();
  }, [userId, insights]);
  const routeTaggScreen = () => {
    navigation.navigate('TaggClickCountScreen');
  };
  const routePopularMoment = () => {
    navigation.navigate('MostPopularMoment');
  };
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <RangePicker insights={insights} changeInsights={setInsights} />
        <Divider />
        <ScrollView>
          <ViewsChart title={average(data.views.graph)} views={data.views} />
          <Divider />
          <AddTag onPress={routeTaggScreen} tagg={data.tagg} />
          <Divider />
          <MomentChart
            title={average(data.moments.graph)}
            moments={data.moments}
            route={routePopularMoment}
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
});
