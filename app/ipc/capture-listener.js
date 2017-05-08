var mod = {};






mod.init = init;


/**
*	函数定义
*/

function objParseInt(obj) {
	obj.x = parseInt(obj.x);
	obj.y = parseInt(obj.y);
	obj.width = parseInt(obj.width);
	obj.height = parseInt(obj.height);
}

function init(mainWindow, ipcMain, electron) {
	ipcMain.on('cut', (event, args) => {
		objParseInt(args);
		mainWindow.capturePage(args, (image) => {
			electron.clipboard.writeImage(image);
		});
	});
}






module.exports = mod;