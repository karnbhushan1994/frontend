import React, { FC, useContext, useState } from 'react';

import { Image, ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { ProfileContext } from 'screens/profile/ProfileScreen';
import { gradientColorFormation } from 'utils';

import { HOMEPAGE } from '../../constants/constants';

import WidgetsPlayground from '../profile/WidgetsPlayground';
import TemplateOneHeader from './TemplateOneHeader';

const TemplateOneFoundation: FC = ({}) => {
  const { primaryColor, draggingWidgets, setActiveTab } = useContext(ProfileContext);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <LinearGradient
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 0, y: 1.0 }}
      locations={[0, 0.5, 0.6]}
      colors={gradientColorFormation(primaryColor)}
      style={styles.container}>
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
        <TemplateOneHeader setActiveTab={setActiveTab} />
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
    // height: Dimensions.get('screen').height,
  },
  scrollView: {
    flex: 1,
  },
  image: { height: 50, width: 120, justifyContent: 'center' },
  loadingImg: { backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
});

export default TemplateOneFoundation;
