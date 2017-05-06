<template>
	<div class="bread">
		<strong>{{ title }}</strong>
		<el-breadcrumb separator="/" class="el-bread">
			<el-breadcrumb-item :to="{path : '/'}">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.matched">{{ item.name }}</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>

<script type="es6">
	export default {
		name : 'bread',
		data() {
			return {

			};
		},

		computed : {
			title() {
				var matched = this.$route.matched;
				var last = matched[matched.length - 1];
				var title = last.name;
				return title;
			}
		}
	};
</script>

<style scoped>
	.bread{
        height: 40px;
        line-height: 26px;
        .el-bread{
            display: inline-block;
            float: right;
            text-align: right;
            line-height: 26px;
        }
    }
</style>