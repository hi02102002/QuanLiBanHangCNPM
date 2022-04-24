/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-useless-path-segments */
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IUser, IUserLogin } from 'renderer/shared/types';
import { RootState } from 'renderer/store';
import { QuanLiBanHangApi } from '../../apis/QuanLiBanHangApi';

export const signIn = createAsyncThunk<
  IUserLogin & IUser,
  {
    userName: string;
    password: string;
  }
>('auth/signIn', async ({ userName, password }) => {
  const { data: dataLogin } = await QuanLiBanHangApi.signIn(userName, password);
  const { data } = await QuanLiBanHangApi.searchUserByUsername(
    dataLogin.userName,
    dataLogin.accessToken
  );

  return {
    ...dataLogin,
    ...data.data[0],
  };
});

export const logout = createAction('auth/logout');

export const updateUser = createAsyncThunk<
  IUser,
  {
    accessToken: string;
    user: {
      address: string;
      birthday: string;
      fullName: string;
      sdt: number | string;
    };
    userId: string;
  },
  {
    state: RootState;
  }
>('auth/updateUser', async ({ accessToken, user, userId }, { getState }) => {
  const currentUser = getState().auth.user as IUserLogin & IUser;
  const { data } = await QuanLiBanHangApi.editUser(
    {
      ...user,
      userName: currentUser.userName,
      password: null,
    },
    userId,
    accessToken
  );
  return data.data;
});
