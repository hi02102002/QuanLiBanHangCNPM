import { RootState } from 'renderer/store';

export const categorySelector = (state: RootState) => state.goods.category;
export const productsSelector = (state: RootState) => state.goods.product;
