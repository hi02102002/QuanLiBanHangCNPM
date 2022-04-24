/* eslint-disable import/prefer-default-export */
import { RootState } from 'renderer/store';

export const authSelector = (state: RootState) => state.auth;
