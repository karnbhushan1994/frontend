import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  explore: {
    width: '100%',
    marginBottom: 28,
  },
  horizontal: {
    marginRight: '-6%',
  },
  exploreItem: {
    width: 184,
    height: 184,
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
  },
  exploreItemBg: {
    height: '100%',
    width: '100%',
  },
  exploreItemTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 25,
    position: 'absolute',
    bottom: 15,
    left: 5,
  },
});

export default styles;
