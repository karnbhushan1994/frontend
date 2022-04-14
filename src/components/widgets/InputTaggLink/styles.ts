import { StyleSheet } from 'react-native';

import { RED_TOAST } from '../../../constants';

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    flexDirection: 'row',
    paddingVertical: 11,
    paddingLeft: 2,
    paddingRight: 8,
    alignItems: 'center',
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  rightIcon: {
    height: 18,
    width: 18,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    marginRight: 26,
  },
  errorInput: {
    color: RED_TOAST,
  },
  error: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorCloud: {
    position: 'absolute',
    bottom: -40,
    left: 30,
    backgroundColor: RED_TOAST,
    padding: 8,
    borderRadius: 4,
    zIndex: 999,
  },
  errorCloudText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 16,
  },
});

export default styles;
