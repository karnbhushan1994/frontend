import { TAGG_LIGHT_BLUE } from 'constants';

import { StyleSheet } from 'react-native';
import { normalize } from 'react-native-elements';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  content: {
    width: '95%',
    marginHorizontal: 10,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  lockIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockText: {
    fontSize: 20,
    lineHeight: 28,
    marginTop: 25,
    marginHorizontal: 10,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333333',
  },

  description: {
    fontSize: 13,
    fontWeight: '500',
    color: '#828282',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    marginHorizontal: 10,
  },
  XIconContainer: {},
  image: {
    height: normalize(120),
    width: normalize(120),
    resizeMode: 'contain',
  },
  buttonWrapper: {
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  buttonContainer: {
    paddingVertical: 10,
    backgroundColor: TAGG_LIGHT_BLUE,
    alignItems: 'center',
    borderRadius: 5,
    width: '90%',
    marginTop: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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
  iconImage: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
});
