<template>
	<div class="list">
		<!-- 头部 -->
		<el-col :span="24">
			<!-- 删除按钮 -->
			<el-button type="danger" 
				icon="delete" :disabled="!delete_active"
				@click="removeUser()">
				删除选中	
			</el-button>

			<el-button type="primary"
				icon="edit"
				@click="showDialog('user_add')">
				添加用户
			</el-button>

			<!-- 用户查询 -->
			<el-form :model="search_data" class="demo-form-inline" :inline="true">
				<el-form-item>
					<el-input placeholder="请输入用户名" v-model="search_data.username" clear></el-input>
				</el-form-item>
				<el-form-item>
					<el-input placeholder="请输入邮箱" v-model="search_data.email" clear></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="default" @click="searchUser()">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 用户信息表格 -->
		<el-table :data="user_list" 
			border style="width:100%" align="center" 
			@selection-change="userListSelectionChange">

			<!-- 删除的 checkbox -->
			<el-table-column type="selection" width="55"></el-table-column>

			<el-table-column 
				prop="username"
				label="姓名"
				align="center"
				width="150"
				:sortable="true">
			</el-table-column>

			<el-table-column 
				prop="email"
				label="邮件"
				align="center"
				:sortable="true">
			</el-table-column>

			<el-table-column 
				prop="sex"
				label="性别"
				align="center"
				:sortable="true"
				width="130"
				:formatter="formatterSex"
				:filters="user_filter.sex_filter.filters"
				:filter-multiple="user_filter.sex_filter.multiple"
				:filter-method="filterSex">
			</el-table-column>

			<el-table-column
				label="地址"
				type="expand">
				<template scope="props">
					<p>{{ props.row.password }}</p>
				</template>
			</el-table-column>

			<el-table-column
				label="操作"
				:width="200">
				<template scope="scope">
					<el-button 
						type="info" 
						icon="edit" 
						size="mini" 
						@click="editUser(scope.row)">
					</el-button>

					<el-button
						type="edit"
						icon="edit"
						size="mini"
						@click="addTopic(scope.row)">
					</el-button>

					<el-button 
						type="danger"
						icon="delete"
						size="mini"
						@click="removeUser(scope.row)">
					</el-button>

				</template>
			</el-table-column>
		</el-table>

		<!-- dialog -->
		<el-dialog :title="dialog.current_info.title" v-model="dialog.show" size="tiny">
			<el-form style="margin:20px;width:60%;min-width:100%;padding-right:100px;position:relative;"
				label-width="100px"
				:model="dialog.current_info.type == 'user' ? dialog.current_info.user_info : dialog.current_info.topic_info"
				:rules="dialog.current_info.rules"
				:ref="dialog.current_info.ref">
				<template v-if="dialog.current_info.type == 'user'">
					<el-form-item class="edit-form"
						label="用户名"
						prop="username">
						<el-input type="text"
	                        v-model='dialog.current_info.user_info.username'></el-input>
					</el-form-item>

					<el-form-item class="edit-form"
						label="邮件"
						prop="email">
						<el-input type="text"
	                        v-model='dialog.current_info.user_info.email'></el-input>
					</el-form-item>

					<el-form-item class="edit-form"
						label="密码"
						prop="password"
						v-if="dialog.current_info.ref == 'user_add'">
						<el-input type="text"
	                        v-model='dialog.current_info.user_info.password'></el-input>
					</el-form-item>

					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="dialog.current_info.user_info.sex">
							<el-radio label="1">男</el-radio>
							<el-radio label="2">女</el-radio>
							<el-radio label="3">保密</el-radio>
						</el-radio-group>
					</el-form-item>
				</template>

				<template v-if="dialog.current_info.type=='topic'">
					<el-form-item class="edit-form"
						label="作者 id "
						prop="author_id">
						<el-input type="text"
	                        v-model='dialog.current_info.topic_info.author_id'></el-input>
					</el-form-item>

					<el-form-item class="edit-form"
						label="标题"
						prop="title">
						<el-input type="text"
	                        v-model='dialog.current_info.topic_info.title'></el-input>
					</el-form-item>

					<el-form-item class="edit-form"
						label="内容"
						prop="content">
						<el-input type="text"
	                        v-model='dialog.current_info.topic_info.content'></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="goRouter('topic_add')">详细话题创建</el-button>
					</el-form-item>
				</template>
				
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog()">取消</el-button>
				<el-button type="primary" @click="dialogSubmit(dialog.current_info.ref)">{{ dialog.current_info.type == 'user' ? '提交' : '创建' }}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script type="es6">
	import { User, Topic } from '../../../apis/index';

	export default {
		name : 'user',
		
		data() {
			return {
				user_list : [],

				// 选择删除的用户
				select_user : '',

				// 删除按钮状态
				delete_active : false,

				// 查询用户条件
				search_data : {
					username : '',
					email : ''
				},

				// 用户过滤器
				user_filter : {

					// 性别过滤器
					sex_filter : {
						filters : [
							{
								text : '男',
								value : '1'
							}, {
								text : '女',
								value : '2'
							}, {
								text : '保密',
								value : '3'
							}
						],

						multiple : false
					}
				},

				// dialog
				dialog : {
					show : false,

					user_edit : {
						type : 'user',

						title : '用户信息',
						user_info : {
							_id : '',
							username : '',
							email : '',
							sex : '3'
						},

						rules : {
							username : [{
								required : true,
								message : '用户名不可为空',
								trigger : 'blur'
							}],

							email : [{
								required : true,
								message : '邮箱不可为空',
								trigger : 'blur'
							}]
						},
						ref : 'user_edit'
					},

					user_add : {
						type : 'user',
						title : '添加用户',
						user_info : {
							_id : '',
							username : '',
							email : '',
							password : '',
							sex : '3'
						},

						rules : {
							username : [{
								required : true,
								message : '用户名不可为空',
								trigger : 'blur'
							}],

							password : [{
								required : true,
								message : '密码不可为空',
								trigger : 'blur'
							}],

							email : [{
								required : true,
								message : '邮箱不可为空',
								trigger : 'blur'
							}]
						},
						ref : 'user_add'
					},

					topic_add : {
						type : 'topic',
						title : '创建话题',

						topic_info : {
							author_id : '',
							title : '',
							content : ''
						},

						rules : {
							author_id : [{
								required : true,
								message : '作者 id 不可为空',
								trigger : 'blur'
							}],

							title : [{
								required : true,
								message : '标题不可为空',
								trigger : 'blur'
							}],

							content : [{
								required : true,
								message : '话题内容不可为空',
								trigger : 'blur'
							}]
						},

						ref : 'topic_add'
					},

					current_info : {
						type : 'user',
						title : '用户信息',
						user_info : {
							_id : '',
							username : 'default_user',
							email : 'default_email',
							sex : '3'
						},

						topic_info : {
							author_id : '',
							title : '',
							content : ''
						},

						rules : {},

						ref : 'default'
					}
				}
			};
		},

		created() {
			//this.getUserList();
		},

		activated() {
			this.getUserList();
		},


		components : {
		
		},

		methods : {
			// dialog 开启，显示不同的 dialog 类型
			showDialog(dialog_type) {
				var deepCopy = this.deepCopy;
				switch(dialog_type) {
					case 'user_edit' : 
						this.dialog.current_info = this.dialog.user_edit;
						break;
					case 'user_add' : 
						this.dialog.current_info = this.dialog.user_add;
						break;
					case 'topic_add' : 
						this.dialog.current_info = this.dialog.topic_add;
						break;
				}

				this.dialog.show = true;
			},

			hideDialog() {
				this.dialog.show = false;
			},

			editUser(data) {
				var user_info = {
					_id : data._id,
					username : data.username || '',
					email : data.email || '',
					sex : data.sex + '' || '3'
				};

				this.dialog.user_edit.user_info = user_info;

				this.showDialog('user_edit');
			},

			addTopic(data) {
				var topic_info = {
					author_id : data._id,
					title : '',
					content : ''
				};

				this.dialog.topic_add.topic_info = topic_info;

				this.showDialog('topic_add');
			},

			// 删除用户
			removeUser(data) {
				var _self = this;
				var select_user = this.select_user || '';

				if(data) {
					select_user = data._id;
				}

				User.removeUser({
					multiple : true,
					user_id : select_user
				}).then((retData) => {
					retData = retData || {};

					if(retData.code == 0) {
						_self.getUserList();
					}
				});
			},

			searchUser() {
				var _self = this;
				User.searchUser(_self.search_data)
					.then((retData) => {
						retData = retData || {};
						_self.user_list = retData.data.user_list || [];
					});
			},

			getUserList() {
				var _self = this;
				User.searchUser({}).then((retData) => {
					if(retData.code == 0) {
						var data = retData.data || {};
						var user_list = data.user_list || [];
						_self.user_list = user_list;
					}
				});
			},

			// 选中删除的 item
			userListSelectionChange(user_list) {
				user_list = user_list || [];
				if(user_list.length) {
					var delete_array = [];
					for(var i=0,len=user_list.length;i<len;i++) {
						var user_item = user_list[i];
						delete_array.push(user_item._id);
					}

					this.select_user = delete_array.join(',');

					this.delete_active = true;
				} else {
					this.delete_active = false;
				}
			},

			// 性别 formatter
			formatterSex(item) {
				var value = '';
				switch(item.sex) {
					case '1' :
						value = '男';
						break;
					case '2' : 
						value = '女';
						break;
					case '3' : 
						value = '保密';
						break;
				}

				return value;
			},

			filterSex(value, item) {
				return value == item.sex;
			},

			// 发起请求，执行修改用户信息操作
			doEditUser() {
				var user_data = this.dialog.user_edit.user_info || {};
				var _self = this;

				User.updateUser(user_data)
					.then((retData) => {
						retData = retData || {};
						if(retData.code == 0) {
							_self.getUserList();
							_self.hideDialog();
						}
					});
			},

			// 发起请求，执行添加话题操作
			doAddTopic() {
				var topic_info = this.dialog.topic_add.topic_info || {};
				var _self = this;

				Topic.addTopic(topic_info)
					.then((retData) => {
						retData = retData || {};
						if(retData.code == 0) {
							_self.hideDialog();
						}
					});
			},

			// 发起请求，执行添加用户操作
			doAddUser() {
				var user_data = this.dialog.user_add.user_info || {};
				var _self = this;
				User.addUser(user_data)
					.then((retData) => {
						retData = retData || {};
						if(retData.code == 0) {
							_self.getUserList();
							_self.hideDialog();
						}
					});
			},

			dialogSubmit(ref) {
				var _self = this;
				this.$refs[ref].validate((valid) => {
					if(valid) {
						switch(ref) {
							case 'user_edit' : 
								_self.doEditUser();
								break;
							case 'user_add' : 
								_self.doAddUser();
								break;
							case 'topic_add' : 
								_self.doAddTopic();
								break;
						}
					}
				});
			},

			doGoRouterTopicAdd() {
				var topic_info = this.dialog.topic_add.topic_info || {};
				var author_id = topic_info.author_id;

				this.$router.push({
					path : '/database/nodeclub/topic_add',
					query : {
						author_id : encodeURIComponent(author_id)
					}
				});
			},	

			goRouter(path) {
				switch(path) {
					case 'topic_add' : 
						this.doGoRouterTopicAdd();
						break;
				}

				this.hideDialog();
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