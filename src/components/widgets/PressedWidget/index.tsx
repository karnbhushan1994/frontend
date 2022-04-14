import { HOMEPAGE } from 'constants';

import React, { FC, useContext, useEffect, useState } from 'react';

import { BlurView } from '@react-native-community/blur';
import { useNavigation } from '@react-navigation/core';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';

import { AnalyticCategory, AnalyticVerb, WidgetType } from 'types';
import { capitalizeFirstLetter } from 'utils/helper';

import { ProfileContext } from '../../../screens/profile/ProfileScreen';
import { gradientColorFormation, track } from '../../../utils';
import { makeSocialImage } from '../SocialWidget';
import styles from './styles';

interface Props {
  item: WidgetType;
  modalId: string;
  setModalId: (payload: string) => void;
  position: { py: number; px: number };
  setDeleteModalVisible?: (payload: boolean) => void;
  setIdForDelete?: (payload: string) => void;
  children: React.ReactElement;
  modalPosition: 'top' | 'bottom';
}

const PressedWidget: FC<Props> = ({
  item,
  modalId,
  position,
  setModalId,
  setDeleteModalVisible,
  setIdForDelete,
  children,
  modalPosition,
}) => {
  const navigation = useNavigation();
  const { ownProfile } = useContext(ProfileContext);
  const blurRadius = React.useRef(new Animated.Value(0)).current;
  const [animationStart, setAnimationStart] = useState(false);
  const [animationMode, setAnimationMode] = useState(false);
  const { primaryColor } = useContext(ProfileContext);

  useEffect(() => {
    if (ownProfile) {
      if (!animationStart) {
        hide();
        setTimeout(() => {
          setAnimationMode(false);
        }, 300);
      } else {
        setTimeout(() => {
          setAnimationMode(true);
        }, 1);
      }
    }
  }, [animationStart]);

  useEffect(() => {
    if (ownProfile) {
      if (animationMode) {
        show();
      } else {
        hide();
      }
    }
  }, [animationMode]);

  useEffect(() => {
    setAnimationStart(modalId === item.id);
  }, [modalId === item.id]);

  const show = () => {
    Animated.timing(blurRadius, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const hide = () => {
    Animated.timing(blurRadius, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const renderWidget = () => {
    const positionStyles = {
      top: position.py,
      left: position.px,
    };
    return (
      <LinearGradient
        colors={gradientColorFormation(primaryColor)}
        style={[styles.linksWidget, positionStyles]}>
        {React.cloneElement(children, {
          hide: false,
        })}
      </LinearGradient>
    );
  };

  const positionStyles =
    modalPosition === 'bottom'
      ? {
          top: position.py + 93 * 2,
          left: position.px,
        }
      : {
          top: position.py - 90,
          left: position.px,
        };
  // const positionStyles = { top: position.py, left: position.px };
  return (
    <View>
      {children}
      <Modal visible={animationMode} transparent>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalId('');
          }}>
          <View style={styles.wrapper}>
            <Animated.View style={[StyleSheet.absoluteFill, { opacity: blurRadius }]}>
              <View style={[styles.menuWrapper, positionStyles]}>
                <TouchableOpacity
                  style={styles.menuTopRow}
                  onPress={() => {
                    track('EditTagg', AnalyticVerb.Pressed, AnalyticCategory.EditATagg);
                    navigation.navigate('AddTagg', {
                      data: item.username
                        ? {
                            ...item,
                            link_type: item.link_type,
                            url: item.url || (item?.username ? item.username : ''),
                            thumbnail_url: item.thumbnail_url,
                            img: makeSocialImage(item.link_type ? item.link_type : ''),
                            logo: true,
                            linkData: item.link_type ? item.linkData : null,
                            title:
                              item.title ||
                              capitalizeFirstLetter(item.link_type ? item.link_type : ''),
                          }
                        : item,
                      screenType: item.page || HOMEPAGE,
                      isEditTagg: true,
                    });
                    setModalId('');
                  }}>
                  <Text style={styles.text}>Edit Tagg</Text>
                  <SvgXml xml={icons.Edit} width={19} height={19} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    track('DeleteTagg', AnalyticVerb.Pressed, AnalyticCategory.EditATagg);
                    setModalId('');
                    setTimeout(() => {
                      setDeleteModalVisible && setDeleteModalVisible(true);
                      setIdForDelete && setIdForDelete(item.id);
                    }, 1000);
                  }}
                  style={styles.menuBottomRow}>
                  <Text style={styles.text}>Delete Tagg</Text>
                  <SvgXml xml={icons.XIcon} width={19} height={19} />
                </TouchableOpacity>
              </View>

              <BlurView
                style={[StyleSheet.absoluteFill]}
                blurType="light"
                blurAmount={10}
                reducedTransparencyFallbackColor="white"
              />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
        {renderWidget()}
      </Modal>
    </View>
  );
};

export default PressedWidget;
