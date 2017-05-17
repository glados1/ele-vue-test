var Async = require('async');
var instance = null;
var _ = require('lodash');
var COS = require('../../static/libs/cos/cos-js-sdk-v4.js');
var CryptoJS = require('../../static/libs/crypto/crypto.js');
var CosCloud = COS.CosCloud;
var jsSHA = COS.jsSHA;

window.jsSHA = jsSHA;

var config = require('../config');

var noop = _.noop();



// 配置文件信息
var appid = config.appid;
var secretId = config.secretId;
var secretKey = config.secretKey;
var bucket = config.bucket;
var region = config.region;

// 获取配置文件信息

var cosAgent = new CosCloud({
	appid: appid,// APPID 必填参数
	bucket: bucket,//bucketName 必填参数
	region: region,//地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
	getAppSign: function (callback) {//获取签名 必填参数


	    //2.直接在浏览器前端计算签名，需要获取自己的accessKey和secretKey, 一般在调试阶段使用
	    var self = this;
	    var random = parseInt(Math.random() * Math.pow(2, 32));
	    var now = parseInt(new Date().getTime() / 1000);
	    var e = now + 60; //签名过期时间为当前+60s
	    var path = '';//多次签名这里填空
	    var str = 'a=' + self.appid + '&k=' + secretId + '&e=' + e + '&t=' + now + '&r=' + random +
	            '&f=' + path + '&b=' + self.bucket;

	    var sha1Res = CryptoJS.HmacSHA1(str, secretKey);//这里使用CryptoJS计算sha1值，你也可以用其他开源库或自己实现
	    var strWordArray = CryptoJS.enc.Utf8.parse(str);
	    var resWordArray = sha1Res.concat(strWordArray);
	    var res = resWordArray.toString(CryptoJS.enc.Base64);

	    /*
	    setTimeout(function () {//setTimeout模拟一下网络延迟的情况
	        callback(res);
	    }, 1000);
	    */
	    callback(res);

	},
	getAppSignOnce: function (callback) {//单次签名，参考上面的注释即可
	    var self = this;
	    var random = parseInt(Math.random() * Math.pow(2, 32));
	    var now = parseInt(new Date().getTime() / 1000);
	    var e = 0; //单次签名 expire==0
	    var path = self.path;
	    var str = 'a=' + self.appid + '&k=' + secretId + '&e=' + e + '&t=' + now + '&r=' + random +
	            '&f=' + path + '&b=' + self.bucket;

	    var sha1Res = CryptoJS.HmacSHA1(str, secretKey);//这里使用CryptoJS计算sha1值，你也可以用其他开源库或自己实现
	    var strWordArray = CryptoJS.enc.Utf8.parse(str);
	    var resWordArray = sha1Res.concat(strWordArray);
	    var res = resWordArray.toString(CryptoJS.enc.Base64);
	    /*
	    setTimeout(function () {//setTimeout模拟一下网络延迟的情况
	        callback(res);
	    }, 1000);
	    */
	    callback(res);
	}
});

class Uploader {
	constructor() {
		if(!instance) {
			this.fileList = [];
			this.asyncLimit = 1;
			this.onTaskStart = noop;
			this.onTaskFinish = noop;
			this.onTaskProgress = noop;
			this.onTaskError = noop;
			this.onTaskSuccess = noop;
			instance = this;
		}

		return instance;
	}

	// 设置上传文件列表
	setFileList(fileList) {
		this.fileList = fileList;
	}

	// 设置上传任务参数
	setUploadConfig(config) {
		this.asyncLimit = config.asyncLimit || 1;
	}

	setUploadCallback(callbacks) {
		this.onTaskStart = callbacks.onTaskStart || noop;
		this.onTaskFinish = callbacks.onTaskFinish || noop;
		this.onTaskProgress = callbacks.onTaskProgress || noop;
		this.onTaskError = callbacks.onTaskError || noop;
		this.onTaskSuccess = callbacks.onTaskSuccess || noop;
	}

	// 开始上传任务
	start(callback) {
		var fileList = this.fileList;
		var asyncLimit = this.asyncLimit;

		var _self = this;

		Async.mapLimit(fileList, asyncLimit, (fileItem, cb) => {

			_self._uploadFileItem(fileItem, cb);

		}, (errs, datas) => {
			if(errs) {
				return callback(errs);
			}

			return callback(null, datas);
		});
	}

	_uploadFileItem(fileItem, cb) {
		var onTaskStart = this.onTaskStart;
		var onTaskProgress = this.onTaskProgress;
		var onTaskSuccess = this.onTaskSuccess;
		var onTaskError = this.onTaskError;
		var onTaskFinish = this.onTaskFinish;

		onTaskStart(fileItem);

		var slice = Array.prototype.slice;

		var successCallback = function(res) {
			/*
			var args_1 = slice.call(arguments, 0);

			onTaskSuccess.apply(null, args_1);
			onTaskFinish.apply(null, args_1);
			*/
			onTaskSuccess({
				file : fileItem,
				res : res
			});

			onTaskFinish({
				file : fileItem,
				res : res
			});
			
			cb(null, fileItem);
		};

		var errorCallback = function(err) {
			/*
			var args_1 = slice.call(arguments, 0);
			onTaskError.apply(null, args_1);
			onTaskFinish.apply(null, args_1);
			*/
			onTaskError({
				file : fileItem,
				error : err
			});

			onTaskFinish({
				file : fileItem,
				error : err
			});
			
			cb(fileItem);
		};

		var progressCallback = function(progress) {
			onTaskProgress({
				file : fileItem,
				progress : progress
			});
		};

		cosAgent.uploadFile(successCallback, errorCallback, progressCallback, bucket, fileItem.name, fileItem, 0);

		
	}

}

export default {
	Uploader
};