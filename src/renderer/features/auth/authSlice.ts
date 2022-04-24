/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
import { createSlice } from '@reduxjs/toolkit';
import { IUser, IUserLogin } from 'renderer/shared/types';
import { logout, signIn, updateUser } from './actions';

const initialState: {
  user: (IUserLogin & IUser) | null;
  loading: boolean;
  error: string | undefined | null;
} = {
  user: null,
  error: '',
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logout, (state) => {
        state.user = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        //@ts-ignore
        state.user = {
          ...state.user,
          fullName: action.payload.fullName,
          birthday: action.payload.birthday,
          address: action.payload.address,
          sdt: action.payload.sdt,
        };
      });
  },
});

export const authReducer = authSlice.reducer;
