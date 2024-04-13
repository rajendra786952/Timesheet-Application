import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filter:{
    department_name:[],
    team_name:[],
    emp_name:'',
    exclusive_start_key:'None'
  },
};

export const filter = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    resetFilter: () => initialState
  },
});

export const { setFilter,resetFilter } = filter.actions;

export default filter.reducer;