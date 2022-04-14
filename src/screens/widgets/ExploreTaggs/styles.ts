import { StyleSheet } from 'react-native';

import { SCREEN_HEIGHT, StatusBarHeight } from 'utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '2%',
  },
  content: { paddingHorizontal: '3%' },
  viewContainer: { marginTop: StatusBarHeight },
  listContainer: {
    display: 'flex',
    // alignItems: 'center',
    //
    marginTop: SCREEN_HEIGHT * 0.05,
    paddingTop: 10,
  },
  searchBarStyle: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#120227',
    borderRadius: 17,
    paddingVertical: 10,
    paddingHorizontal: 17,
    marginBottom: 28,
    // width: '95%',
    // alignSelf: 'center',
    // marginTop: SCREEN_HEIGHT * 0.05,
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
    // width: '100%',
    flex: 1,
    color: '#E7C9FF',
    // backgroundColor: 'orange',
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
    // backgroundColor: 'orange',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rowCenter: { flexDirection: 'row', justifyContent: 'center' },
  challengesCount: { fontSize: 12, fontWeight: '600', color: '#BDBDBD' },
  exploreTitle: {
    paddingHorizontal: '3%',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 28,
    color: '#fff',
    marginBottom: 12,
  },
});
export default styles;
