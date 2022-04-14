import chroma from 'chroma-js';

export const normalizeValue = (value: number) => {
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
};

export const convertHsvToHex = (hue: number, saturation: number, value: number) =>
  chroma.hsl(hue, saturation, value).hex();
