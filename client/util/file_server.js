
var path = require('path');
var URL = require('url');
var fs = require('fs');
var _ = require('lodash');
var os = require('os');
var send = require('send');
var xdgBasedir = require('xdg-basedir');
var http = require('http');
var mime = require('./mime');


var configDir = path.join(xdgBasedir.config || path.join(os.tmpdir(), '.config'), 'freeshare');

var instance = null;

class FileServer {
	constructor() {
		if(!instance) {
			instance = this;
		}

		return instance;
	}

	// 设置配置文件
	setConfig(config) {
		this.config = _.defaultsDeep(config, {
			nodeIdFile : path.join(configDir, 'nodeid.data'),
			domain : 'localhost'
		});

		// 本地资源化
		this.config.domain = 'localhost';
	}

	// 启动静态资源服务器
	start(cb) {
		if(this.started) {
			cb();
			return;
		}

		var _self = this;

		fs.readFile(path.join(configDir, 'files.json'), (err, data) => {
			if(err) {
				this.fileMap = new Map();
			} else {
				this.fileMap = new Map(JSON.parse(data));
			}

			_self._serverInit(cb);
			
		});
	}

	// 添加文件
	addFile(filepath, cb) {
		var filename = path.basename(filepath);

		if(this.fileMap.has(filename)) {
			cb({
				message : 'filename exists'
			});
			return;
		}

		this.fileMap.set(filename, filepath);

		var _self = this;

		this._save((err) => {
			cb(err, _self._covertFileInfo(filename));
		});
	}

	// 删除文件
	removeFile(filename, cb) {
		if (!this.fileMap.has(filename)) {
            cb({ desc: 'file doesn\'t exists' });
            return;
        }

        this.fileMap.delete(filename);
        this._save(cb);
	}

	// 遍历文件，并返回文件映射信息
	forEachFile(cb) {
        this.fileMap.forEach((filepath, filename) => {
            cb(this._covertFileInfo(filename))
        })
    }

    // 持久化保存文件信息
    _save(cb) {
        let filesArray = Array.from(this.fileMap);

        fs.writeFile(path.join(configDir, 'files.json'), JSON.stringify(filesArray), cb);
    }

    // 设置头部，用于设置文件下载
    _setHeaders(res, path, stat) {
    	res.setHeader('Content-Disposition', 'attachment');
    }

    // 初始化本地资源服务器
    _serverInit(cb) {
		this.server = http.createServer((req, res) => {
			var reqUrl = URL.parse(req.url);
			var filename = decodeURI(path.basename(reqUrl.pathname));

			var _self = this;

			if(this.fileMap.has(filename)) {
				var filepath = this.fileMap.get(filename);
				send(req, filepath)
					.on('error', (err) => {
						res.statusCode = err.status || 500;
						res.end(err.message);
					})
					.on('headers', _self._setHeaders)
					.pipe(res);
			} else {
				res.end(filename + ' not found');
			}
		});

		this._serverReady(cb);
    }

    // server 已经创建，并开始监听端口，绑定 ip 
    _serverReady(cb) {
		if (!this.started) {
            let ifaces = os.networkInterfaces();
            Object.keys(ifaces).forEach((dev) => {
                ifaces[dev].forEach((details) => {
                    if (this.ip) return;

                    if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                        this.ip = details.address;
                    }
                });
            });

            this.server.listen(8181, this.ip);
        }

        this.started = true;

        cb();
    }

    _covertFileInfo(filename) {
        if (this.config.domain === 'localhost') {
            var fileURL = 'http://' + path.join(this.ip + ':8181', this.config.domain, filename).replace(/\\/g, '\/');
        } else {
            var fileURL = 'http://' + path.join(this.config.entryNode.host + ':' + (this.config.entryNode.dhtPort ? this.config.entryNode.dhtPort : this.config.port), this.config.domain, filename).replace(/\\/g, '\/');
        }

        return {
            name: filename,
            url: fileURL
        }
    }
}

export default {
	FileServer
};