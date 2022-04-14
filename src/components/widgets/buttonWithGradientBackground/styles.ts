import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  linearGradient: {
    paddingVertical: 5,
    paddingHorizontal: 22,
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    color: '#fff',
  },
  disabled: {
    backgroundColor: '#BDBDBD',
    paddingVertical: 5,
    paddingHorizontal: 22,
    borderRadius: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disableIcon: { height: 12, width: 12, marginRight: 6 },
  center: { marginRight: 'auto' },
  marginLeftAuto: { marginLeft: 'auto' },
});

export default styles;
