import axios from 'axios';
import { Message, Loading } from 'element-ui';
import router from '../router';

let loading = null;

const instance = axios.create({
  baseURL: '/api',
  timeout: 1500,
});

instance.interceptors.request.use((value) => {
  loading = Loading.service({
    lock: true,
  });
  return value;
}, (error) => Promise.reject(error));

instance.interceptors.response.use((value) => {
  loading.close();
  if (value.status === 200 && value.data.status === 400) {
    Message.error(value.data.msg);
    return null;
  }
  if (value.data.msg) {
    Message.success(value.data.msg);
  }
  return value.data;
}, (error) => {
  loading.close();
  if (error.message.includes('timeout')) {
    Message.error('服务器超时');
    return Promise.reject(error);
  }
  if (error.response.status === 404 || error.response.status === 504) {
    Message.error('服务器被吃了( ╯□╰ )');
  } else if (error.response.status === 403) {
    Message.error('权限不足');
  } else if (error.response.status === 401) {
    router.push('/');
    Message.error('尚未登陆，请登录');
  } else if (error.data.msg || error.data.message) {
    Message.error(error.data.msg || error.data.message);
  } else {
    Message.error('未知错误');
  }
  return Promise.reject(error);
});

export default instance;
