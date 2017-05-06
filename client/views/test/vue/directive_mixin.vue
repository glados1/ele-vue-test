<template>
	<div class="directive_mixin">
		<el-row>
			<el-col :span="24">
				<el-button @click="showMessage()">alert信息</el-button>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12" class="item">
				<el-card>
					<input v-focus="true" v-model="message_1"/>
				</el-card>
			</el-col>

			<el-col :span="12" class="item">
				<el-card>
					sdfs
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script type="es6">
	
	import { focus } from '../../../directives/index';
	//import { alert } from '../../../mixins/index';

	export default {
		name : 'directive_mixin',
		data() {
			return {
				message_1 : ''
			};
		},

		created() {
			
		},

		components : {},

		methods : {
			// 应该尽量避免重名
			showMessage() {
				if(this.message_1.length) {
					this.changeMessage(this.message_1);
				}

				this.alertMessage();
			}
		},

		directives : {
			focus
		},

		mixins : []
	};
</script>

<style scoped>

	.item {
		padding : 20px 10px;
	}


</style>