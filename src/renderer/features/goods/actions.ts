/* eslint-disable import/prefer-default-export */
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { QuanLiBanHangApi } from 'renderer/apis/QuanLiBanHangApi';
import {
  ICategory,
  IResActionProduct,
  IResCategory,
  IResProducts,
} from 'renderer/shared/types';

export const getAllCategory = createAsyncThunk<
  ICategory[],
  {
    offset?: number;
    limit?: number;
    accessToken: string;
  }
>('goods/getAllCategory', async ({ accessToken }) => {
  const { data } = await QuanLiBanHangApi.getAllCategory(accessToken);
  return data;
});
export const addCategory = createAsyncThunk<
  IResCategory,
  {
    accessToken: string;
    code: string;
    name: string;
  }
>('goods/addCategory', async ({ code, name, accessToken }) => {
  const { data } = await QuanLiBanHangApi.addCategory(accessToken, code, name);
  return data;
});
export const removeCategory = createAsyncThunk<
  { id: string },
  {
    accessToken: string;
    id: string;
  }
>('goods/removeCategory', async ({ accessToken, id }) => {
  await QuanLiBanHangApi.removeCategory(accessToken, id);
  return { id };
});

export const editCategory = createAsyncThunk<
  any,
  {
    accessToken: string;
    id: string;
    d: {
      code: string;
      name: string;
    };
  }
>('goods/editCategory', async ({ accessToken, d, id }) => {
  const { data } = await QuanLiBanHangApi.eidtCategory(accessToken, id, d);
  return data.data;
});

export const getAllProducts = createAsyncThunk<
  IResProducts,
  {
    accessToken: string;
    offset?: number;
    limit?: number;
  }
>('goods/getAllProducts', async ({ accessToken, limit, offset }) => {
  const { data } = await QuanLiBanHangApi.getAllProducts(
    accessToken,
    offset,
    limit
  );
  return data;
});

export const addProduct = createAsyncThunk<
  IResActionProduct,
  {
    accessToken: string;
    d: {
      productName: string;
      price: number;
      quantity: number;
      categoryId: string | number;
    };
  }
>('goods/addProduct', async ({ accessToken, d }) => {
  const { data } = await QuanLiBanHangApi.addProduct(accessToken, d);
  return data;
});

export const removeProduct = createAsyncThunk<
  string,
  {
    accessToken: string;
    id: string;
  }
>('goods/removeProduct', async ({ accessToken, id }) => {
  await QuanLiBanHangApi.deleteProduct(accessToken, id);
  return id;
});
export const editProduct = createAsyncThunk<
  IResActionProduct,
  {
    accessToken: string;
    d: {
      productName: string;
      price: number;
      quantity: number;
      categoryId: number;
    };
    id: number;
    type?: 'add' | 'minus';
  }
>('goods/editProduct', async ({ accessToken, d, id }) => {
  const { data } = await QuanLiBanHangApi.editProduct(accessToken, d, id);
  return data;
});
export const minusQuantityProduct = createAction<{
  id: number;
  quantity: number;
}>('goods/minusQuantityProduct');

export const addQuantityProduct = createAction<{
  id: number;
  quantity: number;
}>('goods/addQuantityProduct');
