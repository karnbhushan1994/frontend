import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { ProfileInsightsEnum } from 'types';

export const MomentChart = ({
  moments,
  route,
  insights,
}: {
  insights: ProfileInsightsEnum;
  moments: any;
  route: any;
}) => (
  //const [isLockVisible, setIsLockVisible] = useState<boolean>(false);
  <TouchableOpacity style={styles.container} onPress={route}>
    <Text style={styles.title}>Moments</Text>
    <View style={styles.totalContainer}>
      <Text style={styles.total}>{moments ? moments.total_views : 0}</Text>
      <Text style={styles.subTotal}>Moment views over {insights} days</Text>
    </View>
    <View style={styles.tools}>
      <Text style={styles.topMoments}>Top moments post</Text>
      <View style={styles.arrow}>
        <SvgXml xml={icons.ArrowRight} width={18} height={18} />
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { marginHorizontal: 18 },
  title: { fontSize: 20, fontWeight: '700', marginTop: 10 },
  tools: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    // height: 50,
  },
  totalContainer: { marginVertical: 10 },
  topMoments: { fontSize: 15, fontWeight: '600' },
  total: { fontSize: 18, fontWeight: '700', color: '#333333', marginTop: 10 },
  subTotal: { fontSize: 13, fontWeight: '600', color: '#828282', marginTop: 10, marginBottom: 10 },
  arrow: { width: 100, justifyContent: 'flex-end', flexDirection: 'row' },
});
