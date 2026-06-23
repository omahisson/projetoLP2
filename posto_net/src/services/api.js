import axios from 'axios';
import { API_BASE_URL } from '../config/axios';

const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
        || localStorage.getItem('jwt')
        || localStorage.getItem('accessToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
