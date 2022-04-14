import React from 'react';

import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { normalize, SCREEN_WIDTH } from 'utils';

import { TAGG_LIGHT_BLUE } from '../../constants';

interface AcceptDeclineButtonsProps {
  onAccept: () => void;
  onReject: () => void;
  externalStyles?: Record<string, StyleProp<ViewStyle>>;
}
const AcceptDeclineButtons: React.FC<AcceptDeclineButtonsProps> = ({
  onAccept,
  onReject,
  externalStyles,
}) => (
  <View style={[styles.container, externalStyles?.container]}>
    <TouchableOpacity style={[styles.genericButtonStyle, styles.acceptButton]} onPress={onAccept}>
      <Text style={[styles.buttonTitle, styles.acceptButtonTitleColor]}>Accept</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.genericButtonStyle, styles.rejectButton]} onPress={onReject}>
      <Text style={[styles.buttonTitle, styles.rejectButtonTitleColor]}>Reject</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  genericButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.16,
    height: SCREEN_WIDTH * 0.0525,
    borderRadius: 3,
    padding: 0,
  },
  acceptButton: {
    padding: 0,
    backgroundColor: TAGG_LIGHT_BLUE,
  },
  rejectButton: {
    borderWidth: 2,
    backgroundColor: 'white',
    borderColor: TAGG_LIGHT_BLUE,
  },
  acceptButtonTitleColor: {
    color: 'white',
  },
  rejectButtonTitleColor: {
    color: TAGG_LIGHT_BLUE,
  },
  buttonTitle: {
    padding: 0,
    fontWeight: '700',
    fontSize: normalize(11),
    lineHeight: normalize(13),
    letterSpacing: normalize(0.1),
  },
});

export default AcceptDeclineButtons;
