<template>
	<div class="home">
		<head-nav></head-nav>
		<div class="left-fixed-right-auto">
			<left-menu></left-menu>
			<div class="right-content">
				<div class="content" :style="{'margin-left' : leftMenuWidth}">
					<bread></bread>
					<router-view></router-view>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="es6">
	import commons from '../commons/index';
	export default {
		name : 'home',
		data() {
			return {
			
			};
		},

		created() {

		},

		computed : {
			leftMenuWidth() {
				return this.$store.state.common.leftMenuWidth;
			}
		},

		components : {
			headNav : commons.headNav,
			bread : commons.bread,
			leftMenu : commons.leftMenu
		}
	}
</script>

<style scoped>
    .content{
        margin-top: 60px;
        /*background: #f1f2f7;*/
        background: #FFF;
        padding: 16px;
    }
    .right-content{
        margin-bottom: 60px;
    }
</style>
