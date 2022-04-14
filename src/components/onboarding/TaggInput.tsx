import React from 'react';

import {
  Image,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { TAGG_LIGHT_PURPLE } from '../../constants';

interface TaggInputProps extends TextInputProps {
  valid?: boolean;
  invalidWarning?: string;
  attemptedSubmit?: boolean;
  externalStyles?: Record<string, StyleProp<ViewStyle>>;
  image?: any;
  style?: Object;
  containerStyle?: Object;
}
/**
 * An input component that receives all props a normal TextInput component does. TaggInput components grow to 60% of their parent's width by default, but this can be set using the `width` prop.
 */
const TaggInput = React.forwardRef((props: TaggInputProps, ref: any) => (
  <View style={[styles.container, props.containerStyle]}>
    <View style={styles.textView}>
      <TextInput style={[styles.input, props.externalStyles?.inputWarning]} ref={ref} {...props} />
    </View>
    <View style={styles.imageView}>
      <Image source={props.image} style={styles.imageStyle} />
    </View>
  </View>
));

const styles = StyleSheet.create({
  container: {
    height: '15%',
    width: '85%',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  textView: {
    height: '80%',
    width: '90%',
    justifyContent: 'center',
    borderBottomColor: '#fff',
  },
  imageView: {
    height: '100%',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  input: {
    width: '100%',
    minWidth: '60%',
    height: 40,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    borderColor: '#fffdfd',
    borderRadius: 20,
  },
  warning: {
    fontSize: 14,
    marginTop: 5,
    color: TAGG_LIGHT_PURPLE,
    maxWidth: 350,
    textAlign: 'center',
  },
  imageStyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
});

export default TaggInput;
