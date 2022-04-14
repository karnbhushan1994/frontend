import React, { useContext } from 'react';

import { useNavigation, useNavigationState, useRoute } from '@react-navigation/core';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { ScrollView, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { ProfileContext } from 'screens/profile/ProfileScreen';
import { gradientColorFormation, normalize, track } from 'utils';

import { AnalyticCategory, AnalyticVerb } from '../../types';
import { OutlineButton } from '../buttons';

interface PagesBarProps extends ViewProps {
  state: TabNavigationState<ParamListBase>;
  navigation: any;
  setActiveTab: any;
  pageStyle: StyleProp<ViewStyle>;
}

const PagesBar: React.FC<PagesBarProps> = ({ setActiveTab, pageStyle }) => {
  const { primaryColor, ownProfile, userXId } = useContext(ProfileContext);
  const navigator = useNavigation();
  const route = useRoute();
  const state = useNavigationState(state => state);

  return (
    <View style={[styles.pageBar, pageStyle]}>
      <ScrollView
        style={styles.scroller}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          if (isFocused) {
            setActiveTab(route.name);
          }
          return (
            <OutlineButton
              key={index}
              title={route.name}
              selected={isFocused}
              onPress={() => {
                track('ProfilePage', AnalyticVerb.Pressed, AnalyticCategory.Profile, {
                  name: route.name,
                  ownProfile,
                  userXId,
                });
                setActiveTab(route.name);
                navigator.navigate(route.name);
              }}
            />
          );
        })}
        {ownProfile && (
          <OutlineButton
            icon={
              <SvgXml
                xml={icons.PlusIconWhite}
                color={gradientColorFormation(primaryColor)[0]}
                width={18}
                height={18}
              />
            }
            selected={true}
            onPress={() => {
              track('AddPage', AnalyticVerb.Pressed, AnalyticCategory.AddAPage);
              navigator.navigate('CreateCustomCategory', {
                fromScreen: route.name,
              });
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pageBar: {
    height: normalize(38),
    flexDirection: 'row',
    paddingBottom: 10,
  },
  scroller: {
    paddingHorizontal: 10,
  },
});

export default PagesBar;
