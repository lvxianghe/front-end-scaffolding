import axios from 'axios';
import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';

const service: AxiosInstance = axios.create({
    baseURL: '/',
    timeout: 15000,
});

const service: AxiosInstance = axios.create({
    // 这样我们就可以在环境变量中改变 axios 的 baseURL
    baseURL: import.meta.env.VITE_APP_API_BASEURL,
    timeout: 15000,
});

// axios实例拦截请求
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// axios实例拦截响应
service.interceptors.response.use(
    (response: AxiosResponse) => {
    },
    (error: any) => {
    }
);


export default service