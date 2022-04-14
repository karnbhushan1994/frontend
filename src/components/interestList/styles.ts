import { StyleSheet } from 'react-native';

import { DARK_PURPLE, WHITE } from '../../constants';
import { normalize } from '../../utils';

export const styles = StyleSheet.create({
  interestContainer: {
    flexDirection: 'row',
    marginTop: normalize(15),
    paddingTop: normalize(8),
    paddingBottom: normalize(8),
    paddingLeft: normalize(15),
    paddingRight: normalize(15),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: WHITE,
    marginRight: normalize(15),
    borderRadius: 40,
  },
  text: {
    color: WHITE,
    fontSize: normalize(18),
    fontWeight: '600',
    marginLeft: normalize(10),
  },
  selectedText: { color: DARK_PURPLE },
  selectedInterest: { backgroundColor: WHITE },
});
