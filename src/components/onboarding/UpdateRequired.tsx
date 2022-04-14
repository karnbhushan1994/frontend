import React from 'react';

import { Image, Linking, Modal, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-animatable';

import { images } from 'assets/images';
import { CenteredView, TaggSquareButton } from 'components';
import { normalize, SCREEN_WIDTH } from 'utils';

interface UpdateRequiredProps {
  visible: boolean;
}

const UpdateRequired: React.FC<UpdateRequiredProps> = ({ visible }) => (
  <Modal animationType={'slide'} transparent={true} visible={visible}>
    <CenteredView>
      <View style={styles.contentContainer}>
        <Image style={styles.logo} source={images.main.logo_green} />
        <Text style={styles.header}>Update Required</Text>
        <Text style={styles.body}>
          You have to update your app to continue using Tagg, please download the latest version
          from the app store
        </Text>
        <TaggSquareButton
          title={'Update'}
          onPress={() => {
            Linking.openURL(
              'https://apps.apple.com/us/app/tagg-discover-your-community/id1537853613',
            );
          }}
          buttonStyle={'normal'}
          buttonColor={'purple'}
          labelColor={'white'}
          labelStyle={styles.button}
        />
      </View>
    </CenteredView>
  </Modal>
);

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: '20%',
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: '10%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: normalize(60),
    height: normalize(60),
    marginBottom: '10%',
  },
  header: {
    fontSize: normalize(17),
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: '5%',
  },
  body: {
    fontSize: normalize(13),
    color: 'grey',
    lineHeight: 20,
    textAlign: 'center',
    width: SCREEN_WIDTH * 0.8,
    marginBottom: '10%',
  },
  button: {
    fontWeight: '700',
  },
});

export default UpdateRequired;
