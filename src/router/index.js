import Vue from 'vue';
import VueRouter from 'vue-router';
import { Message } from 'element-ui';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import { initMenu } from '../utils/menus';
import store from '../store';
import { getUser } from '../utils/localStore';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: '登录',
    component: Login,
  },
  {
    path: '/home',
    name: '首页',
    component: Home,
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.name || '';
  if (to.path === '/') {
    if (!getUser()) {
      next();
    } else {
      Message.info('已登录');
      if (from.path === '/') {
        next('/home');
      } else {
        next(from.path);
      }
    }
  } else if (getUser()) {
    initMenu(router, store);
    next();
  } else {
    next(`/?to=${to.path}`);
    Message.error('尚未登录, 请登录!');
  }
});

export default router;
