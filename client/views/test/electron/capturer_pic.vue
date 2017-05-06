<template>
	<div class="desktop-capturer">
		这里是屏幕截图功能
	</div>
</template>

<script type="es6">
	import { desktopCapturer } from 'electron';


	export default {
		name : 'capturer_pic',
		data() {
			return {
				capturerVideoSrc : '',
				capturing : false
			};
		},

		created() {
			
		},

		methods : {
			getStream(stream) {
				var _self = this;
				this.capturerVideoSrc = URL.createObjectURL(stream);
				this.$nextTick(() => {
					_self.capturing = false;
				});
			},

			getUserMediaError(err) {
				var _self = this;
				console.log('get user media error' + err);
				this.$nextTick(() => {
					_self.capturing = false;
				});
			},

			startCapturer() {
				this.capturing = true;

				var _self = this;
	
				desktopCapturer.getSources({
					types : ['window', 'screen'],
					thumbnailSize : {width: 150, height: 150}
				}, (err, sources) => {
					if(err) {
			
						throw err;
						return;
					}

	
					for(var i=0,len=sources.length; i<len; i++) {
						var sourceItem = sources[i];
			
						if(sourceItem.name.toLowerCase().indexOf('screen') > -1) {
				
							navigator.webkitGetUserMedia({
								audio : false,
								video : {
									mandatory : {
										chromeMediaSource : 'desktop',
										chromeMediaSourceId : sourceItem.id,
										minWidth : 1280,
										maxWidth : 1280,
										minHeight : 1000,
										maxHeight : 1000
									}
								}
							}, _self.getStream, _self.getUserMediaError);
							return;
						}
					}
				});
			},

			bindEvents() {
				var _self = this;
				document.onmousemove = function() {
					if(!_self.capturing) {
						_self.startCapturer();
					}
				};
			}


		}
	};
</script>

<style scoped>
	.desktop-capturer {

	}

	.button-group{
		margin-bottom:100px;
	}

	.center{
		margin-left:8.3333333%;
		margin-bottom:50px;
	}
</style>