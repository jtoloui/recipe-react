import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const axiosInstanceFormData = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});
