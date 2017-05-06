import Vue from 'vue';

var proxy = new Vue();

export default {
	
	addTopic(data) {
		data = data || {};

		return new Promise((resolve, reject) => {
			proxy.$http.post('http://127.0.0.1:33333/nodeclub/topic/add', data)
				.then((retData) => {
					retData = retData || {};
					resolve(retData.data || {});
				}, (err) => {
					reject(err);
				});
		});
	},

	removeTopic(data) {
		data = data || {};
		
		return new Promise((resolve, reject) => {
			proxy.$http.post('http://127.0.0.1:33333/nodeclub/topic/remove', data)
				.then((retData) => {
					retData = retData || {};
					resolve(retData.data || {});
				}, (err) => {
					reject(err);
				});
		});
	},

	searchTopic(data) {
		data = data || {};

		return new Promise((resolve, reject) => {
			proxy.$http.get('http://127.0.0.1:33333/nodeclub/topic/search', {
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

	updateTopic(data) {
		data = data || {};

		return new Promise((resolve, reject) => {
			proxy.$http.post('http://127.0.0.1:33333/nodeclub/topic/update', data)
				.then((retData) => {
					retData = retData || {};
					resolve(retData.data || {});
				}, (err) => {
					reject(err);
				});
		});
	}
};