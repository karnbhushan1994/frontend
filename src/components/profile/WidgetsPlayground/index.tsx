import React, { useContext, useEffect, useState } from 'react';

import {
  Animated,
  ImageSourcePropType,
  Modal,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';

import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

import DraggableGrid from 'react-native-draggable-grid';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { useDispatch, useSelector } from 'react-redux';

import useDynamicRefs from 'use-dynamic-refs';

import { images } from 'assets/images';
import { LinksWidget } from 'components/widgets';
import GenericWidget from 'components/widgets/GenericWidget';
import PressedWidget from 'components/widgets/PressedWidget';
import SocialWidget, { makeSocialLink } from 'components/widgets/SocialWidget';
import VideoLinkWidget from 'components/widgets/VideoLinkWidget';
import { TaggShopData } from 'constants/widgets';

import { ProfileContext } from 'screens/profile/ProfileScreen';
import { getTaggClick, registerTaggClick } from 'services';
import {
  removeUserWidget,
  updateUserProfileTemplateWidgetStore,
  widgetsChanged,
} from 'store/actions';
import { RootState } from 'store/rootReducer';
import {
  AnalyticCategory,
  AnalyticVerb,
  ApplicationLinkWidgetLinkTypes,
  ApplicationLinkWidgetTypes,
  GenericLinkWidgetTypes,
  ProfileInsightsEnum,
  SocialMediaTypes,
  VideoLinkWidgetLinkTypes,
  WidgetType,
} from 'types';

import { getTokenOrLogout, openTaggLink, track } from 'utils';
import logger from 'utils/logger';

import styles from './styles';

export interface WidgetsPlaygroundProps extends ViewProps {
  title: string;
  numColumns: number;
  horizontal?: boolean;
  refreshing?: boolean;
}
export type WidgetsData = {
  individual: Array<{
    title?: string;
    link_type: string;
    views?: number;
    widget_id: string;
    image?: ImageSourcePropType;
  }>;
  total: 0;
};

export const makeWidgetLogo = (type?: string) => {
  switch (type) {
    case GenericLinkWidgetTypes.WEBSITE:
      return images.widgetLogo.website;
    case SocialMediaTypes.INSTAGRAM:
      return images.widgetLogo.instagram;
    case VideoLinkWidgetLinkTypes.TIKTOK:
      return images.widgetLogo.tiktok;
    case VideoLinkWidgetLinkTypes.YOUTUBE:
      return images.widgetLogo.youtube;
    case SocialMediaTypes.SNAPCHAT:
      return images.widgetLogo.snapchat;
    case SocialMediaTypes.TWITTER:
      return images.widgetLogo.twitter;
    case VideoLinkWidgetLinkTypes.TWITCH:
      return images.widgetLogo.twitch;
    case ApplicationLinkWidgetLinkTypes.SPOTIFY:
      return images.widgetLogo.spotify;
    case ApplicationLinkWidgetLinkTypes.APPLE_MUSIC:
      return images.widgetLogo.appleMusic;
    case GenericLinkWidgetTypes.ARTICLE:
      return images.widgetLogo.article;
    case ApplicationLinkWidgetLinkTypes.DEPOP:
      return images.widgetLogo.depop;
    case ApplicationLinkWidgetLinkTypes.ETSY:
      return images.widgetLogo.etsy;
    case ApplicationLinkWidgetLinkTypes.AMAZON:
      return images.widgetLogo.amazon;
    case ApplicationLinkWidgetLinkTypes.AMAZON_AFFILIATE:
      return images.widgetLogo.amazon;
    case ApplicationLinkWidgetLinkTypes.APPLE_PODCAST:
      return images.widgetLogo.applePodcast;
    case SocialMediaTypes.FACEBOOK:
      return images.widgetLogo.facebook;
    case ApplicationLinkWidgetLinkTypes.POSHMARK:
      return images.widgetLogo.poshmark;
    case ApplicationLinkWidgetLinkTypes.APP_STORE:
      return images.widgetLogo.appStore;
  }
};

const WidgetsPlayground: React.FC<WidgetsPlaygroundProps> = ({
  title,
  numColumns,
  horizontal,
  refreshing,
}) => {
  const dispatch = useDispatch();
  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);
  const { setDraggingWidgets, widgetStore, ownProfile, isEdit, setIsEdit, is_blocked, userXId } =
    useContext(ProfileContext);
  const shakeAnimationX = React.useRef(new Animated.Value(0)).current;
  const widgets = title in widgetStore ? widgetStore[title] : [];
  const [modalId, setModalId] = useState('');

  // initialize position to middle of screen in case measure fails
  const [position, setPosition] = useState({ px: 0, py: 0 });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [activeId, setActiveId] = useState('');
  const modalOpacity = React.useRef(new Animated.Value(0)).current;
  const [idForDelete, setIdForDelete] = useState('');
  const [data, setData] = useState<WidgetsData>();
  const [getRef, setRef] = useDynamicRefs();
  useEffect(() => {
    Object.keys(widgetStore)?.forEach(item => {
      widgetStore[item].forEach(_ => {
        setRef(_.id);
      });
    });
  }, [widgetStore]);
  const { userId: loggedInUserId } = useSelector((state: RootState) => state.user.user);

  React.useEffect(() => {
    if (isEdit) {
      startShake();
      setModalId('');
    } else {
      shakeAnimationX.setValue(0);
      setModalId('');
    }
  }, [isEdit]);

  useEffect(() => {
    if (userId || userXId || refreshing) {
      const init = async () => {
        const tagg = (await getTaggClick(
          userXId ? userXId : userId,
          ProfileInsightsEnum.Lifetime,
        )) as any;
        setData(tagg);
      };
      init();
    }
  }, [userId, userXId, refreshing]);

  const setWidgets = (newWidgets: WidgetType[]) => {
    dispatch(
      updateUserProfileTemplateWidgetStore({
        ...widgetStore,
        [title]: newWidgets,
      }),
    );
    dispatch(widgetsChanged(true));
  };

  const showDeleteModal = () =>
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

  const hideDeleteModal = () =>
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

  useEffect(() => {
    if (deleteModalVisible) {
      showDeleteModal();
    } else {
      hideDeleteModal();
    }
  }, [deleteModalVisible]);
  const widget = (item: WidgetType) => {
    const taggView = data?.individual.find(widget => widget.widget_id === item.id);
    switch (item.type) {
      case ApplicationLinkWidgetTypes.APPLICATION_LINK:
        return (
          <LinksWidget
            data={item}
            fallbackImage={TaggShopData.filter(tagg => tagg.link_type === item.link_type)[0]?.img}
            disabled
            widgetLogo={makeWidgetLogo(item.link_type)}
            taggClickCount={taggView?.views}
          />
        );
      case ApplicationLinkWidgetTypes.VIDEO_LINK:
        return (
          <VideoLinkWidget
            data={item}
            disabled
            widgetLogo={makeWidgetLogo(item.link_type)}
            taggClickCount={taggView?.views}
          />
        );
      case ApplicationLinkWidgetTypes.GENERIC_LINK:
        return (
          <GenericWidget
            data={item}
            disabled
            widgetLogo={makeWidgetLogo(item.link_type)}
            taggClickCount={taggView?.views}
          />
        );
      case ApplicationLinkWidgetTypes.SOCIAL:
        return (
          <SocialWidget
            data={item}
            disabled
            widgetLogo={makeWidgetLogo(item.link_type)}
            taggClickCount={taggView?.views}
          />
        );
      default:
        return <></>;
    }
  };
  const renderFlatListItem = ({ item, isActive }: RenderItemParams<WidgetType>) => (
    <View ref={getRef(item.id)}>
      <TouchableWithoutFeedback
        key={item.id}
        onLongPress={() => {
          const options = {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          };
          ReactNativeHapticFeedback.trigger('impactLight', options);
          setDraggingWidgets(true);
          getRef(item.id)?.current?.measure(
            (fx: number, fy: number, width: number, height: number, px: number, py: number) => {
              setPosition({ px, py: py });
            },
          );
          setModalId(item.id);
        }}
        onPress={() => {
          getTokenOrLogout(dispatch).then(token => {
            registerTaggClick(token, item.id, loggedInUserId);
          });

          if (!ownProfile) {
            track('UserBTagg', AnalyticVerb.Pressed, AnalyticCategory.Profile);
          }
          setDraggingWidgets(false);
          switch (item.type) {
            case ApplicationLinkWidgetTypes.APPLICATION_LINK:
            case ApplicationLinkWidgetTypes.VIDEO_LINK:
            case ApplicationLinkWidgetTypes.GENERIC_LINK:
              openTaggLink(item.url);
              break;
            case ApplicationLinkWidgetTypes.SOCIAL:
              openTaggLink(makeSocialLink(item));
              break;
          }
        }}
        disabled={isActive}
        style={styles.horizontalPadding}>
        <Animated.View key={item.id} style={{ transform: [{ rotate: shakeAnimationX }] }}>
          <PressedWidget
            modalId={modalId}
            key={item.id}
            item={item}
            setModalId={() => {
              setModalId('');
              setDraggingWidgets(false);
            }}
            setDeleteModalVisible={setDeleteModalVisible}
            setIdForDelete={setIdForDelete}
            position={position}
            modalPosition={'bottom'}>
            {widget(item)}
          </PressedWidget>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );

  const renderGridItem = ({ item, key }: { key: string; item: WidgetType }) => (
    <View ref={getRef(item.id)}>
      <Animated.View
        key={item.id + key}
        style={activeId !== item.id && { transform: [{ rotate: shakeAnimationX }] }}>
        <PressedWidget
          modalId={modalId}
          item={item}
          setModalId={() => {
            setModalId('');
            setDraggingWidgets(false);
          }}
          setDeleteModalVisible={setDeleteModalVisible}
          setIdForDelete={setIdForDelete}
          position={position}
          modalPosition={'top'}>
          {widget(item)}
        </PressedWidget>
      </Animated.View>
    </View>
  );

  const startShake = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimationX, { toValue: 0.01, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimationX, { toValue: -0.01, duration: 100, useNativeDriver: true }),
      ]),
    ).start();
  };

  return (
    !is_blocked && (
      <>
        <View style={styles.wrapper}>
          {horizontal ? (
            <DraggableFlatList
              data={widgets}
              onDragEnd={({ data }) => setWidgets(data)}
              keyExtractor={item => item.id}
              renderItem={renderFlatListItem}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
          ) : (
            <DraggableGrid
              numColumns={numColumns}
              renderItem={renderGridItem}
              data={widgets.map((w, index) => ({
                key: w.id,
                item: w,
                index,
                disabledDrag: !ownProfile,
              }))}
              onDragRelease={data => {
                setDraggingWidgets(false);
                setWidgets(data.map(d => d.item));
              }}
              onLongPress={w => {
                if (ownProfile) {
                  setDraggingWidgets(false);
                  startShake();
                  setModalId('');
                  setActiveId(w.item.id);
                  setIsEdit(true);
                }
              }}
              onLongPressMiddle={w => {
                if (ownProfile) {
                  setDraggingWidgets(true);
                  getRef(w.item.id)?.current?.measure(
                    (
                      fx: number,
                      fy: number,
                      width: number,
                      height: number,
                      px: number,
                      py: number,
                    ) => {
                      setPosition({ px: px, py: py });
                    },
                  );
                  setModalId(w.item.id);
                }
              }}
              onItemPress={w => {
                getTokenOrLogout(dispatch).then(token => {
                  registerTaggClick(token, w.item.id, loggedInUserId);
                });
                setDraggingWidgets(false);
                if (!ownProfile) {
                  track('UserBTagg', AnalyticVerb.Pressed, AnalyticCategory.Profile);
                }
                switch (w.item.type) {
                  case ApplicationLinkWidgetTypes.APPLICATION_LINK:
                  case ApplicationLinkWidgetTypes.VIDEO_LINK:
                  case ApplicationLinkWidgetTypes.GENERIC_LINK:
                    openTaggLink(w.item.url);
                    break;
                  case ApplicationLinkWidgetTypes.SOCIAL:
                    openTaggLink(makeSocialLink(w.item));
                    break;
                }
              }}
            />
          )}
        </View>
        <View>
          <Modal visible={deleteModalVisible} transparent>
            <View style={styles.container}>
              <Animated.View style={[styles.modal, { opacity: modalOpacity }]}>
                <View style={styles.infoBlock}>
                  <Text style={styles.title}>Are you sure you want to delete this tagg?</Text>
                  <Text style={styles.subTitle}>This tagg will be deleted only on this page.</Text>
                </View>
                <View style={styles.buttonsBlock}>
                  <TouchableOpacity
                    style={[styles.button, styles.leftButton]}
                    onPress={async () => {
                      try {
                        if (idForDelete) {
                          dispatch(removeUserWidget(idForDelete));
                        }
                      } catch (e) {
                        logger.log(e);
                      } finally {
                        setDeleteModalVisible(false);
                        setIdForDelete('');
                      }
                    }}>
                    <Text style={styles.delete}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setDeleteModalVisible(false)}
                    style={styles.button}>
                    <Text style={styles.cancel}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
            <View style={styles.modalBG} />
          </Modal>
        </View>
      </>
    )
  );
};

export default WidgetsPlayground;
