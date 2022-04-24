import { createAction } from '@reduxjs/toolkit';
import { ICart } from 'renderer/shared/types';

export const addCart = createAction<ICart>('cart/addCart');
export const removeCartItem = createAction<{ id: number }>(
  'cart/removeCartItem'
);
export const removeAllCart = createAction('cart/removeAllCart');
