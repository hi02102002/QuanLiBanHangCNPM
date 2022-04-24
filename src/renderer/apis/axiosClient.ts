/* eslint-disable import/no-cycle */
/* eslint-disable promise/no-promise-in-callback */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import queryString from 'query-string';

export const clientPublic = axios.create({
  baseURL: 'https://qlbn-app.herokuapp.com/api/',
  paramsSerializer: (params) => queryString.stringify(params),
});

export const clientPrivate = axios.create({
  baseURL: 'https://qlbn-app.herokuapp.com/api/',
  paramsSerializer: (params) => queryString.stringify(params),
});
