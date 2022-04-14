import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

interface FriendsLocation {
  friend: any;
}

const GRAPH_WIDTH = 200;

const FriendsLocation: React.FC<FriendsLocation> = ({ friend }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Location</Text>
    <View style={styles.graphContainer}>
      {friend.location.map((item: any) => (
        <View style={styles.dataDetail}>
          <View style={styles.label}>
            <Text style={styles.labelText}>{item?.city}</Text>
          </View>
          <View style={styles.graphBar}>
            <View style={[styles.activeGraphBar, { width: (GRAPH_WIDTH * item.percent) / 100 }]} />
          </View>
          <View style={styles.label}>
            <Text style={styles.rightLabelText}>{item.percent}%</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 21,
    paddingVertical: 24,
  },
  graphContainer: {
    flex: 1,
  },
  dataDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  graphBar: {
    width: GRAPH_WIDTH,
    height: 18,
    marginHorizontal: 8,
    borderRadius: 3,
    backgroundColor: '#E5E5E5',
  },
  activeGraphBar: {
    height: 18,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    backgroundColor: '#698DD3',
  },
  label: {
    width: 78,
    height: 20,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#828282',
    textAlign: 'right',
  },
  rightLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#828282',
    textAlign: 'left',
  },

  genderContainer: {
    marginTop: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  genderTextContainer: {
    flex: 1,
  },
  percentText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#828282',
  },
  percentColor: {
    width: 26,
    height: 26,
    borderRadius: 3,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },
  totalSubText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#828282',
    marginTop: 8,
  },
});

export default FriendsLocation;
