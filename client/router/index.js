import Vue from 'vue';
import VueRouter from 'vue-router';

import RouterView from '../components/router_views/index';
import Module from '../views/index';

Vue.use(VueRouter);

export default new VueRouter({
	mode: 'hash',
	routes: [
		{
			path : '',
			name : '首页',
			hidden : true,
			redirect : (to) => {
				return '/database/nodeclub/user';
			}
		}, {
			path : '/login',
			name : '登录',
			hidden : false,
			component : Module.login
		}, {
			path : '/database',
			name : '数据库管理',
			hidden : false,
			component : RouterView.home,
			children : [
				{
					path : '',
					redirect : (to) => {
						return 'nodeclub';
					},
					hidden : true
				},{
					path : 'nodeclub',
					name : 'node数据库',
					icon : 'reorder',
					component : RouterView.content,
					children : [
						{
							path : '',
							redirect : (to) => {
								return 'user';
							},
							hidden : true
						}, {
							path : 'user',
							name : '用户管理',
							icon : 'reorder',
							hidden : false,
							component : Module.database.nodeclub.user
						}, {
							path : 'topic',
							name : '话题管理',
							icon : 'reorder',
							hidden : false,
							component : Module.database.nodeclub.topic
						}, {
							path : 'topic_add',
							name : '话题创建',
							icon : 'reorder',
							hidden : false,
							component : Module.database.nodeclub.topic_add
						}
					]
				}
			]
		}, {
			path : '/test',
			name : '测试样例',
			hidden : false,
			component : RouterView.home,
			children : [
				{
					path : '',
					redirect : (to) => {
						return 'vue';
					},
					hidden : true
				}, {
					path : 'vue',
					name : 'vue 测试',
					icon : 'reorder',
					component : RouterView.content,
					children : [
						{
							path : '',
							redirect : (to) => {
								return 'transition';
							},
							hidden : true
						}, {
							path : 'transition',
							name : '过渡测试',
							hidden : false,
							icon : 'reorder',
							component : Module.test.vue.transition
						}, {
							path : 'directive_mixin',
							name : 'directive 和 mixin',
							hidden : false,
							icon : 'reorder',
							component : Module.test.vue.directive_mixin
						}
					]
				}, {
					path : 'electron',
					name : 'electron 测试',
					icon : 'reorder',
					component : RouterView.content,
					children : [
						{
							path : '',
							hidden : true,
							redirect : (to) => {
								return 'remote';
							}
						}, {
							path : 'remote',
							name : 'remote',
							hidden : false,
							icon : 'reorder',
							component : Module.test.electron.remote
						}, {
							path : 'capturer',
							name : 'capturer 测试',
							hidden : false,
							icon : 'reorder',
							component : Module.test.electron.capturer
						}, {
							path : 'capturer_pic',
							name : '屏幕截图',
							hidden : false,
							icon : 'reorder',
							component : Module.test.electron.capturer_pic
						}
					]
				}
			]
		}
	]
});
