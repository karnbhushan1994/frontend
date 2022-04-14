import React, { FC, useContext, useState } from 'react';

import { Image, ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { ProfileContext } from 'screens/profile/ProfileScreen';
import { gradientColorFormation } from 'utils';

import { HOMEPAGE } from '../../constants';

import WidgetsPlayground from '../profile/WidgetsPlayground';
import TemplateTwoHeader from './TemplateTwoHeader';

const TemplateTwoFoundation: FC = ({ setActiveTab }) => {
  const { primaryColor, draggingWidgets } = useContext(ProfileContext);
  const [refreshing, setRefreshing] = useState(false);
  return (
    <LinearGradient colors={gradientColorFormation(primaryColor)} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[styles.scrollView]}
        scrollEnabled={!draggingWidgets}
        refreshControl={
          <RefreshControl
            tintColor="transparent"
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                setRefreshing(false);
              }, 3000);
            }}
          />
        }>
        {refreshing && (
          <View style={styles.loadingImg}>
            <Image source={require('assets/gifs/loading-animation.gif')} style={styles.image} />
          </View>
        )}
        <TemplateTwoHeader setActiveTab={setActiveTab} />
        <WidgetsPlayground refreshing={refreshing} title={HOMEPAGE} numColumns={2} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    //  height: Dimensions.get('screen').height
  },
  scrollView: {
    flex: 1,
  },
  image: { height: 50, width: 120, justifyContent: 'center' },
  loadingImg: { backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
});

export default TemplateTwoFoundation;
