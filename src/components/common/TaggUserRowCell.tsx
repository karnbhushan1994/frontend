import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ProfilePreviewType } from 'types';
import { normalize } from 'utils';

import Avatar from './Avatar';

type TaggUserRowCellProps = {
  onPress: () => void;
  user: ProfilePreviewType;
};
const TaggUserRowCell: React.FC<TaggUserRowCellProps> = ({ onPress, user }) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <Avatar style={styles.image} uri={user.thumbnail_url} />
    <View style={styles.textContent}>
      <Text style={styles.username}>{`@${user.username}`}</Text>
      <Text style={styles.name}>
        {user.first_name} {user.last_name}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingVertical: 15,
    width: '100%',
  },
  image: {
    width: normalize(30),
    height: normalize(30),
    borderRadius: 30,
  },
  textContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 20,
  },
  username: {
    fontWeight: '500',
    fontSize: normalize(14),
  },
  name: {
    fontWeight: '500',
    fontSize: normalize(12),
    color: '#828282',
  },
});
export default TaggUserRowCell;
