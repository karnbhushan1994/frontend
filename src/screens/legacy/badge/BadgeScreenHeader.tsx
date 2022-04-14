import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {normalize} from '../../../utils';

const BadgeScreenHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.universityTextContainer}>
        <Text style={styles.universityText}>Badges</Text>
      </View>
      <View style={styles.searchTextContainer}>
        <Text style={styles.searchText}>Select your interests!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: '1%',
  },
  universityTextContainer: {marginTop: 12},
  universityText: {
    fontSize: normalize(20),
    fontWeight: '700',
    lineHeight: normalize(23.87),
    color: 'white',
  },
  searchTextContainer: {marginTop: 6},
  searchText: {
    fontSize: normalize(15),
    fontWeight: '500',
    lineHeight: normalize(17.9),
    color: 'white',
  },
  icon: {
    aspectRatio: 675 / 750,
    height: 40,
  },
});

export default BadgeScreenHeader;
