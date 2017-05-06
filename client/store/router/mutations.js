export default {
	set_cur_router : (state, path) => {
		state.header_cur_router = path.rootPath;
		state.left_cur_router = path.fullPath;
	}
};