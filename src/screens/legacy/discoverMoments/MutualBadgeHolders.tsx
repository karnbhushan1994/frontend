import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Image, Text, View} from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BadgeNamesRecord, TAGG_LIGHT_BLUE} from '../../../constants';
import {MainStackParams} from '../../../routes/main/MainStackNavigator';
import {
  isIPhoneX,
  normalize,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../utils';

type MutualBadgeHoldersRouteProps = RouteProp<
  MainStackParams,
  'MutualBadgeHolders'
>;

type MutualBadgeHoldersNavigationProps = StackNavigationProp<
  MainStackParams,
  'MutualBadgeHolders'
>;

interface MutualBadgeHoldersProps {
  route: MutualBadgeHoldersRouteProps;
  navigation: MutualBadgeHoldersNavigationProps;
}

const MutualBadgeHolders: React.FC<MutualBadgeHoldersProps> = ({
  route,
  navigation,
}) => {
  const {badge} = route.params;

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View style={styles.mainContentContainer}>
          <View style={styles.iconView}>
            <LinearGradient
              colors={['#4E3629', '#EC2027']}
              useAngle={true}
              angle={154.72}
              angleCenter={{x: 0.5, y: 0.5}}
              style={styles.badgeBackground}>
              {/* TODO: Insert image link according to badge_id passed.
               * Awaiting final images from product
               */}
              <Image
                source={badge.image}
                style={{width: SCREEN_WIDTH * 0.1, height: SCREEN_WIDTH * 0.1}}
              />
            </LinearGradient>
          </View>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>{BadgeNamesRecord[badge.name]}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          <View />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: SCREEN_WIDTH,
    height: isIPhoneX() ? SCREEN_HEIGHT * 0.25 : SCREEN_HEIGHT * 0.28,
    position: 'absolute',
    top: SCREEN_HEIGHT / 3,
  },
  mainContentContainer: {
    backgroundColor: '#fff',
    width: SCREEN_WIDTH * 0.88,
    height: SCREEN_HEIGHT * 0.2,
    alignSelf: 'center',
    bottom: '2.5%',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
  },
  badgeBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderColor: 'transparent',
    borderWidth: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_WIDTH * 0.2,
    alignSelf: 'center',
    top: -SCREEN_WIDTH * 0.1,
  },
  headerContainer: {
    top: '-10%',
    width: '100%',
    height: '12%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  heading: {
    fontSize: normalize(20),
    fontWeight: '600',
    lineHeight: normalize(20),
    color: '#4e4e4e',
  },

  closeButton: {
    alignSelf: 'center',
    height: normalize(30),
    width: normalize(100),
    borderRadius: 100,
    backgroundColor: TAGG_LIGHT_BLUE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: normalize(12),
    color: '#fff',
  },
});

export default MutualBadgeHolders;
