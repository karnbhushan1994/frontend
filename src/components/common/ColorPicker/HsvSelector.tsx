import React, { useEffect, useRef, useState } from 'react';

import chroma from 'chroma-js';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { gradientColorFormation } from 'utils';

import {
  HUE_COLORS,
  HUE_SELECTOR_HEIGHT,
  HUE_SELECTOR_SLIDER_SIZE,
  HUE_SELECTOR_WIDTH,
  SATURATION_PICKER_HEIGHT,
  SATURATION_PICKER_WIDTH,
  SATURATION_SELECTOR_SLIDER_SIZE,
} from '../../../constants';
import HueSelector from './HueSelector';
import SaturationSelector from './SaturationSelector';

interface HsvSelectorProps {
  containerStyle: ViewStyle;
  colorIndex: number;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  setSelectedTheme: (theme: any) => void | undefined;
  selectedTheme: string | null;
}

const HsvSelector: React.FC<HsvSelectorProps> = ({
  containerStyle,
  colorIndex,
  selectedColor,
  setSelectedColor,
  setSelectedTheme,
}) => {
  const selectedColorHsv: any[] = chroma(gradientColorFormation(selectedColor)[0]).hsv();

  const [state, setState] = useState<{
    hue: number;
    sat: number;
    val: number;
  }>({
    hue: isNaN(selectedColorHsv[0]) ? 0 : selectedColorHsv[0],
    sat: selectedColorHsv[1],
    val: selectedColorHsv[2],
  });

  const stateRef = useRef(state);

  useEffect(() => {
    const localSelectedColorHsv: any[] = chroma(gradientColorFormation(selectedColor)[0]).hsv();
    setState({
      hue: isNaN(localSelectedColorHsv[0]) ? 0 : localSelectedColorHsv[0],
      sat: localSelectedColorHsv[1],
      val: localSelectedColorHsv[2],
    });
  }, [colorIndex, selectedColor]);

  useEffect(() => {
    stateRef.current = state;
    setSelectedColor(getCurrentColor());
  }, [state]);

  const getCurrentColor = () => chroma.hsv(state.hue, state.sat, state.val).hex();

  const onPickerChangeSaturation = (h?: number, s?: number, v?: number) => {
    setSelectedTheme(null);
    setState({
      hue: stateRef.current.hue,
      sat: s ? s : stateRef.current.sat,
      val: v ? v : stateRef.current.val,
    });
  };
  const onPickerChange = (h?: number, s?: number, v?: number) => {
    setSelectedTheme(null);
    setState({
      hue: h ? h : stateRef.current.hue,
      sat: s ? s : stateRef.current.sat,
      val: v ? v : stateRef.current.val,
    });
  };

  return (
    <View style={[containerStyle, styles.container]}>
      <SaturationSelector
        hue={state.hue}
        saturation={state.sat}
        value={state.val}
        selectorWidth={SATURATION_PICKER_WIDTH}
        selectorHeight={SATURATION_PICKER_HEIGHT}
        sliderSize={SATURATION_SELECTOR_SLIDER_SIZE}
        onPickerChange={onPickerChangeSaturation}
      />
      <HueSelector
        hueColors={HUE_COLORS}
        hue={state.hue}
        selectorWidth={HUE_SELECTOR_WIDTH}
        selectorHeight={HUE_SELECTOR_HEIGHT}
        sliderSize={HUE_SELECTOR_SLIDER_SIZE}
        onPickerChange={onPickerChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HsvSelector;
