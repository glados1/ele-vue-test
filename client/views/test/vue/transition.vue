<template>
	<div class="transition">
		<div class="button-group">
			<el-button @click="simpleTransition()">简易过渡</el-button>
			<el-button @click="customerClassTransition()">自定义类名</el-button>
			<el-button @click="listTransition('add')">列表过渡（增加）</el-button>
			<el-button @click="listTransition('remove')">列表过渡（减少）</el-button>
			<el-button @click="listTransition('shuffle')">列表过渡（shuffle）</el-button>
			<el-button @click="listSudoTransition()">shuffle sudo</el-button>
		</div>

		<div class="content">
			<el-row>
				<el-col :span="12" class="item">
					<el-card>
					<!-- 注意，这里不可以用 transtion 组件，要用 transition-group 组件，否则会导致递归 -->
						<transition-group name="bounce" tag="div">
							<div  v-if="transition_sample.simple_transition.show" :key="1">
								this is simple_transition
							</div>
						</transition-group>
					</el-card>
				</el-col>

				<el-col :span="12" class="item">
					<el-card>
						<transition-group name="customer-animate" tag="div"
							enter-active-class="animated tada"
							leave-active-class="animated bounceOutRight">
							<div v-if="transition_sample.customer_class.show" :key="1">
								this is customer_transition
							</div>
						</transition-group>
					</el-card>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="12" class="item">
					<el-card>
						<transition-group name="list" tag="div">
							<div v-for="item in transition_sample.list_transition.list"
							:key="item.key" class="list-item">
								{{ item.value }}
							</div>
						</transition-group>
					</el-card>
				</el-col>

				<el-col :span="12" class="item">
					<el-card>
						<transition-group name="list-sudo" tag="div" class="container">
							<div v-for="item in transition_sample.list_sudo.list"
							:key="item.key" class="list-sudo">
								{{ item.value }}
							</div>
						</transition-group>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script type="es6">
	//import _ from '../../../../static/libs/lodash/lodash';
	import '../../../../static/libs/lodash/lodash';

	export default {
		name : 'transition',
		data() {
			return {
				transition_sample : {
					// 简易过渡
					simple_transition : {
						show : true
					},

					customer_class : {
						show : true
					},

					list_transition : {
						show : true,
						next_number : 6,
						list : []
					},

					list_sudo : {
						show : true,
						list : []
					}
				}
			};
		},

		created() {
			var list = [];
			for(var i=0;i<81;i++) {
				var item = {
					key : i + 1,
					value : i + 1
				};

				list.push(item);
			}

			this.transition_sample.list_transition.list = list;
			this.transition_sample.list_sudo.list = list;
		},

		methods : {
			simpleTransition() {
				var show = this.transition_sample.simple_transition.show;
				this.transition_sample.simple_transition.show = !show;
			},

			customerClassTransition() {
				var show = this.transition_sample.customer_class.show;
				this.transition_sample.customer_class.show = !show;
			},

			getRandomIndex(len) {
				return Math.floor(Math.random() * len);
			},

			listTransition(action) {
				if(action == 'add') {
					var next_number = this.transition_sample.list_transition.next_number;
					this.transition_sample.list_transition.next_number ++ ;
					var len = this.transition_sample.list_transition.list.length;
					var random_index = this.getRandomIndex(len);
					this.transition_sample.list_transition.list.splice(random_index, 0, {
						key : next_number,
						value : next_number
					});
				} else if(action == 'remove'){
					var len = this.transition_sample.list_transition.list.length;
					var random_index = this.getRandomIndex(len);
					this.transition_sample.list_transition.list.splice(random_index, 1);
				} else {
					this.transition_sample.list_transition.list = _.shuffle(this.transition_sample.list_transition.list);
				}
			},

			listSudoTransition() {
				this.transition_sample.list_sudo.list = _.shuffle(this.transition_sample.list_sudo.list);
			}
		}
	};
</script>

<style scoped>
	.button-group {
		margin-bottom:20px;
	}

	.item {
		padding : 20px 10px;
	}




	/**
	*	bounce 动画过渡	
	*/

	.bounce-enter-active {
		animation: bounce-in .5s;
	}
	.bounce-leave-active {
		animation: bounce-out .5s;
	}
	@keyframes bounce-in {
		0% {
			transform: scale(0);
		}
		50% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes bounce-out {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(0);
		}
	}


	/**
	*	list 动画过渡
	*/

	.list-item {
		//transition : all 1s;
		display:inline-block;
		margin-right:10px;
	}

	.list-enter-active,
	.list-leave-active {
		transition : all 1s;
	}

	.list-enter,
	.list-leave-active {
		transform : translateY(30px);
		opacity : 0;
	}

	.list-leave-active{
		position : absolute;
	}

	.list-move {
		transition : transform 1s;
	}

	.container{
		display: flex;
		flex-wrap: wrap;
		width: 238px;
		margin-top: 10px;
	}

	.list-sudo {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 25px;
		height: 25px;
		border: 1px solid #aaa;
		margin-right: -1px;
		margin-bottom: -1px;
	}
	.list-sudo:nth-child(3n) {
		margin-right: 0;
	}
	.list-sudo:nth-child(27n) {
		margin-bottom: 0;
	}
	.list-sudo-move {
		transition: transform 1s;
	}
</style>