import React from 'react';

import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native';

import { insightsIcons } from 'assets/insights';

import { TaggClickCountTaggType } from 'types';
import { normalize } from 'utils';

interface Individual {
  individual?: TaggClickCountTaggType[];
}

const IndividualTagg: React.FC<Individual> = ({ individual }) => {
  const renderIndividualTaggs = ({ item }: any) => (
    <View style={styles.individualContainer}>
      <Image source={item.image} style={styles.individualImg} />

      <View style={styles.optionsTextContainer}>
        <Text style={styles.optionsText}>{item.title}</Text>
      </View>
      <View style={styles.optionsCount}>
        <Text style={styles.optionsCountText}>{item.views}</Text>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Individual Taggs</Text>
      {individual && individual.length > 0 ? (
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={individual}
          renderItem={renderIndividualTaggs}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.content}>
          <View style={styles.podcastLayer}>
            <View style={styles.imageContainer}>
              <Image
                resizeMode="contain"
                style={styles.podcastImage}
                source={insightsIcons.NoTagg}
              />
              <Text style={styles.noMomentText}>{'No Tagg Clicks'}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 21,
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  podcastLayer: {
    backgroundColor: '#DADADA',
    width: 240,
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 7.15,
    paddingTop: 5,
    paddingBottom: 30,
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
  individualImg: {
    width: 40,
    height: 40,
  },
  podcastImage: {
    width: 200,
    height: 200,
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    margin: '7%',
  },
  noMomentText: {
    fontSize: normalize(14),
    fontWeight: '500',
    color: '#828282',
    alignSelf: 'center',
    paddingVertical: 10,
  },
});

export default IndividualTagg;
