<template>
	<div id="app" class="container">
		<div class="main">
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</div>
	</div>
</template>

<script type="es6">
	export default {
		name : 'app',
		components : {
			
		}
	};
</script>

<style type="text/css">
	
</style>