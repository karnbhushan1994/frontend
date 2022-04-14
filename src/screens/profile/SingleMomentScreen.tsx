import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { MomentPost, TabsGradient } from 'components';
import { MainStackParams } from 'routes';

type MomentContextType = {
  keyboardVisible: boolean;
  currentVisibleMomentId: string | undefined;
};

export const MomentContext = React.createContext({
  keyboardVisible: false,
  currentVisibleMomentId: undefined,
} as MomentContextType);

type SingleMomentScreenRouteProp = RouteProp<MainStackParams, 'SingleMomentScreen'>;

type SingleMomentScreenNavigationProp = StackNavigationProp<MainStackParams, 'SingleMomentScreen'>;

interface SingleMomentScreenProps {
  route: SingleMomentScreenRouteProp;
  navigation: SingleMomentScreenNavigationProp;
}

const SingleMomentScreen: React.FC<SingleMomentScreenProps> = ({ route }) => {
  const { moment, screenType } = route.params;
  const currentVisibleMomentId = moment.moment_id;

  return (
    <MomentContext.Provider
      value={{
        keyboardVisible: false,
        currentVisibleMomentId,
      }}>
      <MomentPost moment={moment} screenType={screenType} momentContext={MomentContext} />
      <TabsGradient />
    </MomentContext.Provider>
  );
};

export default SingleMomentScreen;
