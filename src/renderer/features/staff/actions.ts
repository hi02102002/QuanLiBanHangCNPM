/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { QuanLiBanHangApi } from 'renderer/apis/QuanLiBanHangApi';
import { IResUser, IUser } from 'renderer/shared/types';

export const updateStaff = createAsyncThunk<
  IUser,
  {
    accessToken: string;
    user: {
      address: string;
      birthday: string;
      fullName: string;
      password: string | null;
      sdt: number | string;
      userName: string;
    };
    userId: string;
  }
>('staff/editStaff', async ({ accessToken, user, userId }) => {
  const { data } = await QuanLiBanHangApi.editUser(user, userId, accessToken);
  return data.data;
});

export const getAllUsers = createAsyncThunk<
  IResUser,
  {
    accessToken: string;
    offset?: number;
    limit?: number;
  }
>('staff/getAllUsers', async ({ accessToken, limit, offset }) => {
  const { data } = await QuanLiBanHangApi.getAllUsers(
    accessToken,
    offset,
    limit
  );
  return data;
});

export const addStaff = createAsyncThunk<
  IUser,
  {
    accessToken: string;
    user: {
      userName: string;
      password: string;
      fullName: string;
      address: string;
      birthday: string;
      sdt: number | string;
      createdDate: string;
    };
  },
  {
    rejectValue: any;
  }
>('staff/addStaff', async ({ accessToken, user }, { rejectWithValue }) => {
  try {
    const { data } = await QuanLiBanHangApi.addUser(accessToken, user);

    return data.data;
  } catch (error: any) {
    return rejectWithValue('Error!!');
  }
});

export const removeStaff = createAsyncThunk<
  string | number,
  {
    accessToken: string;
    userId: string;
  }
>('staff/removeStaff', async ({ accessToken, userId }) => {
  await QuanLiBanHangApi.deleteUser(accessToken, userId);
  return userId;
});
