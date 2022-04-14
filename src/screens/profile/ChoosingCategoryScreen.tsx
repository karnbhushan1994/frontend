import React, { FC, useEffect, useState } from 'react';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { SearchBackground, TaggSquareButton } from 'components';

import { headerBarOptions, MainStackParams } from 'routes';
import { updateMomentCategories } from 'store/actions';
import { RootState } from 'store/rootReducer';
import {
  getMomentCategoryIconInfo,
  HeaderHeight,
  normalize,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  StatusBarHeight,
} from 'utils';

import { HOMEPAGE, TAGGS_GRADIENT, TAGG_DARK_PURPLEISH_BLUE } from '../../constants';

type ChoosingCategoryScreenRouteProps = RouteProp<MainStackParams, 'ChoosingCategoryScreen'>;

interface ChoosingCategoryScreenProps {
  route: ChoosingCategoryScreenRouteProps;
}

const ChoosingCategoryScreen: React.FC<ChoosingCategoryScreenProps> = ({ route }) => {
  const { momentCategories } = useSelector((state: RootState) => state.momentCategories);
  const newCustomCategory = route.params.newCustomCategory;
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(newCustomCategory);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    navigation.setOptions({
      ...headerBarOptions('white', 'Choose Page'),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CaptionScreen', {
              selectedCategory: selectedCategory,
            });
          }}>
          <SvgXml
            xml={icons.BackArrow}
            height={normalize(18)}
            width={normalize(18)}
            color={'white'}
            style={styles.backButton}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedCategory]);

  useEffect(() => {
    if (newCustomCategory) {
      const isPresent = momentCategories.findIndex(item => newCustomCategory === item);
      if (isPresent === -1) {
        dispatch(updateMomentCategories(momentCategories.concat([newCustomCategory])));
      }
      setSelectedCategory(newCustomCategory);
    }
  }, [route.params]);

  const ListItem: FC<{
    title: string;
    onPress: () => void;
  }> = ({ title, onPress }) => {
    const icon = getMomentCategoryIconInfo(title).icon;
    return (
      <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
        <View style={styles.row}>
          <LinearGradient
            style={styles.gradientIcon}
            colors={[TAGGS_GRADIENT.start, TAGGS_GRADIENT.end]}
            useAngle={true}
            angle={-45}>
            <View style={styles.iconBackground}>
              <Image style={styles.icon} source={icon} />
            </View>
          </LinearGradient>
          <Text style={styles.itemTitle}>{title}</Text>
        </View>
        <View style={styles.row}>
          {selectedCategory === title ? (
            <SvgXml xml={icons.RadioCheckGreen} width={20} height={20} />
          ) : (
            <View style={styles.radioPlaceholder} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SearchBackground>
      <View style={{ marginTop: StatusBarHeight + HeaderHeight }}>
        <ScrollView
          style={{ height: SCREEN_HEIGHT * 0.9 }}
          contentContainerStyle={{ paddingBottom: tabBarHeight }}>
          {momentCategories.map(title =>
            title === HOMEPAGE ? null : (
              <ListItem
                key={title}
                title={title}
                onPress={() =>
                  selectedCategory === title ? setSelectedCategory('') : setSelectedCategory(title)
                }
              />
            ),
          )}
          {selectedCategory ? null : (
            <TaggSquareButton
              onPress={() =>
                navigation.navigate('CreateCustomCategory', {
                  existingCategories: momentCategories,
                  fromScreen: route.name,
                })
              }
              title={'Create a new page'}
              buttonStyle={'large'}
              buttonColor={'blue'}
              labelColor={'white'}
              style={styles.button}
              labelStyle={styles.buttonText}
              icon={<SvgXml xml={icons.PlusIcon} style={styles.plusIcon} />}
            />
          )}
        </ScrollView>
      </View>
    </SearchBackground>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 30,
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 0 },
  },
  container: {
    marginTop: StatusBarHeight,
  },
  itemContainer: {
    marginHorizontal: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: normalize(20),
    borderRadius: 4,
  },
  gradientIcon: {
    width: normalize(40),
    height: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  iconBackground: {
    height: '85%',
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: TAGG_DARK_PURPLEISH_BLUE,
  },
  icon: {
    height: normalize(25),
    width: normalize(25),
  },
  itemTitle: {
    color: 'white',
    fontSize: normalize(14),
    lineHeight: normalize(16.71),
    letterSpacing: normalize(0.3),
    fontWeight: '600',
    alignSelf: 'center',
    marginHorizontal: SCREEN_WIDTH * 0.03,
    width: SCREEN_WIDTH * 0.7,
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    width: SCREEN_WIDTH * 0.9,
    height: normalize(67),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: normalize(15),
    lineHeight: 18,
  },
  plusIcon: {
    color: 'white',
    marginRight: normalize(25),
    width: 30,
    height: 30,
  },
  radioPlaceholder: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    height: normalize(19),
    width: normalize(19),
  },
});

export default ChoosingCategoryScreen;
