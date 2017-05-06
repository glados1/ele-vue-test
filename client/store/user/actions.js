export default {
	set_user_info : ({
		commit
	}, {
		userInfo
	}) => {
		return new Promise((resolve, reject) => {
			commit('set_user_info', userInfo);
			resolve();
		});
	},

	user_logout : ({
		commit
	}, {

	}) => {
		return new Promise((resolve, reject) => {
			commit('set_user_info', {});
			resolve();
		});
	}
};