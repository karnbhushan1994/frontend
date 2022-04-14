import React, { useState } from 'react';

import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import { updateMomentCategories } from 'store/actions';
import { RootState } from 'store/rootReducer';

import { Background, TaggInput, TaggLoadingIndicator } from '../../components';
import Button from '../../components/button';
import {
  CREATE,
  KEYBOARD_VERTICLEHEIGHT,
  RETURNKEY,
  SELECTIONCOLOR,
  NAME_A_PAGE,
  TAGG_LIGHT_BLUE,
  WHITE,
} from '../../constants';
import { MainStackParams } from '../../routes';
import { BackgroundGradientType } from '../../types';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils';
import { Behavior } from '../../utils/helper';

type PageNameNavigationProps = StackNavigationProp<MainStackParams, 'PageNameScreen'>;

interface PageNameProps {
  navigation: PageNameNavigationProps;
}

const PageName: React.FC<PageNameProps> = (): React.ReactElement => {
  const [attemptedSubmit] = useState<boolean>(false);
  const { momentCategories = [] } = useSelector((state: RootState) => state.momentCategories);
  const dispatch = useDispatch();

  const [value, setValue] = useState<string>('');
  const [loading] = useState<boolean>(false);

  const nextNavigate = async () => {
    dispatch(updateMomentCategories([...momentCategories, value]));
  };

  return (
    <Background style={styles.container} gradientType={BackgroundGradientType.Dark}>
      {loading && <TaggLoadingIndicator fullscreen />}
      <KeyboardAvoidingView
        behavior={Behavior(Platform.OS)}
        keyboardVerticalOffset={-(SCREEN_HEIGHT * KEYBOARD_VERTICLEHEIGHT)}
        style={styles.container}>
        <View style={styles.textView}>
          <Text style={styles.formHeader}>{NAME_A_PAGE}</Text>
        </View>

        <View style={styles.formContainer}>
          <TaggInput
            returnKeyType={RETURNKEY}
            selectionColor={SELECTIONCOLOR}
            onChangeText={setValue}
            onSubmitEditing={nextNavigate}
            value={value}
            style={styles.input}
            autoFocus={true}
            blurOnSubmit={false}
            attemptedSubmit={attemptedSubmit}
          />
        </View>
        <Button
          labelStyle={styles.labelStyle}
          onPress={nextNavigate}
          style={styles.buttonConainer}
          title={CREATE}
          buttonStyle={styles.nextButtonStyle}
        />
      </KeyboardAvoidingView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textView: {
    flex: 0.15,
    paddingTop: 10,
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  formHeader: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '700',
  },
  nextButtonStyle: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  formContainer: {
    alignItems: 'center',
  },
  labelStyle: { color: TAGG_LIGHT_BLUE },
  buttonConainer: { width: 150, height: 40, borderRadius: 5, marginTop: 10 },
  input: {
    minWidth: '100%',
    height: 40,
    fontSize: 36,
    fontWeight: '600',
    color: WHITE,
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default PageName;
