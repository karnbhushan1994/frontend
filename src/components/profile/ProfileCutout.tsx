import React from 'react';

import Svg, { Polygon } from 'react-native-svg';

import { SCREEN_WIDTH } from 'utils';

import {
  PROFILE_CUTOUT_CORNER_Y,
  PROFILE_CUTOUT_CORNER_X,
  PROFILE_CUTOUT_TOP_Y,
  PROFILE_CUTOUT_BOTTOM_Y,
} from '../../constants';

const ProfileCutout: React.FC = ({ children }) => (
  <Svg width={SCREEN_WIDTH} height={PROFILE_CUTOUT_BOTTOM_Y}>
    <Polygon
      points={`0,${PROFILE_CUTOUT_CORNER_Y} ${PROFILE_CUTOUT_CORNER_X},${PROFILE_CUTOUT_TOP_Y} ${SCREEN_WIDTH},${PROFILE_CUTOUT_TOP_Y} ${SCREEN_WIDTH},${PROFILE_CUTOUT_BOTTOM_Y}, 0,${PROFILE_CUTOUT_BOTTOM_Y}`}
      fill={'white'}
    />
    {children}
  </Svg>
);

export default ProfileCutout;
