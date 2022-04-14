import { HOMEPAGE } from 'constants';

import React, { Fragment, useEffect, useState } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useSelector } from 'react-redux';

import { NavigationIcon } from 'components';
import { RootState } from 'store/rootReducer';
import { ScreenType, TabBarProps } from 'types';
import { isIPhoneX } from 'utils';

import MainStackScreen from '../main/MainStackScreen';

const Tabs = createBottomTabNavigator();

const NavigationBar: React.FC<TabBarProps> = ({ count, activeScreen }) => {
  const [isTabBar, setIsTabBar] = useState<boolean>();
  const { momentCategories = [] } = useSelector((state: RootState) => state.momentCategories);
  useEffect(() => {
    if (activeScreen) {
      setIsTabBar(
        ['DiscoverMoments', '__TaggUserHomePage__', 'ProfileTab', ...momentCategories].includes(
          activeScreen,
        ),
      );
    }
  }, [activeScreen]);
  return (
    <>
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            if (isTabBar) {
              switch (route.name) {
                case 'Home':
                  return <NavigationIcon tab="Home" disabled={!focused} />;
                case 'Upload':
                  return <NavigationIcon tab="Upload" disabled={!focused} isBigger={true} />;
                case 'ProfileTab':
                  return <NavigationIcon tab="Profile" disabled={!focused} />;
                case 'DiscoverMoments':
                  return <NavigationIcon tab="DiscoverMoments" disabled={!focused} />;
                default:
                  return <Fragment />;
              }
            } else {
              return null;
            }
          },
          tabBarVisible: isTabBar,
        })}
        initialRouteName={'ProfileTab'}
        tabBarOptions={{
          showLabel: false,
          style: {
            backgroundColor: 'transparent',
            position: 'absolute',
            borderTopWidth: 0,
            height: isIPhoneX() ? 85 : 60,
            zIndex: isTabBar ? 1 : -1,
          },
          tabStyle: {
            display: isTabBar ? 'flex' : 'none',
          },
        }}>
        <Tabs.Screen
          name="DiscoverMoments"
          component={MainStackScreen}
          initialParams={{ screenType: ScreenType.DiscoverMoments }}
          options={{
            tabBarBadge: count && isTabBar ? '' : undefined,
            tabBarBadgeStyle: {
              backgroundColor: '#8F01FF',
              marginLeft: -2,
              marginTop: 5,
              height: 16,
              minWidth: 16,
              lineHeight: 15,
            },
          }}
        />
        <Tabs.Screen
          name="Upload"
          component={MainStackScreen}
          initialParams={{ screenType: ScreenType.Upload }}
        />
        <Tabs.Screen
          name="ProfileTab"
          component={MainStackScreen}
          initialParams={{ screenType: ScreenType.Profile }}
          listeners={({ navigation }) => ({
            tabPress: () => {
              navigation.navigate(HOMEPAGE);
            },
          })}
        />
      </Tabs.Navigator>
    </>
  );
};

export default NavigationBar;
