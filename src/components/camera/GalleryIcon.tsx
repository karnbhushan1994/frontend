import React from 'react';

import { Image, TouchableOpacity, View } from 'react-native';
import { ImageOrVideo } from 'react-native-image-crop-picker';

import { AnalyticCategory, AnalyticVerb } from 'types';
import { track } from 'utils/analytics';
import { navigateToMediaPicker } from 'utils/camera';

import { styles } from './styles';

interface GalleryIconProps {
  mostRecentPhotoUri: string;
  callback: (media: ImageOrVideo) => void;
}

/*
 * Displays the most recent photo in the user's gallery
 * On click, navigates to the image picker
 */
export const GalleryIcon: React.FC<GalleryIconProps> = ({ mostRecentPhotoUri, callback }) => (
  <TouchableOpacity
    onPress={() => {
      track('GalleryIcon', AnalyticVerb.Pressed, AnalyticCategory.Camera);
      navigateToMediaPicker(callback);
    }}
    style={styles.saveButton}>
    {mostRecentPhotoUri !== '' ? (
      <Image
        source={{ uri: mostRecentPhotoUri }}
        width={40}
        height={40}
        style={styles.galleryIcon}
      />
    ) : (
      <View style={styles.galleryIconEmpty} />
    )}
  </TouchableOpacity>
);

export default GalleryIcon;
