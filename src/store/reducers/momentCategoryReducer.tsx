import { createSlice } from '@reduxjs/toolkit';

import { INITIAL_CATEGORIES_STATE } from '../initialStates';

const momentCategoriesSlice = createSlice({
  name: 'momentCategories',
  initialState: INITIAL_CATEGORIES_STATE,
  reducers: {
    /**
     * Replace a new copy of moment categories for a user
     */
    momentCategoriesFetched: (state, action) => {
      const categories: string[] = action.payload.categories;
      state.momentCategories = categories.filter(item => item !== '');
    },
    resetMomentCategories: () => INITIAL_CATEGORIES_STATE,
  },
});

export const { momentCategoriesFetched, resetMomentCategories } = momentCategoriesSlice.actions;
export const momentCategoriesReducer = momentCategoriesSlice.reducer;
