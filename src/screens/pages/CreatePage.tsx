import { CREATE_PAGE, PAGE_TYPES } from 'constants';

import React from 'react';

import { RouteProp, useNavigation } from '@react-navigation/core';

import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { icons } from 'assets/icons';
import { Background } from 'components';
import { MainStackParams } from 'routes';

import { BackgroundGradientType } from 'types';

type CreatePageScreenRouteProps = RouteProp<MainStackParams, 'SelectedSkin'>;

interface CreatePageScreenProps {
  route: CreatePageScreenRouteProps;
}

const CreatePageScreen: React.FC<CreatePageScreenProps> = () => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Background gradientType={BackgroundGradientType.Dark}>
        <ScrollView style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{CREATE_PAGE}</Text>
          </View>
          <TouchableOpacity
            style={[styles.topGrid]}
            onPress={() => navigation.navigate('PageNameScreen')}>
            <View style={styles.customPageButton}>
              <Image source={icons.PlusWhiteIcon} style={[styles.plusIcon]} />
              <Text style={[styles.topSubtitle]}>Create your own page</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.gridContainer}>
            {PAGE_TYPES.map((pageType: any, index: number) => (
              <TouchableOpacity style={styles.grid} key={index}>
                <View style={[styles.insideGrid, { backgroundColor: pageType.color }]}>
                  <Image source={pageType.icon} style={styles.icon} />
                  <Text style={styles.subtitle}>{pageType.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Background>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 60,
    height: '85%',
  },
  title: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '700',
  },
  titleContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  customPageButton: {
    backgroundColor: '#53329B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 10,
  },
  subtitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 10,
  },
  topSubtitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 15,
    marginTop: 0,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  grid: {
    width: '33%',
    padding: 10,
  },
  topGrid: {
    width: undefined,
    padding: 10,
  },
  insideGrid: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingVertical: 20,
    borderRadius: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  plusIcon: {
    width: 20,
    height: 20,
  },
});

export default CreatePageScreen;
