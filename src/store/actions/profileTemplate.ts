import { Action, ThunkAction } from '@reduxjs/toolkit';

import { TemplateEnumType, WidgetType } from 'types/types';

import { createSkin, deleteWidget } from '../../services';
import { removeWidgetFromStore, setUserProfileTemplate, setWidgetsDragChanged } from '../reducers';
import { RootState } from '../rootReducer';

export const updateUserProfileTemplateWidgetStore =
  (
    widgetStore: Record<string, WidgetType[]>,
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    dispatch({
      type: setUserProfileTemplate.type,
      payload: {
        widgetStore,
      },
    });
  };

export const updateUserSkin =
  (
    templateChoice: TemplateEnumType,
    primaryColor: string,
    secondaryColor: string,
    bio_text_color: string,
  ): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    const skin = await createSkin(templateChoice, primaryColor, secondaryColor, bio_text_color);
    if (skin) {
      dispatch({
        type: setUserProfileTemplate.type,
        payload: {
          skin,
        },
      });
    }
  };

export const removeUserWidget =
  (widgetId: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    const success = await deleteWidget(widgetId);
    if (success) {
      dispatch({
        type: removeWidgetFromStore.type,
        payload: {
          id: widgetId,
        },
      });
    }
  };

export const widgetsChanged =
  (isChanged: boolean): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async dispatch => {
    dispatch({
      type: setWidgetsDragChanged.type,
      payload: {
        changed: isChanged,
      },
    });
  };
