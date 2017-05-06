import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import App from './components/App';
import router from './router';
import store from './store';

// 引入 vue-reource  
import VueResource from 'vue-resource';
Vue.use(VueResource);

// 引入 element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
Vue.use(ElementUI);

import '../static/assets/css/animate.css';


sync(store, router);

const app = new Vue({
	router,
	store,
	...App
});

export { app, router, store };
