import React from 'react';

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';

import { insightsIcons } from 'assets/insights';
import { normalize } from 'utils';
import { capitalizeFirstLetter } from 'utils/helper';

const PADDING = 20;

export const AddTag = ({ tagg, onPress }: any) => (
  <View style={styles.container}>
    <View style={styles.padding}>
      <Text style={styles.mainTitle}>Taggs</Text>
      <Text style={styles.title}>Top Tagg</Text>
      <Text style={styles.subTitle}>
        {tagg?.top_tagg && tagg?.total > 0
          ? capitalizeFirstLetter(tagg?.top_tagg?.link_type)
          : 'None'}
      </Text>
    </View>
    <View style={styles.content}>
      <View style={styles.podcastLayer}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            style={styles.podcastImage}
            source={tagg?.top_tagg && tagg?.total > 0 ? tagg?.top_tagg.image : insightsIcons.NoTagg}
          />
          <Text
            style={tagg?.top_tagg && tagg?.total > 0 ? styles.podcastText : styles.noMomentText}>
            {tagg?.top_tagg && tagg?.total > 0 ? tagg?.top_tagg?.title : 'No Tagg Clicks'}
          </Text>
        </View>
      </View>
    </View>

    <TouchableOpacity style={styles.tools} onPress={onPress}>
      <Text style={styles.topMoments}>Tagg click count</Text>
      <View style={styles.arrow}>
        <Text style={styles.total}>{tagg?.total}</Text>
        <SvgXml xml={icons.ArrowRight} width={18} height={18} />
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', shadowColor: '#000' },
  padding: { paddingLeft: PADDING, paddingTop: PADDING },
  mainTitle: { fontSize: 20, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700', marginTop: 14 },
  subTitle: { fontSize: 13, color: '#828282', fontWeight: '600', marginTop: 7, marginBottom: 18 },
  content: {
    backgroundColor: '#DADADA',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  podcastLayer: {
    backgroundColor: '#DADADA',
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12.87,
    paddingRight: 7.15,
    paddingTop: 5,
    paddingBottom: 30,
  },
  podcastText: {
    fontSize: normalize(14),
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: normalize(26),
  },
  podcastImage: {
    width: 200,
    height: 200,
  },
  imageContainer: {
    width: 200,
    height: 200,
  },
  noMomentText: {
    fontSize: normalize(14),
    fontWeight: '500',
    color: '#828282',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  tools: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 50,
  },
  topMoments: { fontSize: 15, fontWeight: '600' },
  total: { width: 60, textAlign: 'right', marginRight: 5 },
  arrow: { width: 100, justifyContent: 'flex-end', flexDirection: 'row' },
});
