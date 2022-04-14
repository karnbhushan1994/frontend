import { StyleSheet } from 'react-native';

import { SCREEN_WIDTH } from 'utils';

export const styles = StyleSheet.create({
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D3031',
    position: 'absolute',
    bottom: 60,
    zIndex: 9999999,
    left: 10,
    width: SCREEN_WIDTH / 1.1,
    borderRadius: 5,
  },
  bannerImage: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    color: 'white',
  },
  bannerPointText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 25,
    color: '#0CB209',
  },
  coin: {
    width: 55,
    height: 55,
  },
});
