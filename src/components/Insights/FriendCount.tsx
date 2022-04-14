import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';

export const FriendCount = ({ route, friend }: { route: any; friend: any }) => (
  <>
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <TouchableOpacity style={styles.tools} onPress={route}>
        <View>
          <Text style={styles.total}>{friend.total}</Text>
          <Text style={styles.linkTitle}>Friend count</Text>
        </View>
        <View style={styles.arrow}>
          <SvgXml xml={icons.ArrowRight} width={18} height={18} />
        </View>
      </TouchableOpacity>
    </View>
  </>
);

const styles = StyleSheet.create({
  container: { marginHorizontal: 18 },
  title: { fontSize: 20, fontWeight: '700', marginVertical: 10 },
  tools: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  subContainer: { alignItems: 'center' },
  chart: { width: 330, height: 150 },
  linkTitle: { fontSize: 13, fontWeight: '600', color: '#828282' },
  total: { fontSize: 18, fontWeight: '700', color: '#333333' },
  arrow: { width: 100, justifyContent: 'flex-end', flexDirection: 'row' },
  rangeText: { fontSize: 11, fontWeight: '600', color: '#828282', marginVertical: 3 },
  rangeContainer: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderColor: '#E0E0E0',
    marginTop: 15,
  },
  rangeTextBottomContainer: { height: 150 / 2, position: 'absolute', top: 85, left: 10 },
  rangeTextContainer: { height: 150 / 2, position: 'absolute', top: 5, left: 10 },
  monthContainer: { flexDirection: 'row', marginHorizontal: 25 },
  leftMonth: { flex: 1 },
});
