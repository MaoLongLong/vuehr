import axios from 'axios';
import { Message } from 'element-ui';
import router from '../router';
import { clearLocalStorage } from './localStore';

const instance = axios.create({
  baseURL: '/api',
  timeout: 1500,
});

instance.interceptors.response.use((value) => {
  if (value.status === 200 && value.data.status === 400) {
    Message.error(value.data.msg);
    return null;
  }
  if (value.data.msg) {
    Message.success(value.data.msg);
  }
  return value.data;
}, (error) => {
  if (error.message.includes('timeout')) {
    Message.error('服务器超时');
    return Promise.reject(error);
  }
  if (error.response.status === 404 || error.response.status === 504) {
    Message.error('服务器被吃了( ╯□╰ )');
  } else if (error.response.status === 403) {
    Message.error('权限不足');
  } else if (error.response.status === 401) {
    clearLocalStorage();
    router.push(`/?to=${router.currentRoute.path}`);
    Message.error('尚未登陆，请登录');
  } else if (error.response.data.msg) {
    Message.error(error.response.data.msg);
  } else if (error.response.status === 500) {
    Message.error('服务端错误');
  } else {
    Message.error('未知错误');
  }
  return Promise.reject(error);
});

export default instance;
