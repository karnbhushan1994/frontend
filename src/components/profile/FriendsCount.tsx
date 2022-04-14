import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

import { RootState } from 'store/rootReducer';
import { ScreenType } from 'types';
import { formatCount, normalize } from 'utils';

interface FriendsCountProps extends ViewProps {
  userXId: string | undefined;
  screenType: ScreenType;
}

const FriendsCount: React.FC<FriendsCountProps> = ({ style, userXId, screenType }) => {
  const { friends } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.friends,
  );
  const count = friends ? friends.length : 0;

  const displayedCount: string = formatCount(count);

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.push('FriendsListScreen', {
          userXId,
          screenType,
        })
      }
      disabled={friends.length === 0}>
      <View style={[styles.container, style]}>
        <Text style={styles.count}>{displayedCount}</Text>
        <Text style={styles.label}>Friends</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  count: {
    fontWeight: '700',
    fontSize: normalize(14),
  },
  label: {
    marginTop: 4,
    fontWeight: '500',
    fontSize: normalize(14),
  },
});

export default FriendsCount;
