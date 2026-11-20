import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SortOption } from '../../types/index.ts';

export interface ModelsFilterState {
  search: string;
  gender: string;
  category: string;
  heightMin: number;
  heightMax: number;
  ageGroup: string;
  bodyType: string;
  experienceLevel: string;
  availability: string;
  location: string;
  sort: SortOption;
  page: number;
  limit: number;
}

export const initialFilterState: ModelsFilterState = {
  search: '',
  gender: 'All',
  category: 'All',
  heightMin: 155,
  heightMax: 195,
  ageGroup: 'All',
  bodyType: 'All',
  experienceLevel: 'All',
  availability: 'All',
  location: 'All',
  sort: 'featured',
  page: 1,
  limit: 9,
};

const modelsSlice = createSlice({
  name: 'modelsFilter',
  initialState: initialFilterState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setFilterField: <K extends keyof ModelsFilterState>(
      state: ModelsFilterState,
      action: PayloadAction<{ key: K; value: ModelsFilterState[K] }>,
    ) => {
      state[action.payload.key] = action.payload.value;
      if (action.payload.key !== 'page') {
        state.page = 1;
      }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetFilters: () => initialFilterState,
  },
});

export const { setSearch, setFilterField, setPage, resetFilters } = modelsSlice.actions;
export default modelsSlice.reducer;
