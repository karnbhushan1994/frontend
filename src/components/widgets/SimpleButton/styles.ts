import { StyleSheet } from 'react-native';

import { TAGG_LIGHT_BLUE } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: TAGG_LIGHT_BLUE,
    alignItems: 'center',
    borderRadius: 5,
    // paddingHorizontal: '2%',
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  disabled: {
    backgroundColor: '#BDBDBD',
  },
  coin: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});

export default styles;
