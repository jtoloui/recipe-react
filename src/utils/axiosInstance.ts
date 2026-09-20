import axios from 'axios';

import { API_BASE } from './apiBase';

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const axiosInstanceFormData = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});
