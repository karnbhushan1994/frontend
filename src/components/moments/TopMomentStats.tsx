import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { MomentType } from 'types/types';

interface MomentStats {
  top_moment: {
    moment?: MomentType;
    views: number;
    shares: number;
    comments: number;
  };
}

const TopMomentStats: React.FC<MomentStats> = ({ top_moment }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Top Moment Stats</Text>
    <View style={styles.optionsContainer}>
      <View style={styles.optionsTextContainer}>
        <Text style={styles.optionsText}>Views</Text>
      </View>
      <View style={styles.optionsCount}>
        <Text style={styles.optionsCountText}>{top_moment?.views}</Text>
      </View>
    </View>
    <View style={styles.optionsContainer}>
      <View style={styles.optionsTextContainer}>
        <Text style={styles.optionsText}>Comments</Text>
      </View>
      <View style={styles.optionsCount}>
        <Text style={styles.optionsCountText}>{top_moment?.comments}</Text>
      </View>
    </View>
    <View style={styles.optionsContainer}>
      <View style={styles.optionsTextContainer}>
        <Text style={styles.optionsText}>Shares</Text>
      </View>
      <View style={styles.optionsCount}>
        <Text style={styles.optionsCountText}>{top_moment?.shares}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 21,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  individualContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  optionsTextContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  optionsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#828282',
  },
  optionsCount: {
    width: 60,
    height: 25,
    alignItems: 'flex-end',
  },
  optionsCountText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#828282',
  },
  optionsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default TopMomentStats;
