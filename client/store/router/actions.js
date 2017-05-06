export default {
	set_cur_router : ({
		commit
	}, path) => {
		commit('set_cur_router', path);
	}
};