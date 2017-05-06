import { storage } from '../util/index';

import Vue from 'vue';

var proxy = new Vue();

export default {
	login(data) {
		data = data || {};

		return new Promise((resolve, reject) => {
			proxy.$http.post('http://127.0.0.1:33333/nodeclub/user/login', data)
				.then((retData) => {
					retData = retData || {};
					resolve(retData.data || {});
				}, (err) => {
					reject(err);
				});
		});
	},

	addUser(data) {
		data = data || {};

		return new Promise((resolve, reject) => {
			proxy.$http.post('http://127.0.0.1:33333/nodeclub/user/add', data)
				.then((retData) => {
					retData = retData || {};
					resolve(retData.data || {});
				}, (err) => {
					reject(err);
				});
		});
	},

	removeUser(data) {
		data = data || {};
		
		return new Promise((resolve, reject) => {
			proxy.$http.post('http://127.0.0.1:33333/nodeclub/user/remove', data)
				.then((retData) => {
					retData = retData || {};
					resolve(retData.data || {});
				}, (err) => {
					reject(err);
				});
		});
	},

	searchUser(data) {
		data = data || {};

		return new Promise((resolve, reject) => {
			proxy.$http.get('http://127.0.0.1:33333/nodeclub/user/search', {
				params : data
			})
				.then((retData) => {
					retData = retData || {};
					resolve(retData.data || {});
				}, (err) => {
					reject(err);
				});
		
		});
	},

	updateUser(data) {
		data = data || {};

		return new Promise((resolve, reject) => {
			proxy.$http.post('http://127.0.0.1:33333/nodeclub/user/update', data)
				.then((retData) => {
					retData = retData || {};
					resolve(retData.data || {});
				}, (err) => {
					reject(err);
				});
		});
	}
};