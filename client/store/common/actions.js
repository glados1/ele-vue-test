export default {
	open_left_menu : ({
		commit
	}) => {
		commit('set_left_menu_flag', true);
		commit('set_left_menu_width', '190px');
	},

	close_left_menu : ({
		commit
	}) => {
		commit('set_left_menu_flag', false);
		commit('set_left_menu_width', '50px');
	}
};