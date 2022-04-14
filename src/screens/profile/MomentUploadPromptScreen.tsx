import * as React from 'react';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { StyleSheet, Text, View } from 'react-native';

import { Image } from 'react-native-animatable';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { Moment } from 'components';

import { MainStackParams } from 'routes';
import { normalize } from 'utils';

import { PROFILE_CUTOUT_BOTTOM_Y } from '../../constants';
import { UPLOAD_MOMENT_PROMPT_ONE_MESSAGE } from '../../constants/strings';

type MomentUploadPromptScreenRouteProp = RouteProp<MainStackParams, 'MomentUploadPrompt'>;
type MomentUploadPromptScreenNavigationProp = StackNavigationProp<
  MainStackParams,
  'MomentUploadPrompt'
>;

interface MomentUploadPromptScreenProps {
  route: MomentUploadPromptScreenRouteProp;
  navigation: MomentUploadPromptScreenNavigationProp;
}

const MomentUploadPromptScreen: React.FC<MomentUploadPromptScreenProps> = ({
  route,
  navigation,
}) => {
  const { screenType, momentCategory, profileBodyHeight, socialsBarHeight } = route.params;
  return (
    <View style={styles.container}>
      <SvgXml
        xml={icons.CloseOutline}
        color={'white'}
        style={styles.closeButton}
        width={13}
        height={13}
        onPress={() => {
          navigation.goBack();
        }}
      />

      <Text style={styles.text}>{UPLOAD_MOMENT_PROMPT_ONE_MESSAGE}</Text>
      <Image
        source={require('assets/gifs/dotted-arrow-white.gif')}
        style={[
          StyleSheet.absoluteFill,
          styles.arrowGif,
          { top: profileBodyHeight + PROFILE_CUTOUT_BOTTOM_Y },
        ]}
      />
      <Moment
        key={1}
        title={momentCategory}
        images={[]}
        userXId={undefined}
        screenType={screenType}
        handleMomentCategoryDelete={() => {}}
        shouldAllowDeletion={false}
        showDownButton={false}
        showUpButton={false}
        externalStyles={{
          container: {
            ...styles.momentContainer,
            top: PROFILE_CUTOUT_BOTTOM_Y + profileBodyHeight + socialsBarHeight,
          },
          titleText: styles.momentHeaderText,
          header: styles.momentHeader,
          scrollContainer: styles.momentScrollContainer,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  closeButton: {
    ...StyleSheet.absoluteFillObject,
    top: 45,
    left: 20,
    width: 40,
    height: 40,
  },
  text: {
    marginTop: 250,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: normalize(20),
    textAlign: 'center',
  },
  arrowGif: {
    width: 200,
    height: 150,
    left: 120,
    transform: [{ rotate: '350deg' }, { rotateY: '180deg' }],
  },

  //Styles to adjust moment container
  momentScrollContainer: {
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  momentContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    height: 175,
  },
  momentHeaderText: {
    ...StyleSheet.absoluteFillObject,
    marginLeft: 12,
    paddingVertical: 5,
  },
  momentHeader: {
    marginTop: 7,
    backgroundColor: 'transparent',
  },
});

export default MomentUploadPromptScreen;
