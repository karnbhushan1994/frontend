import AsyncStorage from '@react-native-community/async-storage';

import {
  ApplicationLinkWidgetTypes,
  SkinType,
  TemplateEnumType,
  WidgetType,
  ScreenType,
} from 'types';
import logger from 'utils/logger';
import { generateLinkData } from 'utils/widgets';

import {
  APPLICATION_LINK_WIDGET,
  DISPLACE_WIDGET,
  GENERIC_LINK_WIDGET,
  SKIN_ENDPOINT,
  SOCIAL_MEDIA_WIDGET,
  VIDEO_LINK_WIDGET,
  WIDGET,
  WIDGET_STORE,
} from '../constants';

export const getSkin = async (userId: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(SKIN_ENDPOINT + `active_skin/?user_id=${userId}`, {
    method: 'GET',
    headers: {
      Authorization: 'Token ' + token,
    },
  });

  if (response.status === 200) {
    const data: SkinType = await response.json();
    return data;
  }
};

export const getWidgetStore = async (userId: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(WIDGET_STORE + `?user_id=${userId}`, {
    method: 'GET',
    headers: {
      Authorization: 'Token ' + token,
    },
  });

  if (response.status === 200) {
    const data: Record<string, WidgetType[]> = await response.json();
    const ds: { [key: string]: any } = {};

    for (let key in data) {
      try {
        ds[key] = await Promise.all(
          data[key as keyof typeof data]?.map(async (item: any) => {
            const linkData = await generateLinkData(item.url, item.link_type);
            return {
              ...item,
              linkData,
            };
          }),
        );
      } catch (e) {
        console.log('Error: ');
        console.log(e);
      }
    }
    return ds;
  }
};

export const deleteWidget = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${WIDGET}${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    return response.status === 204;
  } catch (error) {
    logger.error('deleteWidget error', JSON.stringify(error));
  }
};

export const loadApplicationWidgets = async (offset = 0, limit = 25) => {
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(`${WIDGET}?offset=${offset}&limit=${limit}`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });

    if (response.status === 200) {
      const body = await response.json();
      return body;
    } else {
      throw new Error(await response.json());
    }
  } catch (error) {
    logger.log('error', JSON.stringify({ error }));
  }
};

