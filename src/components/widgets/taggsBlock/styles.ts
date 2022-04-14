import { StyleSheet } from 'react-native';

import { TAGG_LIGHT_BLUE_2 } from '../../../constants';

const styles = StyleSheet.create({
  taggsBlock: {
    width: '94%',
    marginBottom: 14,
  },
  taggsTitle: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    color: '#BDBDBD',
  },
  taggsSubTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    color: '#fff',
    marginRight: 16,
  },
  taggItem: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginBottom: '2%',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1D4F85',
  },
  taggItemTagg: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginBottom: '2%',
    // paddingBottom: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: '#1D4F85',
  },
  coverContainer: {
    height: 60,
    width: 60,
    borderRadius: 4,
    marginRight: '2%',
    overflow: 'hidden',
  },
  titleButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleButtonContainerTagg: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1D4F85',
    height: 66,
  },
  taggTitle: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    color: '#fff',
  },
  completeText: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 12,
    color: TAGG_LIGHT_BLUE_2,
    marginRight: 6,
  },
  taggInfo: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 12,
    color: '#BDBDBD',
    marginRight: 6,
  },
  taggInfoTag: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 12,
    color: '#BDBDBD',
    marginRight: 6,
    marginTop: 4,
  },
  tagItemBg: {
    height: '100%',
    width: '100%',
  },
  taggsSubTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  rightBlockContainer: {
    width: '100%',
  },
  linearWrapper: {
    width: '40%',
  },
  checkIcon: {
    marginRight: 4,
  },
  rightBottomBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
