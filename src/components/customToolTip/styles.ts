import { StyleSheet } from 'react-native';

import { TAGG_ERROR_RED } from '../../constants';
import { normalize } from '../../utils';

export const styles = StyleSheet.create({
  mainContainer: { marginTop: '3%', alignSelf: 'flex-start', marginLeft: '5%' },
  textContainer: {
    height: 45,
    paddingHorizontal: '5%',
    backgroundColor: TAGG_ERROR_RED,
    borderRadius: 5,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  toolTipTextStyle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: normalize(13),
  },
  tipView: {
    height: 25,
    width: 25,
    backgroundColor: '#EA574C',
    position: 'absolute',
    left: 30,
    transform: [{ rotate: '45deg' }],
  },
});