export const createVideoLinkWidget = async (
  data: {
    url: string;
    title: string;
    order: number;
    page: string;
    link_type: WidgetType['link_type'];
    font_color: string;
    border_color_start: string | null;
    border_color_end: string | null;
    thumbnail_url: string;
    background_url?: string;
    owner: string;
  },
  token: string,
  id?: string,
) => {
  try {
    if (id) {
      delete data.owner;
    }

    if (
      data.url.length > 5 &&
      !(data.url.startsWith('https://') || data.url.startsWith('http://'))
    ) {
      data.url = 'https://' + data.url;
    }

    console.log(token, data);

    const response = await fetch(VIDEO_LINK_WIDGET + (id ? `${id}/` : ''), {
      method: id?.length ? 'PATCH' : 'POST',
      headers: {
        Authorization: 'Token ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      const body = await response.json();
      return body;
    } else {
      const body = await response.json();
      console.log('Error 1: ');
      console.log(JSON.stringify(body));
      throw new Error(body);
    }
  } catch (error) {
    logger.log(error);
  }
};

export const createApplicationLinkWidget = async (
  data: {
    order: number;
    page: string;
    link_type: WidgetType['link_type'];
    url: string;
    title: string;
    thumbnail_url: string;
    background_url?: string;
    font_color: string;
    background_color_start: string | null;
    background_color_end: string | null;
    owner: string;
  },
  token: string,
  id?: string,
) => {
  try {
    if (
      data.url.includes('etsy') &&
      !(data.url.includes('https://') || data.url.includes('http://'))
    ) {
      let appendedUrl = 'https://' + data.url;
      data.url = appendedUrl;
    }
    if (id?.length) {
      delete data.owner;
    }
    const response = await fetch(APPLICATION_LINK_WIDGET + (id ? `${id}/` : ''), {
      method: id?.length ? 'PATCH' : 'POST',
      headers: {
        Authorization: 'Token ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      const body = await response.json();
      return body;
    } else {
      throw new Error(await response.json());
    }
  } catch (error) {
    logger.log(error);
  }
};
export const createGenericLinkWidget = async (
  data: {
    order: number;
    page: string;
    url: string;
    title: string;
    thumbnail_url: string;
    background_url?: string;
    font_color: string;
    border_color_start: string | null;
    border_color_end: string | null;
    owner: string;
    link_type: WidgetType['link_type'];
  },
  token: string,
  id?: string,
) => {
  if (id?.length) {
    delete data.owner;
  }
  if (data.url.length > 5 && !(data.url.startsWith('https://') || data.url.startsWith('http://'))) {
    data.url = 'https://' + data.url;
  }
  try {
    const response = await fetch(GENERIC_LINK_WIDGET + (id ? `${id}/` : ''), {
      method: id?.length ? 'PATCH' : 'POST',
      headers: {
        Authorization: 'Token ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('----------------------data', data);

    if (response.status === 200) {
      const body = await response.json();
      return body;
    } else {
      throw new Error(JSON.stringify(await response.json()));
    }
  } catch (error) {
    logger.log(error);
  }
};

export const createSocialMedaWidget = async (
  data: {
    owner: string;
    page: ScreenType;
    type: ApplicationLinkWidgetTypes.APPLICATION_LINK;
    order: number;
    link_type: string;
    username: string;
    title: string;
    thumbnail_url?: string;
    background_url?: string;
    font_color: string;
    background_color_start: string | null;
    background_color_end: string | null;
    social_type: string;
  },
  token: string,
  id?: string,
) => {
  try {
    if (id) {
      delete data.owner;
      delete data.type;
    }
    const response = await fetch(SOCIAL_MEDIA_WIDGET + (id ? `${id}/` : ''), {
      method: id && id.length > 0 ? 'PATCH' : 'POST',
      headers: {
        Authorization: 'Token ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log(
      '--------body-------------',
      SOCIAL_MEDIA_WIDGET + (id ? `${id}/` : ''),
      data,
      token,
    );
    if (response.status === 200) {
      const body = await response.json();
      console.log('--------body---------------------------------', body);
      return body;
    } else {
      throw new Error(await response.json());
    }
  } catch (error) {
    logger.log('SOCIAL_MEDIA_WIDGET', error);
  }
};

export const updateApplicationLinkWidget = async (id: string, data: any, token: string) => {
  try {
    const response = await fetch(APPLICATION_LINK_WIDGET + `/${id}/`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify({
        data,
      }),
    });
    if (response.status === 200) {
      const body = await response.json();
      return body;
    } else {
      throw new Error(await response.json());
    }
  } catch (error) {
    logger.log(error);
  }
};

export const createSkin = async (
  templateChoice: TemplateEnumType,
  primaryColor: string,
  secondaryColor: string,
  bio_text_color?: string,
) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(SKIN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: 'Token ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template_type: templateChoice,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      bio_text_color,
      active: true,
    }),
  });
  if (response.status === 201) {
    const data: SkinType = await response.json();
    return data;
  }
};

export const updateUserProfileWidgetApi = async (userId: string, widgetArray: any) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(DISPLACE_WIDGET + `?user_id=${userId}`, {
    method: 'POST',
    headers: {
      Authorization: 'Token ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      widget: widgetArray,
    }),
  });
  if (response.status === 200) {
    const data: Record<string, WidgetType[]> = await response.json();
    const ds: { [key: string]: any } = {};
    for (let key in data) {
      try {
        ds[key] = await Promise.all(
          data[key as keyof typeof data]?.map(async (item: any) => {
            const linkData = await generateLinkData(item.url, item.link_type);
            return {
              ...item,
              linkData,
            };
          }),
        );
      } catch (e) {}
    }
    return ds;
  } else {
    return null;
  }
};
