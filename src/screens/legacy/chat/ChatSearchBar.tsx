import React from 'react';

import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { normalize } from 'utils';

interface SearchBarProps extends TextInputProps {
  onCancel: () => void;
  searching: boolean;
  placeholder: string;
  label?: string;
}
const ChatSearchBar: React.FC<SearchBarProps> = ({
  onFocus,
  onBlur,
  onChangeText,
  value,
  onCancel,
  onLayout,
  placeholder,
  label,
}) => {
  const handleSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    e.preventDefault();
    Keyboard.dismiss();
  };

  const extraLabelStyle = { paddingLeft: label ? 0 : 10 };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.View style={styles.inputContainer}>
        {label && (
          <Animated.View style={styles.searchTextContainer}>
            <Text style={styles.searchTextStyes}>{label}</Text>
          </Animated.View>
        )}
        <TextInput
          style={[extraLabelStyle, styles.input]}
          placeholderTextColor={'#828282'}
          onSubmitEditing={handleSubmit}
          clearButtonMode="always"
          autoCapitalize="none"
          autoCorrect={false}
          {...{ placeholder, value, onChangeText, onFocus, onBlur }}
        />
      </Animated.View>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    zIndex: 2,
  },
  searchTextContainer: { marginHorizontal: 12 },
  searchTextStyes: { fontWeight: 'bold', fontSize: 14, lineHeight: 17 },
  inputContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    fontSize: normalize(16),
    color: '#000',
    letterSpacing: 0.5,
  },
  cancelButton: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  cancelText: {
    color: '#818181',
    fontWeight: '500',
  },
});

export default ChatSearchBar;
