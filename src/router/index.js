import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import { initMenu } from '../utils/menus';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: '登录',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name) {
    document.title = to.name;
  }
  if (to.path === '/') {
    next();
  } else {
    initMenu(router, store);
  }
  next();
});

export default router;
