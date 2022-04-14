import { StyleSheet } from 'react-native';

import { normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

import { RED_TOAST } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    display: 'flex',
    marginTop: SCREEN_HEIGHT * 0.05,
    paddingTop: 10,
    height: '100%',
  },
  topBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titleTopLogo: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignSelf: 'center',
  },
  bottomBlock: {
    backgroundColor: '#fff',
    paddingHorizontal: '4%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingTop: 20,
    flex: 1,
  },
  logo: {
    width: normalize(172),
    height: normalize(172),
  },
  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  title: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 30,
  },
  titleWithSameMargin: {
    marginBottom: 10,
  },
  titleWithSmallMarginBottom: {
    marginBottom: 10,
  },
  subTitle: {
    alignSelf: 'center',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 10,
    color: '#828282',
  },
  inputContainer: {
    marginBottom: 14,
  },
  fontText: {
    fontWeight: '600',
    fontSize: 14,
    marginHorizontal: 8,
    lineHeight: 21,
    color: '#828282',
    // width: 80,
  },
  fontTextThumbnail: {
    fontWeight: '600',
    fontSize: 14,
    marginHorizontal: 8,
    lineHeight: 21,
    color: '#000000',
    // width: 80,
  },
  thumbnailIcon: {
    width: 20,
    height: 20,
  },
  fieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 10,
  },
  bgBlock: {
    flexDirection: 'row',
    marginBottom: 54,
  },
  bgColorText: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  bgType: {
    height: 48,
    width: 70,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: 'center',
  },
  activeBgType: {
    borderWidth: 2,
    borderColor: '#6EE7E7',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
  },
  bgTypeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
    alignSelf: 'center',
    zIndex: 1,
    marginLeft: '3%',
  },
  bgTypeGradient: {
    height: '100%',
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgTypeSolid: {
    backgroundColor: '#FA263D',
  },
  bgTypeSolidGrey: {
    backgroundColor: '#BDBDBD',
  },
  bgTypeImageViewLocked: {
    height: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgTypeImage: {
    backgroundColor: 'rgba(0,0,0,0.73)',
  },
  bgImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    opacity: 0.5,
    backgroundColor: 'red',
    borderRadius: 8,
  },
  bgTypeNone: {
    backgroundColor: '#BDBDBD',
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 100,
  },
  buttonContainerMT: {
    width: '90%',
    alignSelf: 'center',
    marginTop: '40%',
  },
  urlInputWrapper: {
    zIndex: 1,
  },
  errorCloud: {
    position: 'absolute',
    bottom: -13,
    left: 30,
    backgroundColor: RED_TOAST,
    padding: 8,
    borderRadius: 4,
    shadowColor: '#7D7D7D',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 3,
    shadowOpacity: 0.5,
  },
  errorCloudText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 16,
  },
  errorCloudTriangle: {
    height: 14,
    width: 14,
    backgroundColor: RED_TOAST,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
    top: -6,
    left: 16,
  },
  smallBottom: { marginBottom: 8 },
  thumbnailImg: {
    height: 18,
    width: 18,
  },
  imageWrapper: {
    padding: 1,
    borderWidth: 3,
    borderColor: '#3f2962',
    borderRadius: 50,
    width: 50,
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagelockModal: {
    height: 80,
    width: SCREEN_WIDTH / 1.5,
    resizeMode: 'contain',
  },
});

export default styles;
