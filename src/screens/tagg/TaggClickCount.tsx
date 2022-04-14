import React, { useEffect, useState } from 'react';

import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { useSelector } from 'react-redux';

import { Divider } from 'components/divider/Divider';
import { RangePicker } from 'components/rangePicker';
import IndividualTagg from 'components/taggs/IndividualTagg';
import TaggTotalClick from 'components/taggs/TaggClickCount';

import { getTaggClick } from 'services';

import { RootState } from 'store/rootReducer';

import { ProfileInsightsEnum, TaggsClickCountType } from 'types';

export const TaggClickCount: React.FC = () => {
  const [insights, setInsights] = useState(ProfileInsightsEnum.Week);
  const [data, setData] = useState<TaggsClickCountType>();

  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const init = async () => {
      const taggsData = await getTaggClick(userId, insights);
      setData(taggsData);
    };
    init();
  }, [insights]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <RangePicker insights={insights} changeInsights={setInsights} />
        <Divider />
        <ScrollView>
          <TaggTotalClick total={data?.total} />
          <Divider />
          <IndividualTagg individual={data?.individual} />
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
  blockArea: { position: 'absolute', zIndex: 999, backgroundColor: 'rgba(0, 0, 0,0.6)' },
});
