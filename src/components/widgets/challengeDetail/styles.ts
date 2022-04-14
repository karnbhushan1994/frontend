import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalWrapper: {
    width: '100%',
    // backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  blocksWrapper: {
    width: '100%',
    height: '94%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
  },
  topBlock: { width: '100%', height: 200, marginBottom: 40 },
  topImage: {
    width: 138,
    height: 138,
  },
  bottomImage: {
    width: 70,
    height: 124,
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    left: 14,
  },
  title: {
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  info: {
    textAlign: 'center',
    maxWidth: 310,
    marginBottom: 20,
  },
  imagesWrapper: {
    flexDirection: 'row',
    width: 310,
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  progressBlock: {
    flexDirection: 'row',
    marginBottom: 26,
    alignItems: 'center',
  },
  linerWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  linearGradient: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontWeight: '700',
    fontSize: 13,
    color: '#828282',
  },
  button: {
    width: 280,
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default styles;
