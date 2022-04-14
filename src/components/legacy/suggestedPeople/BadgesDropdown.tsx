import React, { useEffect, useState } from 'react';

import UniversityIconClicked from 'components/legacy/suggestedPeople/UniversityIconClicked';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { EasingNode } from 'react-native-reanimated';

import { UniversityBadgeDisplayType, UniversityType } from 'types';
import { normalize } from 'utils';

import { UniversityIcon } from '../..';

interface BadgesDropdownProps {
  university: UniversityType;
  localBadges: UniversityBadgeDisplayType[];
}

const BadgesDropdown: React.FC<BadgesDropdownProps> = ({ university, localBadges }) => {
  // Used to toggle between dropdown being displayed and not
  const [displayBadges, setDisplayBadges] = useState<boolean>(false);

  // Determines the absolute position of the individual badges [0, i * 40]
  let [top, setTop] = useState<Animated.Value<number>[]>([]);

  useEffect(() => {
    // Initialize position of badges to 0
    const defineBadgePositions = () => {
      let localTop: Animated.Value<number>[] = [];
      localBadges.forEach(() => {
        localTop.push(new Animated.Value(0));
      });
      setTop(localTop);
    };
    defineBadgePositions();
  }, []);

  // Displays badges dropdown by updating top [state] for every badge
  const animate = () => {
    for (let i = 0; i < localBadges?.length; i++) {
      if (top) {
        Animated.timing(top[i], {
          toValue: i * 40 + 50,
          duration: 150,
          easing: EasingNode.linear,
        }).start();
      }
    }
  };

  // Draws back displayed badges by setting top [state] to 0 for every badge
  const animateBack = () => {
    for (let i = 0; i < localBadges?.length; i++) {
      if (top) {
        Animated.timing(top[i], {
          toValue: 0,
          duration: 150,
          easing: EasingNode.linear,
        }).start();
      }
    }
  };

  return (
    <Animated.View style={[styles.badgesContainer, { height: 50 + 40 * localBadges.length }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          const updatedBadges = !displayBadges;
          setDisplayBadges(updatedBadges);
          if (updatedBadges) {
            animate();
          } else {
            animateBack();
          }
        }}>
        {displayBadges ? (
          <UniversityIconClicked
            university={university}
            style={styles.universityIconContainer}
            imageStyle={{ width: normalize(31), height: normalize(38) }}
          />
        ) : (
          <UniversityIcon
            university={university}
            style={styles.universityIconContainer}
            imageStyle={{ width: normalize(31), height: normalize(38) }}
          />
        )}
      </TouchableOpacity>
      {localBadges &&
        localBadges.map((badge, index) => (
          <Animated.View
            key={badge.id}
            style={[
              styles.animatedBadgeView,
              {
                top: top[index],
                zIndex: -1 * badge.id,
              },
            ]}>
            {/*<BadgeIcon badge={badge} />*/}
          </Animated.View>
        ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badgesContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 38,
    left: '5%',
    paddingBottom: '2%',
  },
  animatedBadgeView: {
    position: 'absolute',
  },
  universityIconContainer: {
    width: normalize(31),
    height: normalize(38),
  },
});

export default BadgesDropdown;
