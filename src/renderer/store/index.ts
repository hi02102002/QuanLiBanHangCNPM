/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { authReducer } from 'renderer/features/auth';
import { cartReducer } from 'renderer/features/Cart';
import { goodsReducer } from 'renderer/features/goods/goodsSlice';
import { staffReducer } from 'renderer/features/staff';

export const store = configureStore({
  reducer: {
    // This is where we add reducers.
    // Since we don't have any yet, leave this empty
    auth: authReducer,
    staff: staffReducer,
    goods: goodsReducer,
    cart: cartReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
