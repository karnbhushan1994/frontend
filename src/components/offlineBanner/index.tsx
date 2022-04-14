import React, { useEffect, useState } from 'react';

import { Image, Pressable, Text, View } from 'react-native';

import { useSelector } from 'react-redux';

import { RootState } from 'store/rootReducer';

import { images } from '../../assets/images';

import { styles } from './styles';

interface OfflineBannerProps {
  show?: boolean;
}

const OfflineBannerComponent = ({ show }: OfflineBannerProps): React.ReactElement => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const netinfo = useSelector((store: RootState) => store.internetState);
  const { bannerContent, bannerImage, userAvatar, bannerTextContainer, bannerText } = styles;
  useEffect(() => {
    setShowBanner(netinfo.show);
  }, [netinfo.show]);
  return (
    <>
      {showBanner && (
        <View>
          <Pressable
            onPress={() => {
              setShowBanner(false);
              console.log('tapOnBanner', show);
            }}
            style={bannerContent}>
            <View style={bannerContent}>
              <View style={bannerImage}>
                <Image style={userAvatar} source={images.main.errorclose} />
              </View>
              <View style={bannerTextContainer}>
                <Text style={bannerText}>{'No internet connection'}</Text>
              </View>
            </View>
          </Pressable>
        </View>
      )}
    </>
  );
};

export default OfflineBannerComponent;
