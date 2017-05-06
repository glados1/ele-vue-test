import { storage } from '../../util/index';

export default {
	remove_user_info : state => {
		state.userInfo = {};
		storage.remove('user_info');
	},

	set_user_info : (state, userInfo) => {
		state.userInfo = userInfo;
		storage.set('user_info', userInfo);
	}
};