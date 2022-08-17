/* eslint-disable camelcase */
// api.js

import http from '../utils/request.js';

// 用于存放各种专门的获取api的函数
// 之后哪个组件需要使用axios就直接调用此js文件的方法
// axios把参数对象转成json字符串发后台，自动携带请求参数（headers）里
// Content-type： ‘application/json’自动添加

// 频道 获取所有频道
export const getChannelsApi = () => {
  return http.request({
    method: 'GET',
    url: '/v1_0/channels'
  });
};
// 登录
export const loginApi = ({ mobile, code }) => {
  return http.request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  });
};
// 频道 获取用户频道
export const getUserChannelsApi = () => {
  return http.request({
    method: 'GET',
    url: '/v1_0/user/channels'

  });
};
// 频道 删除用户频道
// export const removeUserChannelsApi = (channelID) => {
//   return http.request({
//     method: 'DELETE',
//     url: `/v1_0/user/channels/${channelID}`

//   });
// };
// 获取文章列表
// eslint-disable-next-line camelcase
export const getArticleListApi = ({ channel_id, timestamp }) => {
  return http.request({
    method: 'GET',
    url: '/v1_0/articles',

    params: {
      channel_id,
      timestamp
    }
  });
};
// 不喜欢文章接口
export const articleDislikeApi = ({ artId }) => {
  return http.request({
    method: 'POST',
    url: '/v1_0/article/dislikes',

    data: {
      target: artId
    }
  });
};
// 举报,反馈其他问题接口
export const articleReportApi = ({ artId, type }) => {
  return http.request({
    method: 'POST',
    url: '/v1_0/article/reports',

    data: {
      target: artId,
      type: type,
      remark: '不好看'
    }
  });
};
// 更新频道列表
export const refreshChannelsApi = (channels) => {
  return http.request({
    method: 'PUT',
    url: '/v1_0/user/channels',
    data: {
      channels: channels
    }
  });
};
// 获取-搜索联想建议
export const getSuggestApi = ({ keyword }) => {
  return http.request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q: keyword
    }
  });
};
// 获取搜索结果
export const getSearchResApi = ({ page, pageNum, keyword }) => {
  return http.request({
    method: 'GET',
    url: '/v1_0/search',
    params: {
      page: page,
      per_page: pageNum,
      q: keyword
    }
  });
};
// 文章-获取文章详情
// eslint-disable-next-line camelcase
export const getArtDetailApi = ({ Id }) => {
  return http.request({
    method: 'GET',
    // eslint-disable-next-line camelcase
    url: `/v1_0/articles/${Id}`

  });
};
// 文章-关注作者
export const followApi = ({ id }) => {
  return http.request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: id
    }
  });
};
// 文章-取关作者
export const unFollowApi = ({ target }) => {
  return http.request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`
  });
};
// 文章-点赞文章
export const likeApi = ({ id }) => {
  return http.request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: id
    }
  });
};
// 文章-取消点赞
export const dislikeApi = ({ target }) => {
  return http.request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`
  });
};
// 获取-文章评论列表
export const commentApi = ({ id, offset = null }) => {
  return http.request({
    method: 'GET',
    url: '/v1_0/comments',
    params: {
      type: 'a',
      source: id,
      offset
    }
  });
};
// 评论-点赞评论
export const comLikeApi = ({ id }) => {
  return http.request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target: id
    }
  });
};
// 评论-取消点赞
export const comDislikeApi = ({ target }) => {
  return http.request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  });
};
// 评论-增加评论
// 如果目标id为文章内容，art_id为null，如果目标id为评论结果内容，art_id为目标id
export const addDetailApi = ({ id, content, art_id = null }) => {
  const obj = {
    target: id,
    content
  };
  if (art_id !== null) {
    obj.art_id = art_id;
  }
  return http.request({
    method: 'POST',
    url: '/v1_0/comments',
    data: obj
  });
};
// 获取-用户个人简介
export const userProfileApi = () => {
  return http.request({
    method: 'GET',
    url: '/v1_0/user/profile'
  });
};
// 获取-用户基本资料
export const userApi = () => {
  return http.request({
    method: 'GET',
    url: '/v1_0/user'
  });
};
// 用户- 更新头像
// 注意: formObj的值必须是一个表单对象
// '{"a": 10, "b": 20}' // 对象格式的JSON字符串
// new FormData() // 表单对象
export const updatePhotoAPI = (formObj) => {
  return http.request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: formObj
    // 如果你的请求体内容是表单对象, 浏览器会自动携带请求头Content-Type为multipart/form-data
  });
};
// 用户 - 更新资料
export const updateProfileAPI = ({ birthday, userName, render }) => {
  return http.request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: {
      birthday: birthday,
      name: userName,
      render: render
    }
  });
};
// 个人页面-历史记录接口
export const historyApi = ({ page, pageNum }) => {
  return http.request({
    method: 'GET',
    url: '/v1_0/user/histories',
    params: {
      page: page,
      per_page: pageNum
    }
  });
};
