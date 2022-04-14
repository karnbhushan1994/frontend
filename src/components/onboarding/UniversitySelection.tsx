import React from 'react';

import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { images } from 'assets/images';
import { UniversityType } from 'types';
import { normalize } from 'utils';

interface UniversitySelectionProps {
  selected: UniversityType;
  setSelected: (selected: UniversityType) => void;
}

const UniversitySelection: React.FC<UniversitySelectionProps> = ({ selected, setSelected }) => {
  const crestData = [
    {
      imagePath: images.universities.brown,
      title: 'Brown',
      key: UniversityType.Brown,
    },
    {
      imagePath: images.universities.cornell,
      title: 'Cornell',
      key: UniversityType.Cornell,
    },
    // {
    //   imagePath: require('assets/universities/harvard.png'),
    //   title: 'Harvard',
    //   key: UniversityType.Harvard,
    // },
  ];
  const renderButton = (imagePath: ImageSourcePropType, title: string, key: UniversityType) => (
    <TouchableOpacity
      style={selected === key ? styles.crestContainerSelected : styles.crestContainer}
      onPress={() => setSelected(key)}>
      <Image source={imagePath} style={styles.crest} />
      <Text style={styles.crestLabel}>{title}</Text>
    </TouchableOpacity>
  );
  return (
    <>
      <Text style={styles.title}>University Badge</Text>
      <View style={styles.container}>
        {crestData.map(data => renderButton(data.imagePath, data.title, data.key))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: normalize(15),
    lineHeight: normalize(18),
    fontWeight: '700',
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  crest: {
    height: normalize(25),
    aspectRatio: 31 / 38,
    marginBottom: 5,
  },
  crestContainer: {
    alignItems: 'center',
    padding: 10,
  },
  crestContainerSelected: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 5,
    padding: 8,
    backgroundColor: '#fff2',
  },
  crestLabel: {
    color: 'white',
    fontSize: normalize(15),
    lineHeight: normalize(18),
    fontWeight: '500',
  },
});

export default UniversitySelection;
