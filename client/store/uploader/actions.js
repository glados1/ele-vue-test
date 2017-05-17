export default {
	set_file_list : ({
		commit
	}, fileList) => {
		commit('set_file_list', fileList);
	},

	remove_file : ({
		commit
	}, fileItem) => {
		commit('remove_file', fileItem);
	},

	remove_files : ({
		commit
	}, fileList) => {
		for(var i=0,len=fileList.length;i<len;i++) {
			commit('remove_file', fileList[i]);
		}
	},

	add_file : ({
		commit
	}, fileItem) => {
		commit('add_file', fileItem);
	},

	toggle_uploading : ({
		commit
	}) => {
		commit('toggle_uploading');
	},

	set_file_uploader : ({
		commit
	}, fileUploader) => {
		commit('set_file_uploader', fileUploader);
	},

	update_file : ({
		commit
	}, fileItem) => {
		commit('update_file', fileItem);
	}
};