import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employ:{},
};

export const employ = createSlice({
  name: 'employ',
  initialState,
  reducers: {
    setEmploy: (state, action) => {
      state.employ = action.payload;
    },
    resetEmploy: () => initialState
  },
});

export const { setEmploy, resetEmploy } = employ.actions;

export default employ.reducer;
