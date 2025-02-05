import axios from 'axios';
import { getMessageInfo } from './status';
import { ElMessage } from 'element-plus';
import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';


const service: AxiosInstance = axios.create({
    // 启用 mock 就请求 mock 路径
    // 不启用 mock 就请求 正常后端路径
    baseURL: Boolean(import.meta.env.VITE_APP_USE_MOCK)
        ? import.meta.env.VITE_APP_MOCK_BASEURL
        : import.meta.env.VITE_APP_API_BASEURL,
    timeout: 5000,
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


// axios响应拦截
// 给予用户友好提示
service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            return response;
        }
        ElMessage({
            message: getMessageInfo(response.status),
            type: 'error',
        });
        return response;
    },
    // 请求失败
    (error: any) => {
        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            ElMessage({
                message: getMessageInfo(response.status),
                type: 'error',
            });
            return Promise.reject(response.data);
        }
        ElMessage({
            message: '网络异常,请稍后再试!',
            type: 'error',
        });
    }
);


export default service