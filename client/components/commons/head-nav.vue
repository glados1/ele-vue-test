<template>
	<div class="head-nav">
		<el-row>
			<!-- 个人头像部分 -->
			<el-col :span="4" class="logo-container">
				<img src="../../../static/assets/logo-sm.png" class="logo" alt=""/>
			</el-col>

			<!-- 顶部一级菜单导航 -->
			<el-col :span="16">
				<el-menu 
					theme="dark"
					mode="horizontal"
					class="el-menu-demo"
					:default-active="header_cur_router"
					unique-opened router>
					<el-menu-item
						v-for="(item, index) in $router.options.routes"
						v-if="!item.hidden"
						:index="item.path">
						{{ item.name }}		
					</el-menu-item>
				</el-menu>
			</el-col>

			<!-- 功能选项和退出登录 -->
			<el-col :span="4" class="userinfo">
				<span class="username">
					<el-dropdown tirgger="click" @command="dropdownCommand">
						<span class="el-dropdown-link">
							{{ username }}<i class="el-icon-caret-bottom el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="info">修改信息</el-dropdown-item>
							<el-dropdown-item command="system">系统设置</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</span>
				<i class="fa fa-sign-out logout" @click='logout()'></i>
			</el-col>
		</el-row>
	</div>
</template>

<script type="es6">
	export default {
		name : 'head-nav',
		data() {
			return {
				username : 'wjh'
			};
		},

		methods : {
			dropdownCommand(command) {
				if(command == 'info') {
					console.log('info');
				} else if(command == 'system') {
					console.log('system');
				}
			},

			logout() {
				this.$store.dispatch('user_logout', {})
					.then(() => {
						this.$router.push({
							path : '/login'
						});
					});
			}
		},

		computed : {
			header_cur_router() {
				return this.$route.matched[0].path;
			}
		}
	};
</script>

<style scoped>
	.logo-container{
        height: 60px;
    }
    .logo{
        height: 50px;
        width: auto;
        margin-left: 10px;
        margin-top: 5px;
    }
    .fa-user{
        position: relative;
        top:-2px;
        margin-right: 4px;
    }
    .head-nav{
        width:100%;
        height: 60px;
        background: #324057;
        position: fixed;
        top:0px;
        left:0px;
        z-index: 999;
        color:#FFF;
        border-bottom: 1px solid #1F2D3D;

        .logout{
            width:60px;
            height: 60px;
            line-height: 60px;
            text-align: center;
            float: right;
            cursor: pointer;
        }
    }
    .userinfo{
        text-align: right;
    }
    .username{
        height: 60px;
        line-height: 60px;
        cursor: pointer;

        .el-dropdown{
            color:#FFF;
        }
    }
</style>