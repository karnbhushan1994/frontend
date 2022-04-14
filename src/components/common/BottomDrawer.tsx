import React, { Fragment, ReactText, useEffect, useRef, useState } from 'react';

import { Modal, StyleSheet, TouchableWithoutFeedback, View, ViewProps } from 'react-native';
import Animated, { interpolateColors, useValue } from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

interface BottomDrawerProps extends ViewProps {
  initialSnapPosition?: ReactText;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  showHeader: boolean;
}

// More examples here:
// https://github.com/osdnk/react-native-reanimated-bottom-sheet/tree/master/Example
const BottomDrawer: React.FC<BottomDrawerProps> = props => {
  const { isOpen, setIsOpen, showHeader, initialSnapPosition } = props;
  const drawerRef = useRef<BottomSheet>(null);
  const [modalVisible, setModalVisible] = useState(isOpen);
  const bgAlpha = useValue(isOpen ? 0 : 1);

  useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
    } else {
      bgAlpha.setValue(0);
      drawerRef.current && drawerRef.current.snapTo(1);
    }
  }, [isOpen]);

  const renderContent = () => <View>{props.children}</View>;

  const renderHeader = () =>
    showHeader ? (
      <View style={styles.header}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle} />
        </View>
      </View>
    ) : (
      <Fragment />
    );

  const backgroundColor = interpolateColors(bgAlpha, {
    inputRange: [0, 1],
    outputColorRange: ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)'],
  });

  return (
    <Modal
      transparent
      visible={modalVisible}
      onShow={() => {
        drawerRef.current && drawerRef.current.snapTo(0);
      }}>
      <BottomSheet
        ref={drawerRef}
        snapPoints={[initialSnapPosition ?? '30%', 0]}
        initialSnap={1}
        renderContent={renderContent}
        renderHeader={renderHeader}
        enabledContentGestureInteraction={false}
        callbackNode={bgAlpha}
        onCloseEnd={() => {
          if (!isOpen) {
            setModalVisible(false);
            setIsOpen(false);
          }
        }}
      />

      <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
        {/*@ts-ignore*/}
        <Animated.View style={[styles.backgroundView, { backgroundColor }]} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f7f5eee8',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  backgroundView: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
});

export default BottomDrawer;
