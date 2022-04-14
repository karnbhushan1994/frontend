import React, { useState } from 'react';

import { Pressable, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { images } from 'assets/images';

export const DropDown = ({ genderOption = [], value = {}, onSelect = () => {} }) => {
  const [showOpion, setshowOpion] = useState(false);
  const [showOpionsel, setshowOpionsel] = useState('');
  const onSelectedItem = val => {
    setshowOpion(false);
    setshowOpionsel(val.gender);
    onSelect(val);
  };
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          setshowOpion(!showOpion);
        }}>
        <View style={styles.mainBtnContainer}>
          <View style={styles.marginBottom5}>
            <Text style={styles.gendersel}>{showOpionsel ? showOpionsel : 'Gender'}</Text>
          </View>
          <View style={styles.marginBottom5}>
            {showOpion ? (
              <Image source={images.main.uparrow} style={styles.arrowImage} />
            ) : (
              <Image source={images.main.downarrow} style={styles.arrowImage} />
            )}
          </View>
        </View>
      </Pressable>
      <View>
        {showOpion && (
          <View style={styles.backgroundDropdown}>
            {genderOption.map((val, i) => (
              <TouchableOpacity
                onPress={() => onSelectedItem(val)}
                key={String(i)}
                style={[
                  styles.itemContainer,
                  // eslint-disable-next-line react-native/no-inline-styles
                  { backgroundColor: value.id == val.id ? '#698DD3' : '' },
                ]}>
                <Text
                  style={[
                    styles.itemset,
                    // eslint-disable-next-line react-native/no-inline-styles
                    { color: value.id == val.id ? 'white' : 'black' },
                  ]}>
                  {val.gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '20%',
    justifyContent: 'flex-start',
  },
  arrowImage: {
    height: 20,
    width: 20,
  },
  mainBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  gendersel: {
    color: 'white',
  },
  backgroundDropdown: {
    backgroundColor: 'white',
    marginTop: 10,
    borderRadius: 10,
  },
  itemset: {
    padding: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  itemContainer: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  marginBottom5: {
    marginBottom: 5,
  },
});
