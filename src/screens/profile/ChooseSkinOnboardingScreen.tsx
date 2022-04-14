import { ERROR_SOMETHING_WENT_WRONG, SKINS_LIST, TAGG_LIGHT_BLUE_2 } from 'constants';

import React, { Fragment, useContext, useState } from 'react';

import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useDispatch } from 'react-redux';

import { Background, TaggSquareButton } from 'components';

import { OnboardingContext, OnboardingStackParams } from 'routes';
import { createProfileSkinService, sendUserInterests } from 'services';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType, TemplateEnumType } from 'types';
import { normalize, SCREEN_HEIGHT, SCREEN_WIDTH, track, userLogin } from 'utils';
import { hapticFeedback } from 'utils/hapticFeedback';

type ChooseSkinOnboardingScreenNavigationProps = StackNavigationProp<
  OnboardingStackParams,
  'ChooseSkinOnboardingScreen'
>;
type ChooseSkinOnboardingScreenRouteProps = RouteProp<
  OnboardingStackParams,
  'ChooseSkinOnboardingScreen'
>;

interface ChooseSkinOnboardingScreenProps {
  route: ChooseSkinOnboardingScreenRouteProps;
  navigation: ChooseSkinOnboardingScreenNavigationProps;
}

const ChooseSkinOnboardingScreen: React.FC<ChooseSkinOnboardingScreenProps> = ({ route }) => {
  const pageNumberTemplateTypeMap: Record<number, TemplateEnumType> = {
    0: TemplateEnumType.One,
    1: TemplateEnumType.Two,
    2: TemplateEnumType.Three,
    3: TemplateEnumType.Four,
    4: TemplateEnumType.Five,
  };

  const [currentPage, setCurrentPage] = useState(0);

  const { userId, username, token } = useContext(OnboardingContext);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setData(SKINS_LIST);
  }, []);
  const renderItem: (item: any) => Object = ({ item }) => {
    if (item === null) {
      return <Fragment />;
    } else {
      return (
        <>
          <TouchableOpacity activeOpacity={1} style={styles.imageContainer}>
            <Image source={item.demoPicture} style={styles.image} />
          </TouchableOpacity>
          <Text style={styles.newText}>{item.displayName}</Text>
        </>
      );
    }
  };

  const handleNavigate = async () => {
    if (userId && username && token) {
      await sendUserInterests(route.params.interests, token);

      const requestBody: Object = {
        template_type: pageNumberTemplateTypeMap[currentPage],
        primary_color: data[currentPage].primaryColor,
        secondary_color: data[currentPage].secondaryColor,
        active: true,
      };
      await createProfileSkinService(token, requestBody);

      track('Login', AnalyticVerb.Finished, AnalyticCategory.Login, {
        user: {
          userId,
          username,
        },
      });

      userLogin(dispatch, { userId, username }, token);
    } else {
      Alert.alert(ERROR_SOMETHING_WENT_WRONG);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Background gradientType={BackgroundGradientType.Dark}>
        <View style={styles.container}>
          <Text style={styles.title}>Choose a Skin</Text>
          <Text style={styles.subtitle}>Don't worry, you can always pick another one!</Text>
          <Carousel
            data={data}
            layout="default"
            renderItem={renderItem}
            sliderWidth={SCREEN_WIDTH}
            itemWidth={SCREEN_WIDTH - 200}
            onSnapToItem={i => {
              setCurrentPage(i);
              hapticFeedback('impactLight');
            }}
          />
          <Pagination
            activeDotIndex={currentPage}
            dotsLength={data.length}
            dotColor={TAGG_LIGHT_BLUE_2}
            inactiveDotColor={'#e0e0e0'}
          />
          <TaggSquareButton
            onPress={handleNavigate}
            title={'Choose'}
            buttonStyle={'normal'}
            buttonColor={'purple'}
            labelColor={'white'}
          />
        </View>
      </Background>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: SCREEN_HEIGHT * 0.6,
  },
  title: {
    color: '#fff',
    fontSize: normalize(25),
    fontWeight: '700',
    marginTop: 10,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginVertical: 15,
    fontWeight: '600',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  newText: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default ChooseSkinOnboardingScreen;
