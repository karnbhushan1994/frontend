import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalWrapper: {
    width: '100%',
    // backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
    height: '94%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
    paddingTop: 130,
  },
  closeIconWrapper: {
    position: 'absolute',
    top: 24,
    left: 14,
    // backgroundColor: 'red',
  },
  topImage: {
    width: 138,
    height: 138,
  },
  bottomImage: {
    // width: 70,
    height: 164,
  },
  imgWrapper: {
    flexDirection: 'row',
    width: 310,
    justifyContent: 'center',
    marginBottom: 64,
    marginTop: 60,
  },
  title: {
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 40,
    alignSelf: 'center',
    marginBottom: 6,
    maxWidth: '84%',
    textAlign: 'center',
  },
  subTitle: {
    textAlign: 'center',
    maxWidth: 310,
    color: '#828282',
  },
  buttonStyles: {
    width: 280,
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  bottomContainerLeftChild: { width: '60%' },
  bottomContainerRightChild: { width: '40%' },
  bottomContainerSubTitle: {
    color: '#828282',
    fontSize: 12,
    lineHeight: 17,
    maxWidth: '90%',
    fontWeight: '500',
  },
  bottomContainerTitle: {
    fontWeight: '700',
    color: '#000',
    fontSize: 15,
    marginTop: 21,
    marginBottom: 6,
  },
  bottomContainerImage: {
    width: 100,
    height: 100,
    alignSelf: 'flex-end',
    marginRight: 12,
    marginBottom: 8,
  },
  bottomContainerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  warning: { fontSize: 13, maxWidth: '75%', textAlign: 'center', marginTop: 5 },
  width: { width: '75%' },
});

export default styles;
