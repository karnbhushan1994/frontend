import React from 'react';

import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

import { TAGG_LIGHT_BLUE } from '../../constants';

import BottomDrawer from './BottomDrawer';

// conforms the JSX onPress attribute type
type OnPressHandler = (event: GestureResponderEvent) => void;

interface GenericMoreInfoDrawerProps extends ViewProps {
  isOpen: boolean;
  setIsOpen: (visible: boolean) => void;
  showIcons: boolean;
  // An array of title, onPressHandler, and icon component
  buttons: [string, OnPressHandler, JSX.Element?, TextStyle?][];
}

const GenericMoreInfoDrawer: React.FC<GenericMoreInfoDrawerProps> = props => {
  const { buttons, showIcons } = props;
  // each button is 80px high, cancel button is always there
  const initialSnapPosition = (buttons.length + 1) * 80 + useSafeAreaInsets().bottom;
  let panelButtonStyle: ViewStyle[] = [
    {
      height: 80,
      flexDirection: 'row',
      alignItems: 'center',
    },
    showIcons ? {} : { justifyContent: 'center' },
  ];
  return (
    <BottomDrawer {...props} showHeader={false} initialSnapPosition={initialSnapPosition}>
      <View style={styles.panel}>
        {buttons.map(([title, action, icon, textStyle], index) => (
          <View key={index}>
            <TouchableOpacity style={panelButtonStyle} onPress={action}>
              {showIcons && <View style={styles.icon}>{icon}</View>}
              <Text style={[styles.panelButtonTitle, textStyle]}>{title}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
          </View>
        ))}
        <TouchableOpacity style={panelButtonStyle} onPress={() => props.setIsOpen(false)}>
          {/* a dummy icon for aligning the cancel button */}
          {showIcons && <View style={styles.icon} />}
          <Text style={styles.panelButtonTitleCancel}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  panel: {
    height: SCREEN_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: normalize(20),
    letterSpacing: normalize(0.1),
  },
  icon: {
    height: 25,
    width: 25,
    marginLeft: SCREEN_WIDTH * 0.3,
    marginRight: 25,
  },
  panelButtonTitleCancel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TAGG_LIGHT_BLUE,
  },
  divider: { height: 1, borderWidth: 1, borderColor: '#e7e7e7' },
});

export default GenericMoreInfoDrawer;
