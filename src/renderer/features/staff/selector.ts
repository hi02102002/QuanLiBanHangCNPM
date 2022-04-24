/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
import { RootState } from 'renderer/store';

export const staffSelector = (state: RootState) => state.staff;
