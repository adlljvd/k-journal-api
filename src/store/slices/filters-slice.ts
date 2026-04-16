import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  query: string;
  genre: string;
  type: string;
  year: string;
}

const initialState: FiltersState = {
  query: "",
  genre: "",
  type: "",
  year: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: keyof FiltersState; value: string }>) => {
      state[action.payload.key] = action.payload.value;
    },
    resetFilters: () => initialState,
  },
});

export const { setFilter, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
