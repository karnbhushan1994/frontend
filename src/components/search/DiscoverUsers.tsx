import React from 'react';

import { View, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

import { PreviewType, ProfilePreviewType, ScreenType } from 'types';

import SearchResults from './SearchResults';

interface DiscoverUsersProps extends TouchableOpacityProps {
  sectionTitle: PreviewType;
  users: Array<ProfilePreviewType>;
  screenType: ScreenType;
}
/**
 * An image component that returns the <Image> of the icon for a specific social media platform.
 */
const DiscoverUsers: React.FC<DiscoverUsersProps> = ({ sectionTitle, screenType, users }) => (
  <View style={styles.container}>
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{sectionTitle}</Text>
    </View>
    <SearchResults results={users} previewType={sectionTitle} screenType={screenType} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    margin: '5%',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: '1%',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    flexGrow: 1,
    color: 'white',
  },
});

export default DiscoverUsers;
