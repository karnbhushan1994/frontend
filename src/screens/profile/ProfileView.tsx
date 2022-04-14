import React, { useEffect, useState } from 'react';

import { SafeAreaView, StyleSheet, View } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import ProfileViewChart from 'components/Insights/ProfileViewChart';
import ProfileViewTotal from 'components/Insights/ProfileViewTotal';
import { RangePicker } from 'components/rangePicker';

import { getProfileViews } from 'services';
import { RootState } from 'store/rootReducer';
import { ProfileInsightsEnum, ProfileViewsCountType } from 'types';
import { getTokenOrLogout } from 'utils';

import { Divider } from '../../components/divider/Divider';

interface State {
  profile: {
    total_views: number;
    distribution: {
      labels: [];
      values: [];
    };
  };
}
export const ProfileView = () => {
  const dispatch = useDispatch();
  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);
  const [insights, setInsights] = useState(ProfileInsightsEnum.Week);
  const [profile, setProfile] = useState<ProfileViewsCountType>({
    total_views: 0,
    distribution: {
      labels: [],
      values: [],
    },
  });

  useEffect(() => {
    const init = async () => {
      const token = await getTokenOrLogout(dispatch);
      const temp_profile = (await getProfileViews(token, userId, insights)) as any;
      setProfile(temp_profile);
    };
    init();
  }, [userId, insights]);
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <RangePicker insights={insights} changeInsights={setInsights} />
        <Divider />
        <ProfileViewTotal
          total={profile && profile.total_views ? profile.total_views : 0}
          insights={insights}
        />
        <Divider />
        {profile && <ProfileViewChart profile={profile} />}
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
