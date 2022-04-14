import { StyleSheet } from 'react-native';

import { normalize } from 'utils';

import { TAGG_LIGHT_BLUE } from '../../../constants';

const styles = StyleSheet.create({
  modalWrapper: {
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.37)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCenterView: {
    width: 340,
    // height: 256,
    backgroundColor: '#fff',
    paddingHorizontal: '10%',
    paddingBottom: '10%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingTop: 90,
  },
  modalAbsoluteView: {
    position: 'absolute',
    top: -40,
  },
  modalIcon: {
    width: 108,
    height: 108,
  },
  modalStreakCountWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: '20%',
    paddingVertical: 2,
    bottom: 20,
    borderRadius: 40,
    alignItems: 'center',
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  modalTitleWrapper: {
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 12,
  },
  modalInfo: {
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 18,
    color: '#828282',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200,
    borderRadius: 40,
    padding: 0,
    backgroundColor: TAGG_LIGHT_BLUE,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    padding: 0,
    fontWeight: '600',
    fontSize: normalize(11),
    lineHeight: normalize(13),
    letterSpacing: normalize(0.1),
    color: '#fff',
  },
  iconContainer: {
    alignItems: 'center',
  },
  streakCountText: {
    fontWeight: '700',
    color: '#000',
  },
});

export default styles;
