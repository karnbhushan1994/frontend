import React from 'react';

import { StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import GradientText from 'components/GradientText';
import { gradientColorFormation } from 'utils';

type TabColorTemplateProps = {
  primaryColor: string;
  secondaryColor: string;
  bioTextColor: string;
};

const sample_tab_titles = ['Home', 'Moments', 'Video', 'Food'];

const TabColorTemplate: React.FC<TabColorTemplateProps> = ({
  primaryColor,
  secondaryColor,
  bioTextColor,
}) => {
  const colorData = gradientColorFormation(primaryColor);
  const tabColorData = gradientColorFormation(secondaryColor);
  return (
    <LinearGradient colors={colorData} style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {sample_tab_titles.map((text, index) =>
          index === 0 ? (
            <LinearGradient
              key={index}
              colors={tabColorData}
              style={[styles.selectedTab, { borderColor: secondaryColor }]}>
              <GradientText colors={colorData} style={[styles.tabText, { color: bioTextColor }]}>
                {text}
              </GradientText>
            </LinearGradient>
          ) : (
            <LinearGradient colors={tabColorData} key={index} style={[styles.tab]}>
              <LinearGradient colors={colorData} style={styles.innerContainer}>
                <GradientText
                  colors={tabColorData}
                  style={[styles.tabText, { color: bioTextColor }]}>
                  {text}
                </GradientText>
              </LinearGradient>
            </LinearGradient>
          ),
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: '#FFBBCA',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tab: {
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: 'transparent',
    marginHorizontal: 5,
    alignItems: 'center',
    width: 100,
  },
  selectedTab: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#961100',
    marginHorizontal: 5,
    alignItems: 'center',
    width: 100,
  },
  innerContainer: {
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
    width: 95,
    justifyContent: 'center',
  },
  tabText: {
    color: 'transparent',
    fontWeight: '700',
  },
});

export default TabColorTemplate;
