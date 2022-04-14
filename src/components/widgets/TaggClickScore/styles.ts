import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  countWrapper: {
    position: 'absolute',
    right: 4,
    bottom: 0,
    zIndex: 9999,
    flexDirection: 'row',
    padding: 5,
  },
  countText: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 28,
    color: '#fff',
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    paddingLeft: 25,
  },
  gradientWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 10 },
});

export default styles;
