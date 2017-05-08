<template>
	<div class="desktop-capturer">
		<el-row>
			<el-button @click="startCapturer()">开始截图</el-button>
			<el-button @click.native="captureOk()">ok</el-button>
			<el-button @click.native="captureSave()">save</el-button>
			<el-button @click.native="captureCancel()">cancel</el-button>
			<div :class="{'ctrl-disabled' : ctrlDisabled}">ctrl</div>
		</el-row>
		<el-row>
			<canvas id="canvas_id"></canvas>
		</el-row>
	</div>
</template>

<script type="es6">
	import { desktopCapturer, ipcRenderer } from 'electron';


	export default {
		name : 'capturer_pic',
		data() {
			return {
				screen : {
					width : '',
					height : ''
				},

				cutMove : {
					startX : 0,
					endX : 0,
					startY : 0,
					endY : 0,
					offsetX : 0,
					offsetY : 0
				},

				ctrlDisabled : false,

				isClean : true,

				isTouched : false,

				canvas : {
					dom : null,
					ctx : null,
					width : 0,
					height : 0
				},

				shadowCanvas : {
					first : null,
					second : null
				},

				imgData : localStorage['img'],

				cutImgData : null,

				ftpHandler : null,

				frameTimer : null
			};
		},

		mounted() {
			this.initData();
		},

		methods : {
			// 确认按钮
			captureOk() {
				this.cutImgData = this.getCutData();
				this.cut();
			},

			// 保存按钮
			captureSave() {
				this.cutImgData = this.getCutData();
				this.saveToFS();
			},

			// 取消按钮
			captureCancel() {
				this.cutImgData = this.getCutData();
				this.cutImgData ? this.resetCut() : this.close();
			},

			initData() {
				

				var ftpHandler = {
					lastTime: 0,
					check: function (fps) {
						var time = +new Date(),
								result = false
						fps = fps || 60
						if (!this.lastTime) {
							this.lastTime = time
						} else {
							if (time - this.lastTime >= 1000 / fps) {
								this.lastTime = time
								result = true
							}
						}
						return result
					}
				};

				this.ftpHandler = ftpHandler;

				var _self = this;
				this.screen.width = screen.width;
				this.screen.height = screen.height;

				var canvasDom = document.getElementById('canvas_id');

				var position = canvasDom.getBoundingClientRect();

				this.cutMove.offsetX = position.left;
				this.cutMove.offsetY = position.top;

				this.canvas.dom = canvasDom;
				this.canvas.ctx = canvasDom.getContext('2d');
				this.canvas.width = document.body.clientWidth;
				this.canvas.height = document.body.clientHeight;
				canvasDom.width = this.canvas.width;
				canvasDom.height = this.canvas.height;
				this.canvas.ctx.fillStyle = '#000';

				var shadowCanvas_1 = document.createElement('canvas');
				shadowCanvas_1.width = this.canvas.width;
				shadowCanvas_1.height = this.canvas.height;
				var ctx_1 = shadowCanvas_1.getContext('2d');
				this.shadowCanvas.first = {
					ctx : ctx_1,
					dom : shadowCanvas_1
				};

				var shadowCanvas_2 = document.createElement('canvas');
				shadowCanvas_2.width = this.canvas.width;
				shadowCanvas_2.height = this.canvas.height;
				var ctx_2 = shadowCanvas_2.getContext('2d');
				ctx_2.fillStyle = 'rgba(0, 0, 0, 0.6)';
				this.shadowCanvas.second = {
					ctx : ctx_2,
					dom : shadowCanvas_2
				};

				var img = new Image();

				function loaded() {
					ctx_1.drawImage(img, 0, 0);
					img.onload = null;
					img = null;
					_self.draw();
					_self.run();
				}

				img.onload = loaded;

				img.src = this.imgData;

				this.bindEvents();
			},

			startCapturer() {
				var width = this.screen.width;
				var height = this.screen.height;
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
			},

			// 获取截图裁剪数据
			getCutData() {
				if(this.isClean) {
					return null;
				} 

				var startX = this.cutMove.startX;
				var startY = this.cutMove.startY;
				var endX = this.cutMove.endX;
				var endY = this.cutMove.endY;

				var width = Math.abs(startX - endX);
				var height = Math.abs(startY - endY);
				var x = Math.min(startX, endX);
				var y = Math.min(startY, endY);

				return {
					x : x,
					y : y,
					width : width,
					height : height
				};
			},

			// 重新裁剪
			resetCut() {
				this.isClean = true;
				this.draw();
			},

			close() {
				console.log('正在关闭...');
			},

			// 开始捕捉画面并绘制
			draw() {
				this.drawOriginImage();
				this.drawCutRect();
			},

			cut() {
				this.ctrlDisabled = !this.ctrlDisabled;
				var cutImgData = this.cutImgData;
				ipcRenderer.send('cut', cutImgData);
			},

			saveToFS() {
				this.ctrlDisabled = !this.ctrlDisabled;
				var cutImgData = this.cutImgData;
				ipcRenderer.send('save-to-fs', cutImgData);
			},

			// 捕捉并绘制原图
			drawOriginImage() {
				var ctx = this.canvas.ctx;
				var width = this.canvas.width;
				var height = this.canvas.height;
				var shadowCanvas_1 = this.shadowCanvas.first.dom;
				ctx.clearRect(0, 0, width, height);
				ctx.drawImage(shadowCanvas_1, 0, 0);
			},


			bindEvents() {
				var canvas = this.canvas.dom;
				var canvasMouseDown = this.cuttingStart;
				var documentMouseMove = this.cuttingMove;
				var documentMouseUp = this.cuttingEnd;
				canvas.addEventListener('mousedown', canvasMouseDown);
				document.addEventListener('mousemove', documentMouseMove);
				document.addEventListener('mouseup', documentMouseUp);
			},

			cuttingStart(event) {
				this.isTouched = true;
				this.isClean = false;
				this.cutMove.startX = this.cutMove.endX = event.clientX - this.cutMove.offsetX;
				this.cutMove.startY = this.cutMove.endY = event.clientY - this.cutMove.offsetY;
			},

			cuttingMove(event) {
				if(!this.isTouched) {
					return;
				}

				this.cutMove.endX = event.clientX - this.cutMove.offsetX;
				this.cutMove.endY = event.clientY - this.cutMove.offsetY;
			},

			cuttingEnd(event) {
				if(!this.isTouched) {
					return;
				}

				this.cutMove.endX = event.clientX - this.cutMove.offsetX;
				this.cutMove.endY = event.clientY - this.cutMove.offsetY;
				this.isTouched = false;
			},

			drawCutRect() {
				if(this.isClean) {
					return;
				}

				var ctx_2 = this.shadowCanvas.second.ctx;
				var ctx = this.canvas.ctx;
				var shadowCanvas_2 = this.shadowCanvas.second.dom;
				var width = this.canvas.width;
				var height = this.canvas.height;
				var startX = this.cutMove.startX;
				var endX = this.cutMove.endX;
				var startY = this.cutMove.startY;
				var endY = this.cutMove.endY;

				ctx_2.clearRect(0, 0, width, height);
				ctx_2.rect(0, 0, width, height)
				ctx_2.fill();
				ctx_2.clearRect(startX, startY, endX - startX, endY - startY)
				ctx.drawImage(shadowCanvas_2, 0, 0)
			},

			requestAFrame(fn) {
				return (window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					setTimeout)(fn);
			},

			cancelAFrame(id) {
				return (window.cancelAnimationFrame ||
					window.webkitCancelAnimationFrame ||
					window.mozCancelAnimationFrame ||
					window.oCancelAnimationFrame ||
					clearTimeout)(id);
			},

			run() {
				var _self = this;
				this.frameTimer = this.requestAFrame(() => {
					if(_self.isTouched && _self.ftpHandler.check()) {
						_self.draw();
					}

					_self.run();
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