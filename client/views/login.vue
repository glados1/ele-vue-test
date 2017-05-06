<template>
	<div class="login" :style="style.login_style">
        <el-row>
            <el-col :span="24">
                <div class="content">
                    <el-form
                        label-position="left" label-width="0px" class="demo-ruleForm card-box loginform"
                        v-loading="form.user_login.disabled"
                        element-loading-text="正在登陆..."
                        :style="style.form_style"
                        :model="form.user_login.user_info"
                        :rules="form.user_login.rules"
                        :ref="form.user_login.ref">
                        <h3 class="title">登陆系统</h3>
                        <el-form-item prop="username">
                            <el-input type="text" auto-complete="off" placeholder="账号" v-model="form.user_login.user_info.username" @keyup.native.enter="formSubmit(form.user_login.ref)"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" auto-complete="off" placeholder="密码" v-model="form.user_login.user_info.password" @keyup.native.enter="formSubmit(form.user_login.ref)"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="formSubmit(form.user_login.ref)">登陆</el-button>
                            <el-button @click="formReset(form.user_login.ref)">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script type="es6">
    //import { User } from '../apis/index';

	export default {
		name : 'login',
		
		data() {
			return {
				form : {
                    user_login : {
                        ref : 'user_login',
                        user_info : {
                            username : '',
                            password : ''
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
                            }]
                        },

                        disabled : false
                    }
                },

                style : {
                    login_style : {
                        width : '',
                        height : ''
                    },

                    form_style : {
                        position : 'absolute',
                        left : '',
                        top : ''
                    }
                }
			};
		},

        created() {
            this.setSize();
            var _self = this;
            window.onresize = () => {
                _self.setSize();
            };
        },


		components : {
		
		},

		methods : {
            setSize() {
                this.style.login_style.width = (window.innerWidth || document.body.clientWidth) + 'px';
                this.style.login_style.height = (window.innerHeight || document.body.clientHeight) + 'px';
                this.style.form_style.left = (parseInt(this.style.login_style.width)/2 - 175) + 'px';
                this.style.form_style.top = (parseInt(this.style.login_style.height)/2 - 178) + 'px';
            },

            formSubmit(ref) {
                var _self = this;
                this.$refs[ref].validate((valid) => {
                    if(valid) {
                        switch(ref) {
                            case 'user_login' :
                                _self.doUserLogin();
                                break;
                        }
                    }
                });
            },

            formReset(ref) {
                this.$refs[ref].resetFields();
            },

            doUserLogin() {
                var _self = this;
                var user_info = this.form.user_login.user_info || {};
                this.form.user_login.disabled = true;
                User.login(user_info)
                    .then((retData) => {
                    	this.form.user_login.disabled = false;
                        retData = retData || {};
                        if(retData.code == 0) {
                            _self.loginSuccess();
                        }
                    });
            },

            loginSuccess() {
                this.$router.push({
                    path : '/database/nodeclub/user'
                });
            }
		}
	};

</script>

<style scoped>
	.login{
        background: #1F2D3D;

        .card-box {
            box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
            -webkit-border-radius: 5px;
            border-radius: 5px;
            -moz-border-radius: 5px;
            background-clip: padding-box;
            margin-bottom: 20px;
            background-color: #F9FAFC;
            border: 2px solid #8492A6;
        }

        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }

         .loginform {
            width: 350px;
            padding: 35px 35px 15px 35px;
        } 
    }
</style>