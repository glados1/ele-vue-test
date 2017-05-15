<template>
	<div class="free_share">
		<el-card id="upload_box">
			<el-upload
				action="http://127.0.0.1:4000"
				list-type="picture-card"
				:on-preview="handlePictureCardPreview"
				:on-remove="handleRemove"
				:auto-upload="false"
				:on-change="handleChange">
				<i class="el-icon-plus"></i>
			</el-upload>
			<el-dialog v-model="dialogVisible" size="tiny">
				<img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>
		</el-card>
		<el-card id="files_box">
			<div v-for="(item, index) in files" class="bottom_line">
				<el-row>
					<el-col :span="12">
						<canvas :id="'qrcode-' + item.name" width="200" height="200" class="vertical-align"></canvas> 
						<el-button @click="copyUrl(item.url)" class="vertical-align">复制 url </el-button>
					</el-col>
				</el-row>
			</div>
		</el-card>
	</div>
</template>

<script type="es6">

	import { file_server } from '../../../util/index';
	import { clipboard } from 'electron';

	import path from 'path';
	import fs from 'fs';
	import mkdirp from 'mkdirp';
	import xdgBasedir from 'xdg-basedir';
	import os from 'os';
	import QRCode from 'qrcode';

	var FileServer = file_server.FileServer;

	var fileServer = new FileServer();

	var configDir = null;

	export default {
		data() {
			return {
				dialogImageUrl: '',
        		dialogVisible: false,
        		filelist :[],
        		files : []
			};
		},

		mounted() {
			this.init();
		},

		components : {
			
		},
		
		methods : {
			init() {
				this.initConfigDir();
			},

			initConfigDir() {
				configDir = path.join(xdgBasedir.config || path.join(os.tmpdir(), '.config'), 'freeshare');

				var _self = this;

				mkdirp(configDir, (err) => {
					if(err) {
						return console.log(err);
					}

					_self.initFileServer(() => {
						console.log('make dir success');
					});
				});
			},

			initFileServer(cb) {
				var _self = this;
				fs.readFile(path.join(configDir, 'config.json'), (err, data) => {
					if(err) {
						console.log(err);
						data = '{}';
					}

					var config = JSON.parse(data);
					
					fileServer.setConfig(config);
				
					fs.writeFile(path.join(configDir, 'config.json'), JSON.stringify(fileServer.config), () => {

						fileServer.start(() => {
							console.log(11111);
							_self.getFileList();

							cb();

						});
					});
				});
			},

			getFileList() {
				var files = [];
		
				fileServer.forEachFile((fileInfo) => {
					files.push(fileInfo);
				});

				this.files = files;

				this.qrcodeFiles();
			},

			addFile(file, cb) {
				var rawFile = file.raw;
				var filepath = rawFile.path;
				fileServer.addFile(filepath, cb);
			},

			removeFile(file, cb) {
				var rawFile = file.raw;
				var filename = rawFile.name;
				fileServer.removeFile(filename, cb);
				
			},

			handleRemove(file, filelist) {
				var _self = this;
				this.filelist = filelist;
				this.removeFile(file, () => {
					_self.getFileList();
				});
			},

			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},

			handleChange(file, filelist) {
				var _self = this;
				this.filelist = filelist;
				this.addFile(file, () => {
					_self.getFileList();
				});
			},

			copyUrl(url) {
				clipboard.writeText(url);
			},

			qrcodeFiles() {
				var files = this.files;
				this.$nextTick(() => {
					for(var i=0,len=files.length;i<len;i++) {
						var fileItem = files[i];
						var filename = fileItem.name;
						var fileUrl = fileItem.url;
						var canvasDom = document.getElementById('qrcode-' + filename);

						QRCode.toCanvas(canvasDom, fileUrl, (err) => {
							if(err) {
								return console.log(err);
							}

							console.log(filename + ' is qrcode success');
						});
					}
				});
			}

		}
	};
</script>

<style scoped>
	.free_share {
		padding-top:50px;
	}

	#files_box {
		margin-top:50px;
	}

	.vertical-align {
		vertical-align: middle;
	}

	.bottom_line {
		border-bottom: 2px solid #ddd;
	}
</style>