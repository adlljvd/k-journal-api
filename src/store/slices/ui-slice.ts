import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
}

const initialState: UiState = {
  isSidebarOpen: false,
  isModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const { toggleSidebar, toggleModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
