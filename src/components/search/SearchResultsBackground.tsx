import React from 'react';

import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SearchResultsBackgroundProps {
  animationProgress: Animated.SharedValue<number>;
  searchBarHeight: number;
  searching: boolean;
}
const SearchResultsBackground: React.FC<SearchResultsBackgroundProps> = ({
  animationProgress,
  searchBarHeight,
  searching,
  children,
}) => {
  const { top: topInset } = useSafeAreaInsets();
  /*
   * On-search container style (opacity fade-in).
   */
  const backgroundAnimatedStyles = useAnimatedStyle<ViewStyle>(() => ({
    opacity: animationProgress.value,
  }));
  /*
   * Derived animation value for contentAnimatedStyles.
   */
  const contentAnimationProgress = useDerivedValue<number>(() =>
    interpolate(animationProgress.value, [0.9, 1], [0, 1], Extrapolate.CLAMP),
  );
  /*
   * On-search content style (delayed opacity fade-in).
   */
  const contentAnimatedStyles = useAnimatedStyle<ViewStyle>(() => ({
    opacity: contentAnimationProgress.value,
  }));
  return (
    <Animated.View
      style={[
        styles.container,
        backgroundAnimatedStyles,
        {
          // absolute: inset + search screen paddingTop + searchBar + padding
          paddingTop: topInset + 15 + searchBarHeight + 10,
        },
      ]}
      pointerEvents={searching ? 'auto' : 'none'}>
      <Animated.View style={[styles.contentContainer, contentAnimatedStyles]}>
        {children}
      </Animated.View>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
  },
});
export default SearchResultsBackground;
