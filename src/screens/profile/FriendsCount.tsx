import React, { useEffect, useState } from 'react';

import { BlurView } from '@react-native-community/blur';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useSelector } from 'react-redux';

import { Divider } from 'components/divider/Divider';
import FriendAge from 'components/Insights/FriendAge';
import FriendsLocation from 'components/Insights/FriendLocation';
import FriendsPie from 'components/Insights/FriendsPie';
import FriendsTotalCount from 'components/Insights/FriendsTotalCount';
import { RangePicker } from 'components/rangePicker';

import { getFriendTotal, getTaggClick } from 'services';
import { RootState } from 'store/rootReducer';
import { ProfileInsightsEnum } from 'types';

interface State {
  tagg: {
    total: string;
    overview: any;
    individual: [];
    range: string;
  };
  friend: {
    total: '';
    gender: [];
    ageRange: [];
    location: [];
    range: '';
    view: '';
  };
}
export const FriendsCount = () => {
  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);
  const [insights, setInsights] = useState(ProfileInsightsEnum.Week);
  const [data, setData] = useState<State>({
    tagg: {
      total: '',
      overview: {},
      individual: [],
      range: '',
    },
    friend: {
      total: '',
      gender: [],
      ageRange: [],
      location: [],
      range: '',
      view: '',
    },
  });
  useEffect(() => {
    const init = async () => {
      const tagg = (await getTaggClick(userId, insights)) as any;
      const friend = (await getFriendTotal(userId, insights)) as any;
      setData({ tagg, friend });
    };
    init();
  }, [userId, insights]);
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <RangePicker insights={insights} changeInsights={setInsights} />
        <Divider />
        {!data.friend?.view ? (
          <BlurView
            style={styles.absolute}
            blurType="dark"
            blurAmount={7}
            reducedTransparencyFallbackColor="white">
            <Image source={require('../../assets/widgetIcons/Lock.png')} style={styles.lockIcon} />
            <Text style={styles.lockText}>More analytics will be unlocked with Tagg scores</Text>
          </BlurView>
        ) : (
          <ScrollView>
            <FriendsTotalCount total={data.tagg.total} />
            <Divider />
            <FriendsPie friend={data.friend} />
            <Divider />
            <FriendAge friend={data.friend} />
            <Divider />
            <FriendsLocation friend={data.friend} />
          </ScrollView>
        )}
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
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
});
