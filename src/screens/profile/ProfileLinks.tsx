import React, { useEffect, useState } from 'react';

import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import ClickCount from 'components/Insights/ClickCount';
import ConversionInsight from 'components/Insights/Conversion';
import ProfileViewChart from 'components/Insights/ProfileViewChart';
import { RangePicker } from 'components/rangePicker';

import { getProfileViews } from 'services';
import { RootState } from 'store/rootReducer';
import { ProfileInsightsEnum } from 'types';
import { getTokenOrLogout } from 'utils/users';

import { Divider } from '../../components/divider/Divider';

interface State {
  profile: {
    total: string;
    labels: [];
    graph: [];
    rangeDay: string;
    range: string;
  };
}
export const ProfileLinks = () => {
  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);
  const [insights, setInsights] = useState(ProfileInsightsEnum.Week);
  const [data, setData] = useState<State>({
    profile: {
      total: '',
      labels: [],
      graph: [],
      rangeDay: '',
      range: '',
    },
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      const token = await getTokenOrLogout(dispatch);
      const profile = (await getProfileViews(token, userId, insights)) as any;
      setData({ profile });
    };
    init();
  }, [userId, insights]);
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <RangePicker insights={insights} changeInsights={setInsights} />
        <Divider />
        <ClickCount total={data.profile.total} insights={insights} />
        <Divider />
        <Text style={styles.clickCountText}>Click Count</Text>
        <ProfileViewChart data={data} />
        <Divider />
        <ConversionInsight />
        <View style={styles.endFlex} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  endFlex: { flex: 1, backgroundColor: '#EDEDED' },
  container: { paddingVertical: 50, flex: 1 },
  blockArea: { position: 'absolute', zIndex: 999, backgroundColor: 'rgba(0, 0, 0,0.6)' },
  clickCountText: { fontSize: 21, fontWeight: '700', marginLeft: 25, marginTop: 15 },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 60,
  },
  lockIcon: {
    width: 55,
    height: 55,
  },
  lockText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  button: {
    width: 120,
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#698DD3',
  },
});
