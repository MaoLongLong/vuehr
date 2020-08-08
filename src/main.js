import Vue from 'vue';
import {
  Button,
  Form,
  FormItem,
  Input,
  Card,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  MenuItem,
  Submenu,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  MessageBox,
  Breadcrumb,
  BreadcrumbItem,
} from 'element-ui';
import App from './App.vue';
import router from './router';
import store from './store';
import Http from './utils/http';

Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Card);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);

Vue.prototype.$message = Message;
Vue.prototype.$http = Http;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$confirm = MessageBox.confirm;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
