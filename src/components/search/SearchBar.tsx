import React from 'react';

import {
  Keyboard,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';

import { normalize } from 'utils';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

interface SearchBarProps extends TextInputProps {
  onCancel?: () => void;
  animationProgress?: Animated.SharedValue<number>;
  searching?: boolean;
  onLayout?: (e: LayoutChangeEvent) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({
  onFocus,
  onBlur,
  onChangeText,
  value,
  onCancel,
  animationProgress,
  onLayout,
}) => {
  const handleSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    e.preventDefault();
    Keyboard.dismiss();
  };
  /*
   * index & id of current placeholder, used in selecting next placeholder. -1
   * indicates DEFAULT_PLACEHOLDER. TODO: make it appear more random by tracking
   * last 3-5 ids & use longer list of placeholders
   */
  /*
   * On-search marginRight style ("cancel" button slides and fades in).
   */
  const animatedStyles = useAnimatedStyle<ViewStyle>(() => ({
    marginRight: (animationProgress ? animationProgress.value : 0) * 58,
    opacity: animationProgress ? animationProgress.value : 0,
  }));

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.View style={styles.inputContainer}>
        <AnimatedIcon name="search" color={'#7E7E7E'} size={25} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholderTextColor={'#828282'}
          onSubmitEditing={handleSubmit}
          clearButtonMode="always"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={'Search'}
          {...{ value, onChangeText, onFocus, onBlur }}
        />
      </Animated.View>
      {onCancel && (
        <Animated.View style={animatedStyles}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
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
  inputContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: normalize(15),
    color: '#000',
    letterSpacing: 0.5,
  },
  cancelButton: {
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  cancelText: {
    color: '#818181',
    fontWeight: '500',
  },
});

export default SearchBar;
