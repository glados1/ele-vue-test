class Capture {
	constructor(obj) {
		obj = obj || {};
		this.window = obj.window || window;
		this.document = obj.document || document;
		this.screen = obj.screen || screen;
		this.canvasDom = obj.canvasDom;
		this.imgOutputType = obj.imgOutputType || 'image/jpeg';

		// 截屏原画信息
		this.imgData = obj.imgData;

		// 截图的剪切信息
		this.cutImgData = null;

		// 当前裁剪图像是否清空
		this.isClean = true;

		// 当前是否正在裁剪
		this.isTouched = false;

		// 当前截图的主canvas
		this.canvas = {
			dom : null,
			ctx : null,
			width : 0,
			height : 0
		};

		// 阴影 canvas, 用于显示黑色蒙版和截图区域
		this.shadowCanvas = {
			first : null,
			second : null
		};

		// 当前屏幕信息
		this.screen = {
			width : 0,
			height : 0
		};

		// 裁剪的图像区域信息
		this.cutMove = {
			startX : 0,
			endX : 0,
			startY : 0,
			endY : 0,
			offsetX : 0,
			offsetY : 0
		};

		// ftp handler
		this.ftpHandler = null;

		// frame timer
		this.frameTimer = null;

	}

	initData() {
		var window = this.window;
		var document = this.document;
		var screen = this.screen;
		var _self = this;
		var canvasDom = this.canvasDom;

		// 初始化 ftpHandler
		var ftpHandler = {
			lastTime: 0,
			check: function (fps) {
				var time = +new Date();
				var result = false;
				fps = fps || 60;
				if (!this.lastTime) {
					this.lastTime = time;
				} else {
					if (time - this.lastTime >= 1000 / fps) {
						this.lastTime = time;
						result = true;
					}
				}
				return result;
			}
		};

		this.ftpHandler = ftpHandler;

		// 初始化屏幕宽度和高度
		this.screen.width = screen.width;
		this.screen.height = screen.height;

		// 初始化位移初始点的 offsetX 和 offsetY
		var position = canvasDom.getBoundingClientRect();
		this.cutMove.offsetX = position.left;
		this.cutMove.offsetY = position.top;

		// 初始化主 canvas
		var ctx = canvasDom.getContext('2d');
		canvasDom.width = document.body.clientWidth;
		canvasDom.height = document.body.clientHeight;
		ctx.fillStyle = '#000';
		this.canvas.dom = canvasDom;
		this.canvas.ctx = ctx;
		this.canvas.width = canvasDom.width;
		this.canvas.height = canvasDom.height;

		// 初始化阴影 canvas 1, 阴影 canvas 1 用来保存截图的原画面
		var shadowCanvas_1 = document.createElement('canvas');
		shadowCanvas_1.width = this.canvas.width;
		shadowCanvas_1.height = this.canvas.height;
		var ctx_1 = shadowCanvas_1.getContext('2d');
		this.shadowCanvas.first = {
			ctx : ctx_1,
			dom : shadowCanvas_1
		};

		// 初始化阴影 canvas 2，阴影 canvas 2 用来绘制黑色蒙版，中间矩形挖空
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

		var loaded = function() {
			ctx_1.drawImage(img, 0, 0);
			ctx_1.onload = null;
			img = null;
			_self.draw();
			_self.run();
		};

		img.onload = loaded;
		img.src = this.imgData;

		this.bindEvents();

	}

	draw() {
		this.drawOriginImage();
		this.drawCutRect();
	}

	drawOriginImage() {
		var canvas = this.canvas;
		var ctx = canvas.ctx;
		var width = canvas.width;
		var height = canvas.height;

		var shadowCanvas_1 = this.shadowCanvas.first.dom;
		ctx.clearRect(0, 0, width, height);
		ctx.drawImage(shadowCanvas_1, 0, 0);
	}

	// 绘制黑色矩形蒙版，中间挖空一个小矩形，为鼠标选中区域
	drawCutRect() {
		if(this.isClean) {
			return;
		}

		var canvas = this.canvas;
		var cutMove = this.cutMove;

		var ctx_2 = this.shadowCanvas.second.ctx;
		var shadowCanvas_2 = this.shadowCanvas.second.dom;

		var ctx = canvas.ctx;
		var width = canvas.width;
		var height = canvas.height;
		var startX = cutMove.startX;
		var endX = cutMove.endX;
		var startY = cutMove.startY;
		var endY = cutMove.endY;

		ctx_2.clearRect(0, 0, width, height);
		ctx_2.rect(0, 0, width, height)
		ctx_2.fill();
		ctx_2.clearRect(startX, startY, endX - startX, endY - startY)
		ctx.drawImage(shadowCanvas_2, 0, 0)
	}

	requestAFrame(fn) {
		var window = this.window;

		return (window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			setTimeout)(fn);
	}

	cancelAFrame(id) {
		var window = this.window;

		return (window.cancelAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.mozCancelAnimationFrame ||
			window.oCancelAnimationFrame ||
			clearTimeout)(id);
	}

	run() {
		var _self = this;
		this.frameTimer = this.requestAFrame(() => {
			if(_self.isTouched && _self.ftpHandler.check()) {
				_self.draw();
			}

			_self.run();
		});
	}

	bindEvents() {
		var _self = this;
		var canvasDom = this.canvas.dom;
		var document = this.document;

		var canvasMouseDown = this.cuttingStart;
		var documentMouseMove = this.cuttingMove;
		var documentMouseUp = this.cuttingEnd;

		canvasDom.addEventListener('mousedown', (event) => {
			canvasMouseDown(event, _self);
		});
		document.addEventListener('mousemove', (event) => {
			documentMouseMove(event, _self);
		});
		document.addEventListener('mouseup', (event) => {
			documentMouseUp(event, _self);
		});

	}

	cuttingStart(event, _self) {
		_self.isTouched = true;
		_self.isClean = false;
		var cutMove = _self.cutMove;
		cutMove.startX = cutMove.endX = event.clientX - cutMove.offsetX;
		cutMove.startY = cutMove.endY = event.clientY - cutMove.offsetY;
	}

	cuttingMove(event, _self) {
		if(!_self.isTouched) {
			return;
		}

		var cutMove = _self.cutMove;
		cutMove.endX = event.clientX - cutMove.offsetX;
		cutMove.endY = event.clientY - cutMove.offsetY;
	}

	cuttingEnd(event, _self) {
		if(!_self.isTouched) {
			return;
		}

		var cutMove = _self.cutMove;
		cutMove.endX = event.clientX - cutMove.offsetX;
		cutMove.endY = event.clientY - cutMove.offsetY;
		_self.isTouched = false;
	}

	// 裁剪完成，返回裁剪的数据坐标等
	cutDone(callback) {
		this.cutImgData = this.getCutData();

		var document = this.document || document;
		var outputCanvasDom = document.createElement('canvas');
		var imgData = this.imgData;
		var cutImgData = this.cutImgData;
		var imgOutputType = this.imgOutputType;

		outputCanvasDom.width = cutImgData.width;
		outputCanvasDom.height = cutImgData.height;

		var outputCtx = outputCanvasDom.getContext('2d');

		var img = new Image();

		// 将图片输入成 imgOutputType 类型，默认为 jpeg
		img.onload = () => {
			outputCtx.drawImage(img, cutImgData.x, cutImgData.y, cutImgData.width, cutImgData.height, 0, 0, cutImgData.width, cutImgData.height);
			var cutImgPic = outputCanvasDom.toDataURL(imgOutputType);
			callback(null, {
				cutImgData : cutImgData,
				cutImgPic : cutImgPic
			});
			img.onload = null;
		};
		
		img.src = imgData;

	}

	// 清空裁剪区域信息，并且重新导入原图
	cutReset() {
		this.isClean = true;
		this.draw();
	}

	// 获取裁剪信息
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
	}


}

export default {
	Capture
};