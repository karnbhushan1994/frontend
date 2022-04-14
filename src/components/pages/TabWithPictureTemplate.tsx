import React from 'react';

import { View, StyleSheet, ScrollView, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import GradientText from 'components/GradientText';

import { RootState } from 'store/rootReducer';
import { gradientColorFormation } from 'utils';

type TabWithPictureTemplateProps = {
  primaryColor: string;
  secondaryColor: string;
};

const sample_tab_titles = ['Home', 'Moments', 'Video', 'Food'];

const TabWithPictureTemplate: React.FC<TabWithPictureTemplateProps> = ({
  primaryColor,
  secondaryColor,
}) => {
  const {
    skin: { template_type: templateChoice },
  } = useSelector((state: RootState) => state.user.profileTemplate);
  const cover = useSelector((state: RootState) => state.user.cover);
  return (
    <>
      {templateChoice === 'THREE' && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: cover }} style={styles.image} />
        </View>
      )}
      <ScrollView style={[styles.main]} horizontal={true} showsHorizontalScrollIndicator={false}>
        {sample_tab_titles.map((text, index) =>
          index === 0 ? (
            <LinearGradient
              colors={gradientColorFormation(secondaryColor)}
              key={index}
              style={[styles.selectedTab, { borderColor: secondaryColor }]}>
              <GradientText colors={gradientColorFormation(primaryColor)} style={[styles.tabText]}>
                {text}
              </GradientText>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={gradientColorFormation(primaryColor)}
              key={index}
              style={[styles.tab, { borderColor: secondaryColor }]}>
              <GradientText
                colors={gradientColorFormation(secondaryColor)}
                style={[styles.tabText]}>
                {text}
              </GradientText>
            </LinearGradient>
          ),
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    // paddingHorizontal: 10,
    // marginHorizontal: 10,
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'transparent',
    marginHorizontal: 5,
    alignItems: 'center',
    width: 95,
    borderWidth: 3,
  },
  selectedTab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#961100',
    marginHorizontal: 5,
    alignItems: 'center',
    width: 95,
    borderWidth: 3,
  },
  tabText: {
    color: 'transparent',
    fontWeight: '700',
  },
  imageContainer: {
    width: '100%',
    height: 350,
    padding: 20,
    paddingHorizontal: 50,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
});

export default TabWithPictureTemplate;
