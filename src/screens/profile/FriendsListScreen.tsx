import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import { Friends, TabsGradient } from 'components';
import { MainStackParams } from 'routes';
import { RootState } from 'store/rootReducer';
import { HeaderHeight, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

type FriendsListScreenRouteProp = RouteProp<MainStackParams, 'FriendsListScreen'>;
interface FriendsListScreenProps {
  route: FriendsListScreenRouteProp;
}

const FriendsListScreen: React.FC<FriendsListScreenProps> = ({ route }) => {
  const { userXId, screenType } = route.params;

  const { friends } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.friends,
  );

  return (
    <>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body}>
          <Friends result={friends} screenType={screenType} userId={userXId} />
        </ScrollView>
      </SafeAreaView>
      <TabsGradient />
    </>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 10,
  },
  body: {
    marginTop: HeaderHeight,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - HeaderHeight,
  },
});

export default FriendsListScreen;
