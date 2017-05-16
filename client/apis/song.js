import Vue from 'vue';

var proxy = new Vue();

export default {
	
	addSong(data) {
		data = data || {};

		return new Promise((resolve, reject) => {
			proxy.$http.post('http://127.0.0.1:33333/nodeclub/song/add', data)
				.then((retData) => {
					retData = retData || {};
					resolve(retData.data || {});
				}, (err) => {
					reject(err);
				});
		});
	},

	removeSong(data) {
		data = data || {};
		
		return new Promise((resolve, reject) => {
			proxy.$http.post('http://127.0.0.1:33333/nodeclub/song/remove', data)
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
			proxy.$http.get('http://127.0.0.1:33333/nodeclub/song/search', {
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
			proxy.$http.post('http://127.0.0.1:33333/nodeclub/song/update', data)
				.then((retData) => {
					retData = retData || {};
					resolve(retData.data || {});
				}, (err) => {
					reject(err);
				});
		});
	}
};