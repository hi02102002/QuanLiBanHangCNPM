/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
import {
  IBill,
  ICategory,
  IResActionProduct,
  IResActionUser,
  IResCategory,
  IResProducts,
  IResUser,
  IUserLogin,
} from 'renderer/shared/types';
import { clientPrivate, clientPublic } from './axiosClient';

export const QuanLiBanHangApi = {
  signIn: (userName: string, password: string) => {
    return clientPublic.post<IUserLogin>('auth/signin', {
      userName,
      password,
    });
  },

  getAllUsers: (accessToken: string, offset?: number, limit?: number) => {
    return clientPrivate.get<IResUser>('user', {
      params: {
        offset,
        limit,
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  },
  searchUserByUsername: (username: string, accessToken?: string) => {
    return clientPrivate.get<any>(`user/${username}`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  },
  searchUserByUsernameQK: (username: string) => {
    return clientPublic.get<any>(`user/${username}`);
  },
  addUser: (
    accessToken: string,
    user: {
      userName: string;
      password: string;
      fullName: string;
      address: string;
      birthday: string;
      sdt: number | string;
    }
  ) => {
    return clientPrivate.post<IResActionUser>(
      'user/insert',
      {
        ...user,
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
  editUser: (
    user: {
      userName: string;
      password: string | null;
      fullName: string;
      address: string;
      birthday: string;
      sdt: number | string;
    },
    userId: string,
    accessToken?: string
  ) => {
    return clientPrivate.put<IResActionUser>(
      `user/${userId}`,
      {
        ...user,
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
  deleteUser: (accessToken: string, userId: string) => {
    return clientPrivate.delete<any>(`user/${userId}`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  },
  getAllCategory: (accessToken: string) => {
    return clientPrivate.get<ICategory[]>('category', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  },
  addCategory: (accessToken: string, code: string, name: string) => {
    return clientPrivate.post<IResCategory>(
      'category/insert',
      {
        code,
        name,
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
  removeCategory: (accessToken: string, id: string) => {
    return clientPrivate.delete<any>(`category/${id}`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  },
  eidtCategory: (
    accessToken: string,
    id: string,
    data: { code: string; name: string }
  ) => {
    return clientPrivate.put(
      `category/${id}`,
      {
        ...data,
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
  getAllProducts: (accessToken: string, offset?: number, limit?: number) => {
    return clientPrivate.get<IResProducts>(`product`, {
      params: {
        limit,
        offset,
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  },
  addProduct: (
    accessToken: string,
    data: {
      productName: string;
      price: number;
      quantity: number;
      categoryId: string | number;
    }
  ) => {
    return clientPrivate.post<IResActionProduct>(
      `product/insert`,
      {
        ...data,
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
  deleteProduct: (accessToken: string, id: string) => {
    return clientPrivate.delete<any>(`product/${id}`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  },
  editProduct: (
    accessToken: string,
    data: {
      productName: string;
      price: number;
      quantity: number;
      categoryId: number;
    },
    id: number
  ) => {
    return clientPrivate.put<any>(
      `product/${id}`,
      {
        ...data,
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
  createBill: (accessToken: string, data: IBill) => {
    return clientPrivate.post(
      'bill/insert',
      {
        ...data,
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
  getAllBill: (accessToken: string) => {
    return clientPrivate.get('bill', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  },
  forgotPassword: (
    username: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    return clientPublic.post(
      'auth/forgot-password',
      {
        newPassword,
        confirmPassword,
      },
      {
        params: {
          username,
        },
      }
    );
  },
};
