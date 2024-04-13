import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isActive: false,
};

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.isActive = action.payload;
    },
  },
});

export const { setLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
