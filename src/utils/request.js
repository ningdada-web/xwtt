// //基于axios封装网络请求
// import http from 'axios'
// const axios = http.create({
//     baseURL: 'http://geek.itheima.net',
//     timeout: 20000//20秒
// })
// export default()
// request.js
import axios from 'axios';
import config from './config.js';
import router from '../router';
import { Notify } from 'vant';
import { getToken, removeToken } from './token.js';
// 判断环境来获取不同的url
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;
class axiosRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  // eslint-disable-next-line space-before-function-paren
  getConfig () { // 公共基础配置
    const config = {
      baseURL: this.baseUrl,
      headers: {}
    };
    return config;
  }

  // eslint-disable-next-line space-before-function-paren
  interceptor (instance) { // 给实例配置拦截器
    // 添加请求拦截器
    instance.interceptors.request.use(function (config) {
      // 在发送请求之前做些什么
      // null需要赋予才为空，undefined未定义
      // 统一携带token，判断本地有token与上判断api中是否携带Authorization,没有就添加
      if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
        config.headers.Authorization = `Bearer ${getToken()}`;
      }
      return config;
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    });

    // 添加响应拦截器
    instance.interceptors.response.use(function (response) {
      // 对响应数据做点什么
      return response;
    }, function (error) {
      // 对响应错误做点什么
      // console.log(error)
      console.dir(error);
      if (error.response.status === 401) {
        removeToken();
        router.replace('/login');
        Notify({ type: 'warning', message: '登录过期，请重新登录' });
      }
      return Promise.reject(error);
    });
  }

  // eslint-disable-next-line space-before-function-paren
  request (options) { // 新建实例并配置实例并可传参
    const instance = axios.create(); // 新建axios实例
    options = { ...this.getConfig(), ...options }; // 参数（baseURL、其他参数）
    this.interceptor(instance); // 给axios实例添加拦截器
    return instance(options); // 给axios实例添加参数
  }
}
// eslint-disable-next-line new-cap
export default new axiosRequest(baseUrl); // 暴露实例
