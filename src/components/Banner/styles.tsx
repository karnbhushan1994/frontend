import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bannerContainer: {
    width: '95%',
    height: 66,
    borderRadius: 10,
    zIndex: 99999,
    top: 40,
    left: 10,
    position: 'absolute',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 8,
    paddingHorizontal: 12,
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
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
    color: '#4F4F4F',
  },
  bannerPoint: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
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
  lottieset: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
});
