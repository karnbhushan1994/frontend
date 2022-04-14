import React, { Fragment } from 'react';

import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ProfilePreviewType } from 'types';
import { normalize } from 'utils';

import ExploreSectionUser from './ExploreSectionUser';

/**
 * Search Screen for user recommendations and a search
 * tool to allow user to find other users
 */

interface ExploreSectionProps {
  title: string;
  users: ProfilePreviewType[];
}
const ExploreSection: React.FC<ExploreSectionProps> = ({ title, users }) =>
  users && users.length !== 0 ? (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <FlatList
        data={users}
        ListHeaderComponent={<View style={styles.padding} />}
        renderItem={({ item: user }: { item: ProfilePreviewType }) => (
          <ExploreSectionUser
            key={user.id}
            user={user}
            externalStyles={StyleSheet.create({
              container: styles.user,
            })}
          />
        )}
        showsHorizontalScrollIndicator={false}
        horizontal
      />
    </View>
  ) : (
    <Fragment />
  );

const styles = StyleSheet.create({
  container: {
    marginVertical: '5%',
  },
  header: {
    fontWeight: '600',
    fontSize: normalize(18),
    color: '#fff',
    marginLeft: '5%',
    marginBottom: '5%',
  },
  user: {
    marginHorizontal: 5,
  },
  padding: {
    width: 10,
  },
});

export default ExploreSection;
