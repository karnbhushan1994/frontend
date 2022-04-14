import { StyleSheet } from 'react-native';

import { TAGG_LIGHT_BLUE } from '../../../constants';

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
    flex: 1,
    justifyContent: 'center',
    paddingBottom: '20%',
  },
  horizontalPadding: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  text: {
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 18,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  modalBG: {
    backgroundColor: '#000',
    opacity: 0.3,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  modal: {
    position: 'absolute',
    width: '80%',
    zIndex: 1,
    opacity: 0,
  },
  infoBlock: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 22,
    marginBottom: 4,
    borderRadius: 5,
    minHeight: 138,
  },
  buttonsBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    minHeight: 45,
  },
  leftButton: {
    marginRight: 4,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
    maxWidth: '90%',
    alignSelf: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: '86%',
    alignSelf: 'center',
    marginBottom: 8,
    color: '#989898',
  },
  delete: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 25,
    color: '#EE1D51',
  },
  cancel: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 25,
    color: TAGG_LIGHT_BLUE,
  },
  fatalistContainer: {
    justifyContent: 'space-between',
  },
  marginBottom: { marginBottom: 25 },
  dragging: {
    opacity: 0.2,
  },
  draggableItem: {},
});

export default styles;
