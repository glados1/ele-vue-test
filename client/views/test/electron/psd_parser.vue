<template>
	<div class="psd-parser">
		<div class="form">
			<el-form
				style="width:80%"
				label-width="180px"
				:model="form.psd_parser.data"
				:rules="form.psd_parser.rules"
				:ref="form.psd_parser.ref">

				<el-form-item label="psd 文件" prop="input_file">
					<el-upload
						action="http://127.0.0.1:4000"
						:on-change="handleFileChange"
						:file-list="form.psd_parser.data.input_file"
						:auto-upload="false">
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>

				<el-form-item label="输出文件路径" prop="output_path">
					<el-input v-model="form.psd_parser.data.output_path" placeholder="输出文件路径"></el-input>
				</el-form-item>

				<el-form-item label="输出文件名称" prop="output_name">
					<el-input v-model="form.psd_parser.data.output_name" placeholder="输出文件名称"></el-input>
				</el-form-item>
			</el-form>

			<div class="footer-button">
				<el-button @click="formReset(form.psd_parser.ref)">重置</el-button>
				<el-button type="primary" @click="formSubmit(form.psd_parser.ref)">开始转换</el-button>
			</div>
		</div>
	</div>
</template>

<script type="es6">
	import PSD from 'psd-parser';
	import Async from 'async';

	export default {
		name : 'psd_parser',

		data() {
			return {
				form : {
					psd_parser : {
						data : {
							input_file : [],
							output_path : '',
							output_name : ''
						},

						ref : 'psd_parser',

						rules : {
							input_file : [{
								required : true,
								message : '输入的 psd 文件不可为空'
							}],

							output_path : [{
								required : true,
								message : '输出的路径不可为空'
							}],

							output_name : [{
								required : false,
								message : '输出的文件名不可为空'
							}]
						}
					}
				}
			};
		},

		created() {
			
		},

		methods : {
			handleFileChange(file, filelist) {
				this.form.psd_parser.data.input_file = filelist;
				console.log(this.form.psd_parser.data.input_file);
			},

			formSubmit(ref) {
				var _self = this;
				this.$refs[ref].validate((valid) => {
					if(valid) {
						switch(ref) {
							case 'psd_parser' :
								_self.doPsdParserSubmit();
								break;
						}
					}
				});	
			},

			doPsdParserSubmit() {
				var data = this.form.psd_parser.data;
				var input_file = data.input_file;
				var output_path = data.output_path;
				
				var output_name_list = data.output_name.split(',');
				var output_name_list_length = output_name_list.length;

				var task_list = [];

				for(var i=0,len=input_file.length;i<len;i++) {
					var output_location = output_path + '/' + input_file[i].name + '.png';

					if(i<output_name_list_length && output_name_list[i].length) {
						var output_name = output_name_list[i];
						output_location = output_path + '/' + output_name + '.png';
					}

					var task_item = {
						input_file : input_file[i],
						output_location : output_location
					};

					task_list.push(task_item);
				}

				var psd2png = this.psd2png;

				Async.mapLimit(task_list, 1, psd2png, function(errs, datas) {
					if(errs) {
						return errs;
					}

					return datas;
				});
			},

			psd2png(data, callback) {
				setTimeout(() => {
					var input_file = data.input_file;
					var output_location = data.output_location;

					var file = input_file.raw;
					var psd = PSD.parse(file.path);
					psd.getDescendants();
					psd.getTree();

					psd.saveAsPng(output_location);

					psd = null;

					process.nextTick(() => {
						console.log('done');
						callback(null, {
							status : 'success'
						});
					});
				}, 500);

			},

			formReset(ref) {
				this.$refs[ref].resetFields();
			}
		}
	};
</script>

<style scoped>
	.form {
		margin-top:50px;
	}

	.footer-button{
		text-align:right;
		width:80%;
	}
</style>