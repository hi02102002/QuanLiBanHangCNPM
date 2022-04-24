/* eslint-disable import/prefer-default-export */
import { createSlice } from '@reduxjs/toolkit';
import { ICart } from 'renderer/shared/types';
import { addCart, removeAllCart, removeCartItem } from './action';

const initialState: {
  carts: ICart[];
} = {
  carts: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCart, (state, action) => {
        const indexCartExist = state.carts.findIndex(
          (cart) => cart.id === action.payload.id
        );
        if (state.carts[indexCartExist]) {
          state.carts[indexCartExist] = {
            ...state.carts[indexCartExist],
            amount: action.payload.amount + state.carts[indexCartExist].amount,
          };
        } else {
          state.carts.push(action.payload);
        }
      })
      .addCase(removeCartItem, (state, action) => {
        state.carts = state.carts.filter(
          (cart) => cart.id !== action.payload.id
        );
      })
      .addCase(removeAllCart, (state) => {
        state.carts = [];
      });
  },
});

export const cartReducer = cartSlice.reducer;
