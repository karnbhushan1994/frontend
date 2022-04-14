import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, TouchableOpacity, View, Text, ViewProps } from 'react-native';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { MomentType, ScreenType } from 'types';
import { formatCount, isUrlAVideo, normalize } from 'utils';

interface MomentTileProps extends ViewProps {
  moment: MomentType;
  userXId: string | undefined;
  screenType: ScreenType;
}
const MomentTile: React.FC<MomentTileProps> = ({ style, moment, userXId, screenType }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('IndividualMoment', {
          moment,
          screenType,
          userXId,
        });
      }}>
      <View style={[styles.image, style]}>
        <Image style={styles.image} source={{ uri: moment.thumbnail_url }} />
      </View>
      {isUrlAVideo(moment.moment_url) && (
        <View style={styles.videoReplays}>
          <SvgXml xml={icons.PlayIconSolid} width={normalize(10)} height={normalize(15)} />
          <Text style={styles.replayCount}>{formatCount(moment.view_count)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#ddd',
  },
  replayCount: {
    color: '#fff',
    fontSize: normalize(12),
    lineHeight: normalize(16),
    letterSpacing: normalize(0.5),
    fontWeight: '600',
    shadowRadius: normalize(6),
    shadowColor: 'rgba(0,0,0,0.4)',
    marginLeft: normalize(4),
  },
  videoReplays: {
    position: 'absolute',
    bottom: normalize(5),
    left: normalize(4),
    width: normalize(100),
    height: normalize(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default MomentTile;
