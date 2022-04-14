
import { TAGG_LIGHT_BLUE } from '../../constants';

import React from 'react';

import { StyleSheet, TouchableOpacity } from 'react-native';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { normalize } from 'utils';

interface ChatInputSubmitProps {
  outlined: boolean;
  onPress: () => void;
}

const SIZE = normalize(25);

const ChatInputSubmit: React.FC<ChatInputSubmitProps> = props => {
  const { outlined, onPress } = props;

  return outlined ? (
    <TouchableOpacity style={[styles.submitButton, styles.outline]} onPress={onPress}>
      <SvgXml xml={icons.UpArrow} width={SIZE} height={SIZE} color={TAGG_LIGHT_BLUE} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={[styles.submitButton, styles.background]} onPress={onPress}>
      <SvgXml xml={icons.UpArrow} width={SIZE} height={SIZE} color={'white'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    height: SIZE,
    aspectRatio: 1,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    backgroundColor: TAGG_LIGHT_BLUE,
  },
  outline: {
    borderWidth: 1,
    borderColor: TAGG_LIGHT_BLUE,
  },
});

export default ChatInputSubmit;
