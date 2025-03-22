import { post, get } from '@/http/request';
import request from '@/http/request'

export type LoginRequest = {
    username: string;
    password: string;
};
// 刷新登录信息需要的参数
export type reLoginRequest = {
    accessToken: string;
};
export type LoginResponse = {
    username: string;
    roles: string[];
    accessToken: string;
};
// 定义的接口
export const userLogin = async (data?: LoginRequest) => {
    return post<LoginResponse>({}, '/login', data);
};

export const refreshUserInfo = async (data?: reLoginRequest) => {
    return post<LoginResponse>({}, '/getUserInfo', data);
};

// 用户登录接口
export function login(data: {
  loginId: string;
  password: string;
  loginType: number;
}) {
  console.log('Login API called with data:', data);
  console.trace('Login API call stack trace:');
  
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 其他用户相关接口...
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}
