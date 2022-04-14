import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'flex-end',
    height: 5,
  },
  gradientWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  linearGradient: {
    borderRadius: 10,
    height: '100%',
  },
  lineStyles: {
    height: '100%',
    position: 'absolute',
    right: 0,
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
    backgroundColor: '#fff',
  },
});

export default styles;
