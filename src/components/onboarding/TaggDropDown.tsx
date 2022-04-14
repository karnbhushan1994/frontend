import React from 'react';

import { StyleSheet, View } from 'react-native';
import RNSelectPicker, { PickerSelectProps } from 'react-native-picker-select';

interface TaggDropDownProps extends PickerSelectProps {
  width?: number | string;
}

/**
 * An input component that receives all props a normal TextInput component does. TaggInput components grow to 60% of their parent's width by default, but this can be set using the `width` prop.
 */
const TaggDropDown = React.forwardRef((props: TaggDropDownProps, ref: any) => (
  <View style={styles.container}>
    <RNSelectPicker {...props} style={styles} ref={ref} />
  </View>
));

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 11,
  },
  inputIOS: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: '60%',
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    borderColor: '#fffdfd',
    borderWidth: 2,
    borderRadius: 20,
    paddingLeft: 13,
  },
});

export default TaggDropDown;
