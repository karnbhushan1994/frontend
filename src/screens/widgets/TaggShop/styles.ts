import { StyleSheet } from 'react-native';

import { SCREEN_HEIGHT, StatusBarHeight } from 'utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '2%',
  },
  linkTags: {
    width: '94%',
    marginBottom: 28,
  },
  content: { paddingHorizontal: '3%' },
  linkTagsTitle: {
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 28,
    color: '#fff',
    marginBottom: 12,
  },
  linkTagItem: {
    backgroundColor: '#751CFA',
    width: '100%',
    padding: 24,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 24,
    overflow: 'hidden',
  },
  titleButtonBlock: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  titleTop: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
    fontWeight: '600',
  },
  titleBottom: {
    fontSize: 20,
    color: '#fff',
    lineHeight: 28,
    fontWeight: '700',
  },
  viewContainer: { marginTop: StatusBarHeight },
  listContainer: {
    display: 'flex',
    // alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.05,
    paddingTop: 10,
    height: '100%',
  },
  searchBarStyle: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#120227',
    borderRadius: 17,
    paddingVertical: 10,
    paddingHorizontal: 17,
    marginBottom: 28,
  },
  searchIcon: {
    height: 14,
    width: 14,
    marginRight: 8,
    tintColor: '#E7C9FF',
  },
  searchText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    flex: 1,
    color: '#E7C9FF',
  },
  rightButtonContainer: { marginRight: 24 },
  rightButton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 18,
  },
  leftButtonContainer: { marginLeft: 24 },
  leftButton: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 18,
  },
  scoreListBlock: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '94%',
    marginBottom: 12,
  },
  scoreListText: {
    color: '#08E2E2',
    fontSize: 12,
    fontWeight: '600',
  },
  yourListContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rowCenter: { flexDirection: 'row', justifyContent: 'center' },
  challengesCount: { fontSize: 12, fontWeight: '600', color: '#BDBDBD' },
  scoreListTitle: {
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 28,
    color: '#fff',
    marginBottom: 12,
  },
  progressBlockWrapper: {
    zIndex: 2,
    width: '100%',
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBlock: {
    width: '76%',
    marginRight: 6,
  },
  progressInfoText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  scrollViewContainer: {
    paddingBottom: 160,
  },
  quantity: {
    color: '#E0E0E0',
  },
  image: {
    height: 172,
    marginBottom: 24,
    zIndex: 2,
  },
  smallImage: {
    height: 102,
  },
  blurBG: {
    height: '2000%',
    width: '200%',
    marginBottom: 24,
    position: 'absolute',
    zIndex: 0,
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  cartIcon: {
    marginRight: 6,
  },
});

export default styles;
