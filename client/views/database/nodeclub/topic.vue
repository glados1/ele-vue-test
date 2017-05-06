<template>
	<div class="list">
		<!-- 头部 -->
		<el-col :span="24">
			<!-- 删除按钮 -->
			<el-button type="danger" 
				icon="delete" :disabled="!delete_active"
				@click="removeTopic()">
				删除选中	
			</el-button>

			<!-- 用户查询 -->
			<el-form :model="search_data" class="demo-form-inline" :inline="true">
				<el-form-item>
					<el-input placeholder="请输入标题" v-model="search_data.title" clear></el-input>
				</el-form-item>
				<el-form-item>
					<el-input placeholder="请输入作者 id " v-model="search_data.author_id" clear></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="default" @click="searchTopic()">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 用户信息表格 -->
		<el-table :data="topic_list" 
			border style="width:100%" align="center" 
			@selection-change="topicListSelectionChange">

			<!-- 删除的 checkbox -->
			<el-table-column type="selection" width="55"></el-table-column>

			<el-table-column 
				prop="title"
				label="标题"
				align="center"
				width="150"
				:sortable="true">
			</el-table-column>

			<el-table-column 
				prop="author_id"
				label="作者 id "
				align="center"
				:sortable="true">
			</el-table-column>

			<el-table-column
				label="操作"
				:width="200">
				<template scope="scope">
					<el-button 
						type="info" 
						icon="edit" 
						size="mini" 
						@click="editTopic(scope.row)">
					</el-button>

					<el-button 
						type="danger"
						icon="delete"
						size="mini"
						@click="removeTopic(scope.row)">
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- dialog -->
		<el-dialog :title="dialog.current_info.title" v-model="dialog.show" size="tiny">
			<el-form style="margin:20px;width:60%;min-width:100%;padding-right:100px"
				label-width="100px"
				:model="dialog.current_info.topic_info"
				:rules="dialog.current_info.rules"
				:ref="dialog.current_info.ref">
				<el-form-item class="edit-form"
					label="标题"
					prop="title">
					<el-input type="text"
                        v-model='dialog.current_info.topic_info.title'></el-input>
				</el-form-item>

				<el-form-item class="edit-form"
					label="作者 id "
					prop="author_id">
					<el-input type="text"
                        v-model='dialog.current_info.topic_info.author_id'></el-input>
				</el-form-item>

			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog()">取消</el-button>
				<el-button type="primary" @click="dialogSubmit(dialog.current_info.ref)">修改</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script type="es6">
	import { Topic } from '../../../apis/index';

	export default {
		name : 'topic',
		
		data() {
			return {
				topic_list : [],

				// 选择删除的用户
				select_topic : '',

				// 删除按钮状态
				delete_active : false,

				// 查询用户条件
				search_data : {
					title : '',
					author_id : ''
				},

				// 话题过滤器
				topic_filter : {

				},

				// dialog
				dialog : {
					show : false,

					topic_edit : {
						title : '话题信息',
						topic_info : {
							_id : '',
							title : '',
							author_id : ''
						},

						rules : {
							title : [{
								required : true,
								message : '话题名称不可为空',
								trigger : 'blur'
							}],

							author_id : [{
								required : true,
								message : '作者 id 不可为空',
								trigger : 'blur'
							}]
						},
						ref : 'topic_edit'
					},

					

					current_info : {
						title : '话题信息',
						topic_info : {
							_id : '',
							title : 'default_title',
							author_id : 'default_author_id'
						},

						rules : {},

						ref : 'default'
					}
				}
			};
		},

		created() {
			
		},

		activated() {
			this.getTopicList();
		},


		components : {
		
		},

		methods : {
			// dialog 开启，显示不同的 dialog 类型
			showDialog(dialog_type) {
				switch(dialog_type) {
					case 'topic_edit' : 
						this.dialog.current_info = this.dialog.topic_edit;
						break;
					case 'topic_add' : 
						
						break;
				}

				this.dialog.show = true;
			},

			hideDialog() {
				this.dialog.show = false;
			},

			editTopic(data) {
				var topic_info = {
					_id : data._id,
					title : data.title || '',
					author_id : data.author_id || ''
				};

				this.dialog.topic_edit.topic_info = topic_info;

				this.showDialog('topic_edit');
			},

			// 删除用户
			removeTopic(data) {
				var _self = this;
				var select_topic = this.select_topic || '';

				if(data) {
					select_topic = data._id;
				}

				Topic.removeTopic({
					multiple : true,
					topic_id : select_topic
				}).then((retData) => {
					retData = retData || {};

					if(retData.code == 0) {
						_self.getTopicList();
					}
				});
			},

			searchTopic() {
				var _self = this;
				Topic.searchTopic(_self.search_data)
					.then((retData) => {
						retData = retData || {};
						_self.topic_list = retData.data.topic_list || [];
					});
			},

			getTopicList() {
				var _self = this;
				var query = this.$route.query || {};

				this.search_data.title = query.title || '';
				this.search_data.author_id = query.author_id || '';

				Topic.searchTopic(query).then((retData) => {
					if(retData.code == 0) {
						var data = retData.data || {};
						var topic_list = data.topic_list || [];
						_self.topic_list = topic_list;
					}
				});
			},

			// 选中删除的 item
			topicListSelectionChange(topic_list) {
				topic_list = topic_list || [];
				if(topic_list.length) {
					var delete_array = [];
					for(var i=0,len=topic_list.length;i<len;i++) {
						var topic_item = topic_list[i];
						delete_array.push(topic_item._id);
					}

					this.select_topic = delete_array.join(',');

					this.delete_active = true;
				} else {
					this.delete_active = false;
				}
			},


			// 发起请求，执行修改用户信息操作
			doEditTopic() {
				var topic_data = this.dialog.topic_edit.topic_info || {};
				var _self = this;

				Topic.updateTopic(topic_data)
					.then((retData) => {
						retData = retData || {};
						if(retData.code == 0) {
							_self.getTopicList();
							_self.hideDialog();
						}
					});
			},

			dialogSubmit(ref) {
				var _self = this;
				this.$refs[ref].validate((valid) => {
					if(valid) {
						switch(ref) {
							case 'topic_edit' : 
								_self.doEditTopic();
								break;
							case 'topic_add' : 
								
								break;
						}
					}
				});
			}


		}
	};

</script>

<style scoped>
	.demo-form-inline{
        display: inline-block;
        float: right;
    }
    .btm-action{
        margin-top: 20px;
        text-align: center;
    }
    .actions-top{
        height: 46px;
    }
    .pagination{
        display: inline-block;
    }
</style>