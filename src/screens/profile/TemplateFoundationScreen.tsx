import React, { FC, useContext } from 'react';

import { RouteProp } from '@react-navigation/native';

import TemplateFiveFoundation from 'components/templates/TemplateFiveFoundation';
import TemplateFourFoundation from 'components/templates/TemplateFourFoundation';
import TemplateOneFoundation from 'components/templates/TemplateOneFoundation';
import TemplateThreeFoundation from 'components/templates/TemplateThreeFoundation';
import TemplateTwoFoundation from 'components/templates/TemplateTwoFoundation';

import { MainStackParams } from 'routes';
import { TemplateEnumType } from 'types';

import { ProfileContext } from './ProfileScreen';

interface TemplateFoundationScreenProps {
  route: RouteProp<MainStackParams, 'TemplateFoundationScreen'>;
}

const TemplateFoundationScreen: FC<TemplateFoundationScreenProps> = ({ route }) => {
  const { templateChoice } = useContext(ProfileContext);
  // const templateChoice = TemplateEnumType.Two;
  const { setActiveTab } = route.params;
  switch (templateChoice) {
    case TemplateEnumType.One:
      return <TemplateOneFoundation setActiveTab={setActiveTab} />;
    case TemplateEnumType.Two:
      return <TemplateTwoFoundation setActiveTab={setActiveTab} />;
    case TemplateEnumType.Three:
      return <TemplateThreeFoundation setActiveTab={setActiveTab} />;
    case TemplateEnumType.Four:
      return <TemplateFourFoundation setActiveTab={setActiveTab} />;
    case TemplateEnumType.Five:
      return <TemplateFiveFoundation setActiveTab={setActiveTab} />;
    // case TemplateOptionsType.Four:
    //   return <></>;
    default:
      return null;
  }
};

export default TemplateFoundationScreen;
