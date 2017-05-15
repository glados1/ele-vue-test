<template>
	<div class="desktop-capturer">
		<el-row>
			<el-button @click="startCapturer()">开始截图</el-button>
			<el-button @click.native="captureOk()">ok</el-button>
			<el-button @click.native="captureSave()">save</el-button>
			<el-button @click.native="captureCancel()">cancel</el-button>
			
		</el-row>
		<el-row>
			<canvas id="canvas_id"></canvas>
		</el-row>
	</div>
</template>

<script type="es6">
	import { desktopCapturer, ipcRenderer } from 'electron';
	import { capture } from '../../../util/index';

	var Capture = capture.Capture;

	export default {
		name : 'capturer_new',
		data() {
			return {
				cutImgData : null,
				captureObj : null
			};
		},

		mounted() {
			var canvasDom = document.getElementById('canvas_id');
			this.startCapturer();
			this.captureObj = new Capture({
				window : window,
				document : document,
				screen : screen,
				canvasDom : canvasDom,
				imgData : localStorage['img']
			});

			this.captureObj.initData();
		},

		methods : {
			// 确认按钮
			captureOk() {
				this.captureObj.cutDone((err, cutImg) => {
					ipcRenderer.send('cut', cutImg);
				});
			},

			// 保存按钮
			captureSave() {
				this.cutImgData = this.captureObj.cutDone();
			},

			// 取消按钮
			captureCancel() {
				this.captureObj.cutReset();
			},

			startCapturer() {
				var width = screen.width;
				var height = screen.height;
				desktopCapturer.getSources({
					types : ['screen'],
					thumbnailSize : {
						width : width,
						height : height
					}
				}, (err, sources) => {
					if(err) {
						throw err;
						return;
					}

					localStorage['img'] = sources[0].thumbnail.toDataURL();
				});
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

	.ctrl-disabled{
		opacity : 0;
		visibility: hidden;
	}
</style>