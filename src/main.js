import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'amfe-flexible';
import { NavBar, Icon, Form, Field, Button, Tabbar, TabbarItem, Tab, Tabs, List, cell, PullRefresh, ActionSheet, Popup, Row, Col, Badge, Search, Divider, Tag, CellGroup, Dialog, Image as VanImage, DatetimePicker, RadioGroup, Radio, Lazyload } from 'vant';

Vue.use(Lazyload);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(DatetimePicker);
Vue.use(VanImage);
Vue.use(Dialog);
Vue.use(CellGroup);
Vue.use(Tag);
Vue.use(Divider);
Vue.use(Search);
Vue.use(Row);
Vue.use(Col);
Vue.use(Badge);
Vue.use(Popup);
Vue.use(ActionSheet);
Vue.use(PullRefresh);
Vue.use(List);
Vue.use(cell);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Button);
Vue.use(Form);
Vue.use(Field);
Vue.use(NavBar);
Vue.use(Icon);

Vue.config.productionTip = false;
// input聚焦
Vue.directive('fofo', { // 中间件函数，el代表所在标签，组件的根标签是div，input在内部
  // eslint-disable-next-line space-before-function-paren
  inserted (el) {
    if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
      // 如果直接是input标签/textarea标签
      el.focus();
    } else {
      // 指令在van-search组件身上, 获取的是组件根标签div, 而input在标签内
      const inp = el.querySelector('input');
      const textArea = el.querySelector('textarea');
      if (inp) { inp.focus(); }
      if (textArea) { textArea.focus(); }
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
