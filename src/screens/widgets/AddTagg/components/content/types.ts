import { ImageProps } from 'react-native';

import { bgTypes } from 'screens/widgets/AddTagg';
import { TaggType } from 'types';

export type ContentType = {
  constructor: {
    validator: (url: string) => boolean;
    urlPlaceholder: string;
    title: string;
    logoSmall: ImageProps;
  };
  data: any;
  url: string;
  status: string;
  handleInputChange: (name: string, value: string) => void;
  isColorPickerVisible: boolean;
  colorPickerColors: string[];
  setIsColorPickerVisible: (status: boolean) => void;
  setColorPickerColors: (value: string[]) => void;
  setFontColor: (value: string) => void;
  fontColor: string;
  errors: {
    title?: string;
    uri?: string;
  };
  title: string;
  activeBgType?: string;
  bgTypes?: typeof bgTypes;
  setActiveBgType?: (value: string) => void;
  handleSubmit: () => void;
  img?: ImageProps;
  loader?: boolean;
  setImage?: (image: any) => void;
  cbForCustomThumbnail?: any;
  cbForCustomThumbnailBackground2?: any;
  loading?: any;
  thumbnail_url?: any;
  setIsImageLoading: (status: boolean) => void;
  screenType?: string;
  userBGTaggEligiblity: TaggType;
  setbackground_url: (status: null) => void;
  setbgImage: (status: null) => void;
};
