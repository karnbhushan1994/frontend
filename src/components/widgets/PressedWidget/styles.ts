import { StyleSheet } from 'react-native';

import { normalize } from 'utils';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  text: {
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 18,
  },
  menuWrapper: {
    position: 'absolute',

    right: 0,
    width: normalize(172),
    backgroundColor: '#fff',
    zIndex: 2,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 12,
    shadowOpacity: 0.5,
  },
  menuTopRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#C4C4C4',
    paddingVertical: 10,
    paddingRight: 18,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuBottomRow: {
    paddingVertical: 10,
    paddingRight: 18,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentWidget: {
    zIndex: 2,
    position: 'absolute',
  },
  linksWidget: {
    zIndex: 2,
    position: 'absolute',
    borderRadius: 8,
  },
});

export default styles;
