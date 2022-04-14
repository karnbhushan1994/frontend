import React from 'react';

import { StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ToastType } from 'react-native-toast-notifications';

import { icons } from '../assets/icons';
import { TAGG_ERROR_RED, TAGG_SUCCESS_GREEN } from '../constants';
import { TaggToastType } from '../types';
import { normalize, SCREEN_WIDTH } from '../utils';

const getToastIcon = (type: TaggToastType) => {
  switch (type) {
    case TaggToastType.Success:
      return (
        <SvgXml xml={icons.CheckmarkWhite} width={20} height={20} style={styles.toastIconStyle} />
      );
    default:
    case TaggToastType.Error:
      return (
        <SvgXml xml={icons.CheckmarkWhite} width={20} height={20} style={styles.toastIconStyle} />
      );
  }
};

const getToastStyle = (type: TaggToastType) => {
  switch (type) {
    case TaggToastType.Success:
      return styles.successToastStyle;
    case TaggToastType.Error:
    default:
      return styles.errorToastStyle;
  }
};

export const TaggToast = (toast: ToastType, type: TaggToastType, text: string) => {
  toast.show(text, {
    textStyle: styles.toastTextStyle,
    icon: getToastIcon(type),
    duration: 2500,
    placement: 'top',
    style: [styles.toastStyle, getToastStyle(type)],
  });
};

const styles = StyleSheet.create({
  toastIconStyle: { paddingLeft: normalize(30) },
  toastTextStyle: {
    fontSize: normalize(14),
    lineHeight: normalize(16.7),
  },
  toastStyle: {
    position: 'absolute',
    top: 70,
    width: SCREEN_WIDTH * 0.9,
    zIndex: 100,
  },
  successToastStyle: { backgroundColor: TAGG_SUCCESS_GREEN },
  errorToastStyle: { backgroundColor: TAGG_ERROR_RED },
});
