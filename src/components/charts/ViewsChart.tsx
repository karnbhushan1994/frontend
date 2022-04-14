import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { ProfileInsightsEnum } from 'types';

interface ViewsChartProps {
  insights: ProfileInsightsEnum;
  profile: {
    total_views: number;
  };
  onPress: () => void;
}

export const ViewsChart: React.FC<ViewsChartProps> = ({ profile, insights, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Text style={styles.title}>Profile Views</Text>
    <Text style={styles.total}>{profile ? profile.total_views : 0}</Text>
    <View style={styles.tools}>
      <Text style={styles.topMoments}>{`Profile views over ${insights} days`}</Text>
      <View style={styles.arrow}>
        <SvgXml xml={icons.ArrowRight} width={18} height={18} />
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { marginHorizontal: 18 },
  title: { fontSize: 20, fontWeight: '700', marginTop: 14 },
  tools: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    // height: 50,
  },
  percent: { fontSize: 13, fontWeight: '600', color: '#EA574C' },
  totalContainer: { marginVertical: 10 },
  topMoments: {
    fontSize: 13,
    fontWeight: '600',
    color: '#828282',
    marginBottom: 10,
    marginTop: 10,
  },
  total: { fontSize: 18, fontWeight: '700', color: '#333333', marginTop: 14 },
  subTotal: { fontSize: 13, fontWeight: '600', color: '#828282' },
  arrow: { width: 100, justifyContent: 'flex-end', flexDirection: 'row' },
});
