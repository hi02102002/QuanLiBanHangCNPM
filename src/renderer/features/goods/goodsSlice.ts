/* eslint-disable import/prefer-default-export */
import { createSlice } from '@reduxjs/toolkit';
import { ICategory, IProducts } from 'renderer/shared/types';
import {
  addCategory,
  addProduct,
  addQuantityProduct,
  editCategory,
  editProduct,
  getAllCategory,
  getAllProducts,
  minusQuantityProduct,
  removeCategory,
  removeProduct,
} from './actions';

const initialState: {
  category: {
    categorys: ICategory[];
    loading: boolean;
    error: string | undefined | null;
  };
  product: {
    products: IProducts[];
    loading: boolean;
    error: string | undefined | null;
  };
} = {
  category: {
    categorys: [],
    loading: false,
    error: '',
  },
  product: {
    products: [],
    error: '',
    loading: false,
  },
};

const goodsSlice = createSlice({
  name: 'goods',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state) => {
        state.category.loading = true;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.category.categorys = action.payload;
        state.category.loading = false;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.category.error = action.error.message;
        state.category.loading = false;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.category.categorys.push(action.payload.data);
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.category.categorys = state.category.categorys.filter(
          (category) => category.id !== action.payload.id
        );
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        const categoryIndexExist = state.category.categorys.findIndex(
          (category) => category.id === action.payload.id
        );

        if (state.category.categorys[categoryIndexExist]) {
          state.category.categorys[categoryIndexExist] = {
            ...state.category.categorys[categoryIndexExist],
            ...action.payload,
          };
        }
      })
      .addCase(getAllProducts.pending, (state) => {
        state.product.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.product.products = action.payload.content;
        state.product.loading = false;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.product.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.product.products.push(action.payload.data);
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.product.products = state.product.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const productIndexExist = state.product.products.findIndex(
          (product) => product.id === action.payload.data.id
        );
        if (state.product.products[productIndexExist]) {
          state.product.products[productIndexExist] = {
            ...action.payload.data,
          };
        }
      })
      .addCase(minusQuantityProduct, (state, action) => {
        const index = state.product.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (state.product.products[index]) {
          state.product.products[index] = {
            ...state.product.products[index],
            quantity:
              state.product.products[index].quantity - action.payload.quantity,
          };
        }
      })
      .addCase(addQuantityProduct, (state, action) => {
        const index = state.product.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (state.product.products[index]) {
          state.product.products[index] = {
            ...state.product.products[index],
            quantity:
              state.product.products[index].quantity + action.payload.quantity,
          };
        }
      });
  },
});

export const goodsReducer = goodsSlice.reducer;
