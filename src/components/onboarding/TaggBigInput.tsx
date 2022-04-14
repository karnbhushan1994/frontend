import React from 'react';

import { StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { TAGG_LIGHT_PURPLE } from '../../constants';

interface TaggBigInputProps extends TextInputProps {
  valid?: boolean;
  invalidWarning?: string;
  attemptedSubmit?: boolean;
  width?: number | string;
  containerStyle?: ViewStyle;
  textInputStyle?: TextStyle;
  placeHolderColor: string;
}
/**
 * An input component that receives all props a normal TextInput component does. TaggInput components grow to 60% of their parent's width by default, but this can be set using the `width` prop.
 */
const TaggBigInput = React.forwardRef((props: TaggBigInputProps, ref: any) => (
  <View style={props.containerStyle ? props.containerStyle : styles.container}>
    <TextInput
      style={[{ width: props.width }, props.textInputStyle ? props.textInputStyle : styles.input]}
      placeholderTextColor={props.placeHolderColor ? props.placeHolderColor : '#ddd'}
      clearButtonMode="while-editing"
      ref={ref}
      multiline={true}
      {...props}
    />
    {props.attemptedSubmit && !props.valid && (
      <Animatable.Text animation="shake" duration={500} style={styles.warning}>
        {props.invalidWarning}
      </Animatable.Text>
    )}
  </View>
));

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 11,
  },
  input: {
    minWidth: '60%',
    height: 120,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    borderColor: '#fffdfd',
    borderWidth: 2,
    borderRadius: 20,
    paddingLeft: 13,
    paddingTop: 13,
  },
  warning: {
    fontSize: 14,
    marginTop: 5,
    color: TAGG_LIGHT_PURPLE,
    maxWidth: 350,
    textAlign: 'center',
  },
});

export default TaggBigInput;
