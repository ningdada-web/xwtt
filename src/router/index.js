import Vue from 'vue';
import VueRouter from 'vue-router';
import { getToken } from '../utils/token';

Vue.use(VueRouter);

const routes = [
  {
    path: '/', // 重定向
    redirect: '/login'
  },
  {
    path: '/login', // 登录
    name: 'Login',
    component: () => import('../views/Login/login.vue')
  },
  {
    path: '/search', // 搜索页面
    name: 'Search',
    component: () => import('../views/Search/search.vue')
  },
  {
    path: '/searchResult/:kw', // 搜索结果
    name: 'SearchResult',
    component: () => import('../views/Search/searchResult.vue')
  },
  {
    path: '/articleDetail', // 文章详情
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetail/ArticleDetail.vue')
  },

  {
    path: '/inside', // 底部按钮页面
    name: 'Inside',
    component: () => import('../views/Inside/Inside.vue'),
    children: [{
      path: 'home', // 主页
      name: 'Home',
      component: () => import('../views/Home/Home.vue')
    },
    {
      path: 'userEdit', // 编辑资料
      name: 'userEdit',
      component: () => import('../views/User/userEdit.vue')
    },
    {
      path: 'history', // 历史记录
      name: 'history',
      component: () => import('../views/User/history.vue')
    },
    {
      path: 'user', // 个人中心
      name: 'User',
      component: () => import('../views/User/User.vue')
    }]
  }
];

const router = new VueRouter({
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = getToken();
  console.log(token);
  if (!token && to.name !== 'Login') {
    next({ name: 'Login' });
  } else if (token && to.name === 'Login') {
    next(false);
  } else {
    next();
  }
});

export default router;
