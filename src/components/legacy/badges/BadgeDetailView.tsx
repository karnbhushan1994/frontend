import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, Modal, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import CloseIcon from '../../assets/ionicons/close-outline.svg';
import {
  BadgeNamesRecord,
  BADGE_GRADIENT_FIRST,
  BADGE_LIMIT,
} from '../../constants';
import {removeUserBadge} from '../../store/actions';
import {RootState} from '../../store/rootreducer';
import {BadgeDisplayType, ScreenType} from '../../types';
import {badgesToDisplayBadges, normalize} from '../../utils';

interface BadgeDetailModalProps {
  userXId: string | undefined;
  screenType: ScreenType;
  isEditable: boolean;
  setBadgeViewVisible: Function;
  userFullName?: string;
}

/**
 * Modal component to add/remove badges
 * Displayed onClick on university icon on profile screen
 */
const BadgeDetailView: React.FC<BadgeDetailModalProps> = ({
  userXId,
  screenType,
  userFullName,
  isEditable = true,
  setBadgeViewVisible,
}) => {
  const dispatch = useDispatch();
  const {
    user,
    profile: {badges},
  } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );
  const navigation = useNavigation();
  const [displayBadges, setDisplayBadges] = useState<BadgeDisplayType[]>([]);
  const atLimit = badges.length >= BADGE_LIMIT;

  useEffect(() => {
    setDisplayBadges(badgesToDisplayBadges(badges));
  }, [badges]);

  const removeBadgeCell = async (badgeName: string) => {
    dispatch(removeUserBadge(badgeName, user.userId));
  };

  const badgeEditCell = ({
    item: {id, name, image},
  }: {
    item: BadgeDisplayType;
  }) => {
    return (
      <TouchableOpacity
        style={styles.badgeCellContainerStyles}
        onPress={() => {
          setBadgeViewVisible(false);
          navigation.navigate('MutualBadgeHolders', {
            badge: {id, name, image},
            screenType,
          });
        }}>
        <View
          style={
            isEditable
              ? styles.badgeCellImageContainerStyles
              : styles.badgeCellImageNoEditContainerStyles
          }>
          <LinearGradient
            colors={BADGE_GRADIENT_FIRST}
            useAngle={true}
            style={styles.badgeCellImageStyles}
            angle={136.69}>
            <Image
              resizeMode="cover"
              style={styles.badgeImageStyles}
              source={image}
            />
          </LinearGradient>
          {isEditable && (
            <TouchableOpacity
              onPress={() => {
                removeBadgeCell(name);
              }}>
              <CloseIcon height={25} width={25} color="gray" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.userNameContainerStyles}>
          <Text style={styles.badgeCellTextStyles}>
            {BadgeNamesRecord[name]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const addButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setBadgeViewVisible(false);
          navigation.navigate('BadgeSelection', {editing: true});
        }}
        style={styles.addButtonStyles}>
        <Text style={styles.addButtonTextStyles}>Add Badges</Text>
      </TouchableOpacity>
    );
  };

  const modalHeader = () => {
    let heading = '';
    let subheading = '';
    if (isEditable) {
      if (atLimit) {
        heading = 'You have reached your badge limit';
        subheading = 'Remove a badge if you wish to add more';
      } else {
        heading = 'Edit your badges!';
        subheading = 'Add or delete your badges';
      }
    } else {
      heading = userFullName!;
      subheading = 'View badges to discover groups!';
    }
    return (
      <View>
        <Text style={styles.modalHeadingStyles}>{heading}</Text>
        <Text style={styles.modalSubheadingStyles}>{subheading}</Text>
      </View>
    );
  };

  const _modalContent = () => {
    return (
      <View style={styles.viewWrapper}>
        <View style={styles.modalView}>
          <View style={styles.modalUpperContainerStyles}>
            <TouchableOpacity
              style={styles.crossButtonStyles}
              onPress={() => setBadgeViewVisible(false)}>
              <CloseIcon height={25} width={25} color="gray" />
            </TouchableOpacity>
          </View>
          {modalHeader()}
          <View>
            <FlatList
              contentContainerStyle={styles.modalListStyles}
              scrollEnabled={false}
              data={displayBadges}
              numColumns={3}
              renderItem={badgeEditCell}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
          {isEditable && addButton()}
        </View>
      </View>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={true}
      presentationStyle="overFullScreen">
      {_modalContent()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  badgeCellContainerStyles: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  badgeCellImageContainerStyles: {
    flexDirection: 'row',
    marginLeft: 25,
  },
  badgeImageStyles: {
    width: '50%',
    height: '50%',
    alignSelf: 'center',
  },
  badgeCellImageNoEditContainerStyles: {
    flexDirection: 'row',
    marginHorizontal: 25,
  },
  badgeCellImageStyles: {
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
  },
  badgeCellTextStyles: {
    fontWeight: '600',
    fontSize: normalize(12),
    lineHeight: normalize(16),
    textAlign: 'center',
  },
  userNameContainerStyles: {marginTop: 10},
  crossButtonStyles: {marginTop: 10, marginLeft: 10},
  addButtonStyles: {
    height: 40,
    borderRadius: 5,
    marginBottom: 45,
    width: '40%',
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#698DD3',
  },
  addButtonTextStyles: {color: 'white'},
  modalHeadingStyles: {
    fontWeight: '600',
    fontSize: normalize(17),
    lineHeight: normalize(20.29),
    textAlign: 'center',
    marginVertical: normalize(10),
    marginTop: normalize(20),
  },
  modalSubheadingStyles: {
    fontWeight: '600',
    fontSize: normalize(11),
    lineHeight: normalize(15),
    textAlign: 'center',
    color: '#828282',
  },
  modalUpperContainerStyles: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  modalListStyles: {
    alignSelf: 'center',
    marginVertical: 35,
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 7,
  },
});

export default BadgeDetailView;
