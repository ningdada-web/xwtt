// token方法
const key = 'token-key';

// 设置
export const setToken = (token) =>
  localStorage.setItem(key, token);

// 获取
export const getToken = () =>
  localStorage.getItem(key);

// 删除
export const removeToken = () => {
  localStorage.removeItem(key);
};
