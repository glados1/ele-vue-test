<template>
	<div class="upload_task">
		<el-table :data="fileList" 
			border style="width:100%" align="center">

			<el-table-column 
				prop="name"
				label="文件名称"
				align="center"
				:width="250"
				:sortable="true">
			</el-table-column>

			<el-table-column 
				prop="size"
				label="文件大小"
				align="center"
				:width="100"
				:sortable="true">
			</el-table-column>

			<el-table-column
				prop="progress"
				label="上传进度"
				align="center">
				<template scope="scope">
					<el-progress :percentage="scope.row.progress"></el-progress>
				</template>		
			</el-table-column>

			<el-table-column
				label="操作"
				:width="100">
				<template scope="scope">

				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script type="es6">
	import { uploader } from '../../../util/index';
	import { mapGetters } from 'vuex';

	var Uploader = uploader.Uploader;

	export default {
		name : 'upload_task',

		data() {
			return {
				
			};
		},

		activated() {
			this.init();
		},

		methods : {
			init() {

				if(this.uploading) {
					return;
				}

				if(this.fileUploader) {
					this.setFileList();
					this.uploadStart();
					return;
				}

				var fileUploader = new Uploader();

				var _self = this;

				fileUploader.setUploadCallback({
					onTaskStart : (fileItem) => {
						fileItem.progress = 0;
						_self.$store.dispatch('update_file', fileItem);
					},

					onTaskFinish : (data) => {
						console.log('task finish');
					},

					onTaskProgress : (data) => {
						var fileItem = data.file;
						var progress = data.progress;
						fileItem.progress = parseInt(parseFloat(progress) * 100);
						_self.$store.dispatch('update_file', fileItem);
					},

					onTaskError : (data) => {
						console.log('task error');
						console.log(data);
					},

					onTaskSuccess : (data) => {
						var fileItem = data.file;
						fileItem.progress = 100;
	
						_self.$store.dispatch('update_file', fileItem);
					}
				});

				this.$store.dispatch('set_file_uploader', fileUploader);

				this.setFileList();
				this.uploadStart();
			},

			setFileList() {
				var fileUploader = this.fileUploader;
				var fileList = this.fileList;

				fileUploader.setFileList(fileList);
			},

			uploadStart() {
				this.$store.dispatch('toggle_uploading');
				var _self = this;
				var fileUploader = this.fileUploader;

				fileUploader.start((errorFiles, successFiles) => {
					_self.$store.dispatch('toggle_uploading');

					//_self.$store.dispatch('remove_files', successFiles);
				});
			}
		},

		components : {
			
		},

		computed : {
			...mapGetters(['fileList', 'uploading', 'fileUploader'])
		}
	};
</script>

<style scoped>
	
</style>