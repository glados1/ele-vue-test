
export default {
	set_file_list : (state, fileList) => {
		state.fileList = fileList;
	},

	remove_file : (state, fileItem) => {
		var uid = fileItem.uid;
		var fileList = state.fileList;

		var index = -1;

		for(var i=0,len=fileList.length;i<len;i++) {
			if(fileList[i].uid == uid) {
				index = i;
				break;
			}
		}

		if(index > -1) {
			state.fileList.splice(index, 1);
		}
	},

	update_file : (state, fileItem) => {
		var uid = fileItem.uid;
		var fileList = state.fileList;

		var index = -1;

		for(var i=0,len=fileList.length;i<len;i++) {
			if(fileList[i].uid == uid) {
				index = i;
				break;
			}
		}

		if(index > -1) {
			state.fileList.splice(index, 1, fileItem);
		}
	},

	add_file : (state, fileItem) => {
		state.fileList.push(fileItem);
	},

	toggle_uploading : (state) => {
		state.uploading = !state.uploading;
	},

	set_file_uploader : (state, fileUploader) => {
		state.fileUploader = fileUploader;
	}
};