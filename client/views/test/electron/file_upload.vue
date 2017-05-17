<template>
	<div class="file_upload">
		<div class="button_group">
			<el-button @click="fileUpload()" :disabled="uploading">开始上传</el-button>
		</div>

		<div class="upload_box">
			<el-upload
				:disabled="uploading"
				:drag="true"
				action="http://127.0.0.1:4000"
				:multiple="true"
				:on-preview="handlePreview"
				:on-remove="handleRemove"
				:auto-upload="false"
				:on-change="handleChange"
				:file-list="fileList">
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
		</div>
	</div>
</template>

<script type="es6">
	import { mapGetters } from 'vuex';

	export default {
		name : 'file_upload',

		data() {
			return {
				fileList : []
			};
		},

		created() {
			this.init();
		},

		methods : {
			fileUpload() {
				var fileList = this.fileList;
				var rawFileList = [];

				fileList.forEach((fileItem) => {
					rawFileList.push(fileItem.raw);
				});

				this.$store.dispatch('set_file_list', rawFileList);
				this.fileList = [];

				this.$router.push({
					path : '/test/electron/upload_task'
				});
			},

			handlePreview(file) {
				
			},

			handleRemove(file, fileList) {
				this.fileList = fileList;
			},

			handleChange(file, fileList) {
				this.fileList = fileList;
			},

			init() {
				
			}
		},

		components : {
			
		},

		computed : {
			...mapGetters(['uploading'])
		}
	};
</script>

<style scoped>
	.file_upload {
		
	}

	.button_group{
		margin-bottom: 50px;
	}

	.upload_box{

	}
</style>