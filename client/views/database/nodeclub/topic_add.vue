<template>
	<div class="form">
		<el-form
			style="width:80%"
			label-width="100px"
			:model="form.topic_add.topic_info"
			:rules="form.topic_add.rules"
			:ref="form.topic_add.ref">
			<el-form-item class="edit-form" label="作者 id " prop="author_id">
				<el-input v-model="form.topic_add.topic_info.author_id" placeholder="请输入作者 id "></el-input>
			</el-form-item>

			<el-form-item class="edit-form" label="标题" prop="title">
				<el-input v-model="form.topic_add.topic_info.title" placeholder="请输入标题"></el-input>
			</el-form-item>

			<el-form-item class="edit-form" label="内容" prop="content">
				<el-input v-model="form.topic_add.topic_info.content" placeholder="请输入内容" type="textarea" :rows="12"></el-input>
			</el-form-item>

		</el-form>

		<div class="footer-button">
			<el-button @click="formReset(form.topic_add.ref)">重置</el-button>
			<el-button type="primary" @click="formSubmit(form.topic_add.ref)">发布话题</el-button>
		</div>
	</div>
</template>

<script type="es6">
	import { Topic } from '../../../apis/index';

	export default {
		name : 'topic_add',
		
		data() {
			return {
				form : {
					topic_add : {
						topic_info : {
							author_id : '',
							title : '',
							content : ''
						},

						ref : 'topic_add',

						rules : {
							author_id : [{
								required : true,
								message : '用户 id 不可为空',
								trigger : 'blur'
							}],

							title : [{
								required : true,
								message : '标题不可为空',
								trigger : 'blur'
							}],

							content : [{
								required : true,
								message : '内容不可为空',
								trigger : 'blur'
							}]
						}
					}
				}
			};
		},

		created() {
			
		},

		activated() {
			this.getAuthorId();
		},


		components : {
		
		},

		methods : {	
			getAuthorId() {
				var query = this.$route.query || {};
				var author_id = query.author_id || '';

				this.form.topic_add.topic_info.author_id = author_id;
			},

			formReset(ref) {
				this.$refs[ref].resetFields();
			},

			formSubmit(ref) {
				var _self = this;
				this.$refs[ref].validate((valid) => {
					if(valid) {
						switch(ref) {
							case 'topic_add' : 
								_self.doAddTopic();
								break;
						}
					}
				});
			},

			doAddTopic() {
				var _self = this;
				var topic_info = this.form.topic_add.topic_info || {};
				Topic.addTopic(topic_info)
					.then((retData) => {
						retData = retData || {};
						if(retData.code == 0) {
							_self.goRouter('topic');
						}
					});
			},

			goRouter(path) {
				switch(path) {
					case 'topic' : 
						this.doGoRouterTopic();
						break;
				}
			},

			doGoRouterTopic() {
				var topic_info = this.form.topic_add.topic_info || {};
				this.$router.push({
					path : '/database/nodeclub/topic',
					query : {
						author_id : topic_info.author_id || '',
						title : topic_info.title || ''
					}
				});
			}
		}
	};

</script>

<style scoped>
	.footer-button{
		text-align:right;
		width:80%;
	}
</style>