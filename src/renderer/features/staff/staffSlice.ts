/* eslint-disable import/prefer-default-export */
import { createSlice } from '@reduxjs/toolkit';
import { IUser, Role } from 'renderer/shared/types';
import { addStaff, getAllUsers, removeStaff, updateStaff } from './actions';

const initialState: {
  staffs: IUser[];
  loading: boolean;
  error: string | undefined | null;
} = {
  staffs: [],
  error: '',
  loading: false,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.staffs = action.payload.content.filter(
          (item) => item?.roles[0]?.name !== Role.ADMIN
        );
        state.loading = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(updateStaff.fulfilled, (state, { payload }) => {
        const staffIndexExist = state.staffs.findIndex(
          (staff: IUser) => staff.id === payload.id
        );
        if (state.staffs[staffIndexExist]) {
          state.staffs[staffIndexExist] = {
            ...state.staffs[staffIndexExist],
            ...payload,
          };
        }
      })
      .addCase(removeStaff.fulfilled, (state, { payload }) => {
        state.staffs = state.staffs.filter(
          (staff: IUser) => staff.id !== payload
        );
      })
      .addCase(addStaff.fulfilled, (state, actions) => {
        state.staffs.unshift(actions.payload);
      });
  },
});

export const staffReducer = staffSlice.reducer;
