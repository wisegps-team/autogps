/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	//模块启动器
	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	__webpack_require__(1);

	/**
	 * es6的某些兼容代码
	 */
	if (typeof Object.assign != 'function') {
	    Object.assign = function (target) {
	        if (target == null) {
	            throw new TypeError('Cannot convert undefined or null to object');
	        }

	        target = Object(target);
	        for (var index = 1; index < arguments.length; index++) {
	            var source = arguments[index];
	            if (source != null) {
	                for (var key in source) {
	                    if (Object.prototype.hasOwnProperty.call(source, key)) {
	                        target[key] = source[key];
	                    }
	                }
	            }
	        }
	        return target;
	    };
	}

	/**
	 * 框架的全局变量全部放这里
	 * 之后所有模块都可以不引用直接使用这些变量了
	 */
	window.LAUNCHER = { //应用模块的启动器对象
	    historyList: [], //用户在整个应用生命周期的历史记录
	    historyIndex: 0, //用户当前处于历史记录的哪个位置
	    moduleList: [], //加载过的模块，除非是模块过多出于内存管理把view卸载了，内存管理待定怎么做
	    getView: function getView(e) {
	        //获取当前模块的载体，只在加载时执行有效
	        return document.currentScript.view.dom;
	    }
	};

	/**
	 * 当前状态
	 */
	var STATE = {
	    views: {},
	    this_one: false,
	    last_one: false,
	    moduleList: []
	};
	var APP;

	/**
	 * 跳转到指定模块
	 */
	function _goTo(url, params) {
	    var locat = url;
	    if (url.indexOf('.') != -1) {
	        var e = /https*:\/\/[^/]+/;
	        var start = url.match(e)[0];
	        url = url.replace(e, '');
	        url = start + url.replace(/\.[^?#]+/, '.js'); //把后缀名改为js
	    }
	    var target = STATE.views[url];
	    if (!target) {
	        //如果是一个新的模块，创建新的view
	        target = createView(url, 0, STATE.this_one.data.url);
	    } else if (target == STATE.this_one) {
	        //如果是当前模块
	        return false;
	    }
	    if (typeof params !== 'undefined' && (typeof params == 'function' || (typeof params === 'undefined' ? 'undefined' : _typeof(params)) == 'object')) {
	        params = JSON.parse(JSON.stringify(params));
	    }
	    target.params = params;
	    showView(url, false);
	    setHistory(locat, url);
	}

	/**
	 * 显示某个view
	 */
	function showView(url, back) {
	    var t;
	    if (!STATE.this_one) {
	        //首次
	        window.history.replaceState(url, 'id', Location.href);
	        t = createView(url);
	    } else t = STATE.views[url];
	    if (t) {
	        STATE.last_one = STATE.this_one;
	        STATE.this_one = t;

	        STATE.this_one.show(!config.animation || !back, back);
	        if (STATE.last_one) STATE.last_one.hide(!config.animation || back, back);
	    } else {
	        throw '模块未加载 url:' + url;
	    }
	}
	/**
	 * 出入动画执行完毕，去隐藏上一个view，触发对应的hide事件和show事件
	 */
	function animationEnd() {
	    if (STATE.last_one) {
	        STATE.last_one.static();
	        STATE.last_one.emitDom('hide');
	    }
	    STATE.this_one.static();
	    document.body.scrollTop = STATE.this_one._scrollTop;
	    if (STATE.this_one.state >= 3) {
	        var D = {
	            params: STATE.this_one.params,
	            caller: STATE.last_one ? STATE.last_one.data.url : null
	        };
	        delete STATE.this_one.params;
	        STATE.this_one.emitDom('show', D);
	    } else STATE.this_one.emitDom('show');
	}

	/**
	 * 设置历史记录
	 */
	function setHistory(url, state) {
	    //设置历史记录
	    url = url.replace(/\.js[^?#]*/, ''); //去掉js后缀名，如果有
	    window.history.pushState(state, 'id', url);
	    window.LAUNCHER.historyList = window.LAUNCHER.historyList.slice(0, window.LAUNCHER.historyIndex + 1);
	    window.LAUNCHER.historyList.push(state);
	    window.LAUNCHER.historyIndex = window.LAUNCHER.historyList.length - 1;
	    if (window.LAUNCHER.historyIndex < 0) window.LAUNCHER.historyIndex = 0;
	};

	/**
	 * 创建一个模块（页面）
	 * url 模块的地址，可以是相对路径也可以是绝对路径
	 * mode 创建模式 0或者无：创建完即显示，并会加载js并渲染组件(正常模式)；1：创建完不显示，但会加载js并渲染组件（预渲染）；2：创建完不显示，会加载js，但不渲染（预加载）
	 * creater 创建者，创建该模块的模块url
	 */
	function createView(url, mode, creater) {
	    //创建一个view
	    var div = document.createElement('div');
	    var vi = new view(div, url, mode, creater);
	    APP.appendChild(div);
	    STATE.views[url] = vi;
	    return vi;
	}

	/**
	 * 预加载或者预渲染
	 * @param {String} url 要加载的模块绝对地址
	 * @param {Int} mode 加载模式 1：创建完不显示，但会加载js并渲染组件（预渲染）；2：创建完不显示，会加载js，但不渲染（预加载） 如果不传或者为false，则只是创建一个view
	 * @param {any} params 可选，加载时传递的参数
	 * @param {String} creater 创建者url
	 */
	function _prefetch(url, mode, params, creater) {
	    if (!STATE.views[url]) {
	        //如果是一个新的模块，创建新的view
	        if (typeof params !== 'undefined' && (typeof params == 'function' || (typeof params === 'undefined' ? 'undefined' : _typeof(params)) == 'object')) {
	            params = JSON.parse(JSON.stringify(params));
	        }
	        createView(url, mode, creater).params = params;
	        return true;
	    } else return false;
	}

	//事件触发者
	function EventEmitter() {
	    this.events = {};
	}
	//绑定事件函数
	EventEmitter.prototype.on = function (eventName, callback) {
	    this.events[eventName] = this.events[eventName] || [];
	    this.events[eventName].push(callback);
	    return this.events[eventName].length - 1;
	};
	//触发事件函数
	EventEmitter.prototype.emit = function (eventName, _) {
	    var events = this.events[eventName],
	        args = Array.prototype.slice.call(arguments, 1),
	        i,
	        m;

	    if (!events) {
	        return;
	    }
	    for (i = 0, m = events.length; i < m; i++) {
	        events[i].apply(this, args);
	    }
	};
	//移除事件监听,第二参数可以是function对象，也可以是on方法所返回的整数
	EventEmitter.prototype.off = function (eventName, callback) {
	    var events = this.events[eventName];
	    if (!events) {
	        return;
	    }
	    if (typeof callback == 'function') for (var i = 0; i < events.length; i++) {
	        if (events[i] == callback) {
	            events.splice(i, 1);
	            return;
	        }
	    } else events.splice(callback, 1);
	};

	function view(dom, url, mode, creater) {
	    EventEmitter.call(this); //继承属性
	    this.dom = dom;
	    this.data = {
	        'url': url,
	        'mode': mode
	    };
	    this.creater = creater;
	    this.state = 0;
	    this.show_state = 0;
	    if (mode != 2) {
	        //默认模式动画结束才加载js
	        this.loadScript();
	    }
	    dom.id = view.getViewId(url);
	    dom.innerHTML = config.loading ? config.loading : '';
	    this.onDom('animationend', view.animationend);
	    this.onDom('webkitAnimationEnd', view.animationend);

	    for (var key in divFunction) {
	        dom[key] = divFunction[key].bind(this);
	    }
	}
	view.prototype = new EventEmitter(); //继承方法

	//加载自身的js文件
	view.prototype.loadScript = function () {
	    if (this.state) return;
	    var that = this;
	    if (this.data.mode == 1) this.on('scriptLoaded', view.loaded);

	    var script = document.createElement('script');
	    script.view = this;
	    script.onload = function () {
	        that.state = 2;
	        that.emit('scriptLoaded');
	        delete this.view;
	    };
	    script.onabort = view.scriptError;
	    script.onerror = view.scriptError;
	    script.async = true;
	    document.head.appendChild(script);
	    script.src = this.data.url;
	    STATE.moduleList.push(script.src);
	    window.LAUNCHER.moduleList = STATE.moduleList.concat();

	    this.state = 1;
	};

	//触发一个view的load事件，模块监听到这个事件后开始加载自己
	view.prototype.loaded = function () {
	    if (this.state >= 3) return;
	    var evt = document.createEvent("HTMLEvents");
	    evt.initEvent("load", false, false);
	    evt.params = this.params;
	    delete this.params;
	    this.state = 3;
	    this.dom.dispatchEvent(evt);
	};

	//触发一个除了load的任意事件
	view.prototype.emitDom = function (type, data) {
	    if (type == 'load') return;
	    var evt = document.createEvent("HTMLEvents");
	    if (typeof data != 'undefined') Object.assign(evt, data);
	    evt.initEvent(type, false, false);
	    this.dom.dispatchEvent(evt);
	};

	//展示
	view.prototype.show = function (animation, back) {
	    var cla = 'active';
	    if (animation) {
	        cla += ' enter';
	        if (back) cla += ' back';
	    }
	    this.dom.className = cla;
	    this.show_state = 1;
	};

	//隐藏
	view.prototype.hide = function (animation, back) {
	    var cla = 'active';
	    if (animation) {
	        cla += ' leave';
	        if (back) cla += ' back';
	    }
	    this._scrollTop = document.body.scrollTop;
	    this.dom.className = cla;
	    this.show_state = 0;
	};
	/**
	 * 根据展示状态去掉动画类
	 */
	view.prototype.static = function () {
	    if (this.show_state) {
	        this.dom.className = 'active';
	    } else {
	        this.dom.className = '';
	    }
	};

	view.prototype.onDom = function (type, callback, useCapture) {
	    var that = this;
	    var _type = 'dom-' + type;
	    this.dom.addEventListener(type, function () {
	        that.emit(_type);
	    }, useCapture);
	    this.on(_type, callback);
	};

	//view的静态方法

	/**
	 * 模块加载出错，加载中断或者加载不了
	 */
	view.scriptError = function (e) {
	    var v = this.view;
	    delete this.view;
	    //清除脚本元素和view元素
	    if (!v.data.mode) {
	        history.back();
	    }
	    STATE.moduleList.splice(STATE.moduleList.indexOf(v.data.url), 1);
	    window.LAUNCHER.moduleList = STATE.moduleList.map(function (mod) {
	        return mod;
	    });
	    this.parentElement.removeChild(this);
	    setTimeout(function () {
	        v.dom.parentElement.removeChild(v.dom);
	    }, 500);
	};

	/**
	 * 处理view显示或者消失的动画结束事件
	 */
	view.animationend = function () {
	    if (event.target !== this.dom) return; //避免子节点事件冒泡误触发
	    var that = this;
	    switch (this.state) {
	        case 0:
	            //还没有加载js，便正常加载
	            this.loadScript();
	            break;
	        case 1:
	            //正在加载js，还没加载完，区分加载模式进行处理
	            if (this.data.mode == 2) this.on('scriptLoaded', view.loaded);
	            break;
	        case 2:
	            //已经加载完js，还没触发loaded，则触发loaded
	            this.loaded();
	            break;
	    }
	    if (!config.animation && this.show_state || config.animation) animationEnd();
	};
	/**
	 * 触发view的load事件
	 */
	view.loaded = function () {
	    this.loaded();
	};

	/**
	 * 获取div的id
	 */
	view.getViewId = function (url) {
	    var id;
	    if (config.src != '/') {
	        id = url.slice(url.indexOf('/' + config.src + '/') + (config.src.length + 2));
	    } else {
	        id = url.replace(location.origin, '').slice(1);
	    }
	    id = id.split('.')[0];
	    id = id.replace(/\//g, '0');
	    return id;
	};

	/**
	 * 相对地址转绝对地址
	 */
	view.getPath = function (url, href) {
	    //相对地址转换为绝对地址
	    if (!href) {
	        var a = document.createElement('a');
	        a.href = url; //转换为绝对路径
	        return a.href;
	    }
	    if (/https*:\/\/.+/.test(url)) return url;
	    var com = url.split('/');
	    var start = '',
	        end = '';
	    var en = url.search(/[#?]/);
	    if (en != -1) end = url.slice(en);
	    var e = /https*:\/\/[^/]+/;
	    start = href.match(e)[0];
	    href = href.replace(e, '');

	    var path = href.split('/');
	    path.pop();
	    var res = path.concat([]);
	    for (var i = 0; i < com.length; i++) {
	        if (com[i] == '..') {
	            res.pop();
	        } else if (com[i] != '.' && com[i] != '') {
	            res.push(com[i]);
	        }
	    }
	    return start + res.join('/') + end;
	};

	/**
	 * 以下是直接附在div元素上的方法，开放给模块内部使用的
	 */
	var divFunction = {
	    goTo: function goTo(url, params) {
	        //跳转其他模块
	        if (this.show_state) {
	            url = view.getPath(url, this.data.url);
	            _goTo(url, params);
	            return true;
	        } else {
	            return false;
	        }
	    },
	    postMessage: function postMessage(url, data) {
	        //给对应模块发送消息
	        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) == 'object' || typeof data == 'function') {
	            data = JSON.parse(JSON.stringify(data));
	        }
	        var vi = STATE.views[view.getPath(url, this.data.url)];
	        if (!vi) return false;
	        var D = {
	            'from': this.data.url,
	            'data': data
	        };
	        vi.emitDom('message', D);
	        return true;
	    },
	    moduleExist: function moduleExist(url) {
	        //检测模块是否已存在
	        if (STATE.views[view.getPath(url, this.data.url)]) return true;else return false;
	    },
	    isShow: function isShow() {
	        //检测当前模块是否显示
	        return this.show_state;
	    },
	    prefetch: function prefetch(url, mode, params) {
	        //预加载一个其他模块
	        url = view.getPath(url, this.data.url);
	        return _prefetch(url, mode, params, this.data.url);
	    },
	    getCreater: function getCreater() {
	        //获取当前模块的创建者url
	        return this.creater;
	    }
	};

	window.addEventListener('load', function () {
	    APP = document.createElement('div');
	    APP.id = 'W-LAUNCHER';
	    document.body.appendChild(APP);
	    showView(view.getPath(config.defaultModule));
	});
	window.addEventListener('popstate', function (e) {
	    var name = e.state; //跳转之后的地址
	    var i = window.LAUNCHER.moduleList.indexOf(name);
	    //判断这个地址是不是一个模块地址
	    if (i != -1) {
	        if (!i || window.LAUNCHER.historyList[window.LAUNCHER.historyIndex - 1] == name) {
	            //后退
	            window.LAUNCHER.historyIndex--;
	            showView(name, true);
	        } else {
	            window.LAUNCHER.historyIndex++;
	            showView(name);
	        }
	    }
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js?sourceMap!./launcher.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js?sourceMap!./launcher.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "@charset \"UTF-8\";\nbody {\n  overflow-x: hidden;\n  padding: 0;\n  margin: 0;\n  box-sizing: border-box;\n  font-family: '\\5FAE\\8F6F\\96C5\\9ED1'; }\n\n#W-LAUNCHER {\n  min-height: 100vh; }\n\n#W-LAUNCHER > div {\n  display: none;\n  width: 100vw;\n  min-height: 100vh;\n  top: 0;\n  left: 0;\n  background: #fff;\n  animation-fill-mode: forwards;\n  -webkit-animation-fill-mode: forwards; }\n\n#W-LAUNCHER > .active {\n  display: block; }\n\n#W-LAUNCHER > .enter {\n  display: block;\n  position: fixed;\n  animation: fromRight .5s;\n  -webkit-animation: fromRight .5s; }\n\n#W-LAUNCHER > .enter.back {\n  animation: fromLeft .5s;\n  -webkit-animation: fromLeft .5s; }\n\n#W-LAUNCHER > .leave {\n  display: block;\n  position: fixed;\n  animation: toLeft .5s;\n  -webkit-animation: toLeft .5s; }\n\n#W-LAUNCHER > .leave.back {\n  animation: toRight .5s;\n  -webkit-animation: toRight .5s; }\n\n@keyframes fromRight {\n  from {\n    transform: translate3d(100%, 0, 0);\n    opacity: 0.5; }\n  to {\n    transform: translate3d(0, 0, 0);\n    opacity: 1; } }\n\n@-webkit-keyframes fromRight {\n  from {\n    -webkit-transform: translate3d(100%, 0, 0);\n    opacity: 0.5; }\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    opacity: 1; } }\n\n@keyframes fromLeft {\n  from {\n    transform: translate3d(-100%, 0, 0);\n    opacity: 0.5; }\n  to {\n    transform: translate3d(0, 0, 0);\n    opacity: 1; } }\n\n@-webkit-keyframes fromLeft {\n  from {\n    -webkit-transform: translate3d(-100%, 0, 0);\n    opacity: 0.5; }\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    opacity: 1; } }\n\n@keyframes toLeft {\n  from {\n    transform: translate3d(0, 0, 0);\n    opacity: 1; }\n  to {\n    transform: translate3d(-100%, 0, 0);\n    opacity: 0.5; } }\n\n@-webkit-keyframes toLeft {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    opacity: 1; }\n  to {\n    -webkit-transform: translate3d(-100%, 0, 0);\n    opacity: 0.5; } }\n\n@keyframes toRight {\n  from {\n    transform: translate3d(0, 0, 0);\n    opacity: 1; }\n  to {\n    transform: translate3d(100%, 0, 0);\n    opacity: 0.5; } }\n\n@-webkit-keyframes toRight {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    opacity: 1; }\n  to {\n    -webkit-transform: translate3d(100%, 0, 0);\n    opacity: 0.5; } }\n\n.loader {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  perspective: 800px;\n  -webkit-perspective: 800px;\n  color: #00bcd4;\n  margin: 5vw auto;\n  transition: color .5s;\n  -webkit-transition: color .5s;\n  position: absolute;\n  margin: auto;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0; }\n\n.loader > span {\n  text-align: center;\n  position: absolute;\n  width: 100%;\n  bottom: -2em;\n  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1); }\n\n.loader > div {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  border-width: 3px;\n  animation-duration: 1s;\n  -webkit-animation-duration: 1s;\n  animation-iteration-count: infinite;\n  -webkit-animation-iteration-count: infinite;\n  animation-timing-function: linear;\n  -webkit-animation-timing-function: linear; }\n\n.loader > div:nth-child(1) {\n  left: 0;\n  top: 0;\n  animation-name: rotate-one;\n  -webkit-animation-name: rotate-one;\n  border-bottom-style: solid; }\n\n.loader > div:nth-child(2) {\n  right: 0;\n  top: 0;\n  animation-name: rotate-two;\n  -webkit-animation-name: rotate-two;\n  border-right-style: solid; }\n\n.loader > div:nth-child(3) {\n  right: 0;\n  bottom: 0;\n  animation-name: rotate-three;\n  -webkit-animation-name: rotate-three;\n  border-top-style: solid; }\n\n@keyframes rotate-one {\n  0% {\n    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0); }\n  to {\n    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg); } }\n\n@keyframes rotate-two {\n  0% {\n    transform: rotateX(50deg) rotateY(10deg) rotateZ(0); }\n  to {\n    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg); } }\n\n@keyframes rotate-three {\n  0% {\n    transform: rotateX(35deg) rotateY(55deg) rotateZ(0); }\n  to {\n    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg); } }\n\n@-webkit-keyframes rotate-one {\n  0% {\n    -webkit-transform: rotateX(35deg) rotateY(-45deg) rotateZ(0); }\n  to {\n    -webkit-transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg); } }\n\n@-webkit-keyframes rotate-two {\n  0% {\n    -webkit-transform: rotateX(50deg) rotateY(10deg) rotateZ(0); }\n  to {\n    -webkit-transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg); } }\n\n@-webkit-keyframes rotate-three {\n  0% {\n    -webkit-transform: rotateX(35deg) rotateY(55deg) rotateZ(0); }\n  to {\n    -webkit-transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg); } }\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);