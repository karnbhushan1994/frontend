import React, {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';

import {
  Image,
  ImageProps,
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';

import styles from './styles';

interface Props extends Omit<TextInputProps, 'onChange'> {
  textarea?: boolean;
  label?: string;
  disabled?: boolean;
  leftIcon?: ImageProps;
  checkInput?: boolean;
  placeholder?: string;
  containerStyle?: ViewStyle[] | ViewStyle;
  onChange?: (name: any, value: any) => void;
  name?: string;
  validation?: string;
  numeric?: boolean;
  error?: string;
}

export interface InputReference {
  focus: () => void;
  blur: () => void;
}

const InputTaggLink: ForwardRefExoticComponent<
  PropsWithoutRef<Props> & RefAttributes<InputReference>
> = forwardRef(({ onChange, ...props }) => {
  const {
    label,
    placeholder,
    containerStyle,
    textarea,
    onChangeText,
    name,
    numeric,
    leftIcon,
    validation,
    error,
    keyboardType,
    value,
  } = props;

  const errorStatus = validation === 'error';
  const successStatus = validation === 'success';

  return (
    <View style={containerStyle}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {leftIcon ? (
          <Image source={leftIcon} resizeMode={'contain'} style={styles.rightIcon} />
        ) : null}
        <TextInput
          style={[styles.input, errorStatus ? styles.errorInput : {}]}
          placeholderTextColor={error ? 'red' : '#828282'}
          placeholder={placeholder}
          autoCapitalize={'none'}
          autoCorrect={false}
          keyboardType={keyboardType}
          onChangeText={val => {
            if (onChange && name) {
              onChange(name, numeric ? Number(val) : val);
            } else {
              if (onChangeText) {
                onChangeText(val);
              }
            }
          }}
          multiline={textarea}
          value={value}
        />
        {successStatus ? <SvgXml xml={icons.CheckmarkGreenSimple} height={18} width={18} /> : null}
        {errorStatus ? (
          <Pressable
            onPress={() => {
              if (onChange && name) {
                onChange(name, numeric ? Number('') : '');
              } else {
                if (onChangeText) {
                  onChangeText('');
                }
              }
            }}>
            <SvgXml xml={icons.XIcon} height={21} width={21} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
});

export default InputTaggLink;
