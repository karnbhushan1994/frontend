import {RouteProp} from '@react-navigation/core';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {BACKGROUND_GRADIENT_MAP} from '../../../constants';
import {BADGE_DATA} from '../../../constants/legacy/badges';
import {
  ERROR_BADGES_EXCEED_LIMIT,
} from '../../../constants/strings';
import {MainStackParams} from '../../../routes';
import {RootState} from '../../../store/rootReducer';
import {BackgroundGradientType} from '../../../types';
import {SCREEN_HEIGHT, StatusBarHeight} from '../../../utils';
import BadgeList from './BadgeList';
import BadgeScreenHeader from './BadgeScreenHeader';

/**
 * Home Screen for displaying Tagg Badge Selections
 **/

type BadgeSelectionRouteProp = RouteProp<MainStackParams, 'BadgeSelection'>;

type BadgeSelectionProps = {
  route: BadgeSelectionRouteProp;
};

const BadgeSelection: React.FC<BadgeSelectionProps> = ({route}) => {
  const {editing} = route.params;
  const {
    user: {userId: loggedInUserId},
    profile: {badges},
  } = useSelector((state: RootState) => state.user);
  const [selectedBadges, setSelectedBadges] = useState<BadgeOptions[]>([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Extracting badges data into a string []
  useEffect(() => {
    const loadData = async () => {
      let extractedBadgeNames: BadgeOptions[] = [];
      badges.forEach((badge) => {
        extractedBadgeNames.push(badge.name);
      });
      setSelectedBadges(extractedBadgeNames);
    };
    if (editing) {
      loadData();
    }
  }, []);

  // Retrieve updated badges using get badges service and udpate the store
  const loadUserBadges = async () => {
    const newBadges = await getBadgesService(loggedInUserId);
    dispatch(updateUserBadges(newBadges));
  };

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        style={styles.rightButtonContainer}
        onPress={async () => {
          if (editing) {
            const success = await updateBadgesService(selectedBadges);
            if (success === true) {
              // Load updated badges to store
              loadUserBadges();
              Alert.alert(SUCCESS_BADGES_UPDATE);
            }
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('UpdateSPPicture', {
                editing: true,
              });
            }
          } else {
            if (selectedBadges.length !== 0) {
              const success = await addBadgesService(selectedBadges);
              if (success) {
                loadUserBadges();
                navigation.navigate('DiscoverMoments');
              }
            } else {
              navigation.navigate('DiscoverMoments');
            }
          }
        }}>
        <Text style={styles.rightButton}>
          {selectedBadges.length !== 0 || editing ? 'Done' : 'Skip'}
        </Text>
      </TouchableOpacity>
    ),
  });

  const selectKey = (key: BadgeOptions) => {
    if (selectedBadges.includes(key)) {
      const selectedBadgesArray = [...selectedBadges];
      const itemIndex = selectedBadgesArray.indexOf(key);
      if (itemIndex > -1) {
        selectedBadgesArray.splice(itemIndex, 1);
      }
      setSelectedBadges(selectedBadgesArray);
    } else {
      if (selectedBadges.length < BADGE_LIMIT) {
        const selectedBadgesArray = [...selectedBadges, key];
        setSelectedBadges(selectedBadgesArray);
      } else {
        Alert.alert(ERROR_BADGES_EXCEED_LIMIT);
      }
    }
  };

  return (
    <LinearGradient
      colors={BACKGROUND_GRADIENT_MAP[BackgroundGradientType.Dark]}
      style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <SafeAreaView>
        <View style={styles.listContainer}>
          <BadgeScreenHeader />
          {/* filter not working, comment out for now */}
          {/* <SearchBar
            style={styles.searchBarStyle}
            onCancel={() => {}}
            top={Animated.useValue(0)}
          /> */}
          <BadgeList
            data={BADGE_DATA}
            selectedBadges={selectedBadges}
            selectKey={selectKey}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarStyle: {
    width: '95%',
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.05,
  },
  viewContainer: {marginTop: StatusBarHeight},
  listContainer: {marginTop: SCREEN_HEIGHT * 0.05},
  rightButtonContainer: {marginRight: 24},
  rightButton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 18,
  },
  leftButtonContainer: {marginLeft: 24},
  leftButton: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 18,
  },
});

export default BadgeSelection;
