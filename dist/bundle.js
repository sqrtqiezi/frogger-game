/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* Resources.js
 * 这是一个简单的图片加载工具。他简化了图片加载的过程从而这些图片可以在你的游戏里面使用。
 * 这个工具还包含一个缓存层从而当你试图加载同一张图片多次的时候可以重复使用缓存的图片
 */

class Resources {
  constructor () {
    this.resourceCache = {}
    // const loading = []
    this.readyCallbacks = []
  }

  /**
   * 这是公开访问的图片加载函数, 它接受一个指向图片文件的字符串的数组或者是单个图片的
   * 路径字符串。然后再调用我们私有的图片加载函数。
   *
   * @param urlOrArr
   */
  load (urlOrArr) {
    if (urlOrArr instanceof Array) {
      /* 如果开发者传进来一个图片数组，循环访问每个值，然后调用我们的图片加载器 */
      urlOrArr.forEach(function (url) {
        this._load(url)
      }.bind(this))
    } else {
      /* 如果开发者传进来的不是一个数组，那么就可以认为参数值是一个字符串，
       * 然后立即调用我们的图片加载器即可。
       */
      this._load(urlOrArr)
    }
  }

  /**
   * 这个函数用来让开发者拿到他们已经加载的图片的引用。如果这个图片被缓存了，
   * 这个函数的作用和在那个 URL 上调用 load() 函数的作用一样。
   *
   * @param url
   * @returns {*}
   */
  get (url) {
    return this.resourceCache[url]
  }

  /**
   * 这个函数是否检查所有被请求加载的图片都已经被加载了。
   *
   * @returns {boolean}
   */
  isReady () {
    var ready = true
    for (var k in this.resourceCache) {
      if (this.resourceCache.hasOwnProperty(k) &&
        !this.resourceCache[k]) {
        ready = false
      }
    }
    return ready
  }

  /**
   * 这个函数会在被请求的函数都被加载了这个事件的回调函数栈里面增加一个函数
   *
   * @param func
   */
  onReady (func) {
    this.readyCallbacks.push(func)
  }

  /**
   * 这是我们私有的图片加载函数， 它会被公有的图片加载函数调用
   *
   * @param url
   * @returns {*}
   * @private
   */
  _load (url) {
    if (this.resourceCache[url]) {
      /* 如果这个 URL 之前已经被加载了，那么它会被放进我们的资源缓存数组里面，
       * 然后直接返回那张图片即可。
       */
      return this.resourceCache[url]
    } else {
      /* 否则， 这个 URL 之前没被加载过而且在缓存里面不存在，那么我们得加载这张图片
       */
      var img = new window.Image()
      img.onload = function () {
        /* 一旦我们的图片已经被加载了，就把它放进我们的缓存，然后我们在开发者试图
         * 在未来再次加载这个图片的时候我们就可以简单的返回即可。
         */
        this.resourceCache[url] = img
        /* 一旦我们的图片已经被加载和缓存，调用所有我们已经定义的回调函数。
         */
        if (this.isReady()) {
          this.readyCallbacks.forEach(function (func) {
            func()
          })
        }
      }.bind(this)

      /* 将一开始的缓存值设置成 false 。在图片的 onload 事件回调被调用的时候会
       * 改变这个值。最后，将图片的 src 属性值设置成传进来的 URl 。
       */
      this.resourceCache[url] = false
      img.src = url
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (new Resources());


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entities__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__engine__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__resources__ = __webpack_require__(0);




class Game {
  constructor () {
    this.startTime = Date.now()
    this.allEnemies = [
    ]
    this.player = new __WEBPACK_IMPORTED_MODULE_0__entities__["b" /* Player */]()
  }

  update () {
    // 每秒钟新增一只🐞
    if ((Date.now() - this.startTime) > 1000) {
      this.startTime = Date.now()
      this.allEnemies.push(new __WEBPACK_IMPORTED_MODULE_0__entities__["a" /* Enemy */]())

      this.allEnemies.forEach((item, index) => {
        if (item.x > 600) {
          this.allEnemies.splice(index, 1)
        }
      })
    }
  }

  reset () {
    this.player.reset()
    this.allEnemies = []
  }

  /**
   * 碰撞检测
   */
  checkCollisions () {
    this.allEnemies.forEach(item => {
      if (Math.abs(this.player.x - item.x) < 60 &&
          Math.abs(this.player.y - item.y) < 60) {
        this.reset()
      }
    })
    // 玩家跳河啦
    if (this.player.y < 73) {
      this.reset()
    }
  }

  run () {
    // 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
    // 方法里面。你不需要再更改这段代码了。
    document.addEventListener('keyup', function (e) {
      const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
      }
      this.player.handleInput(allowedKeys[e.keyCode])
    }.bind(this))

    /**
     * 紧接着我们来加载我们知道的需要来绘制我们游戏关卡的图片。然后把 init 方法设置为回调函数。
     * 那么党这些图片都已经加载完毕的时候游戏就会开始。
     */
    __WEBPACK_IMPORTED_MODULE_2__resources__["a" /* default */].load([
      'images/stone-block.png',
      'images/water-block.png',
      'images/grass-block.png',
      'images/enemy-bug.png',
      'images/char-boy.png'
    ])
    __WEBPACK_IMPORTED_MODULE_2__resources__["a" /* default */].onReady(__WEBPACK_IMPORTED_MODULE_1__engine__["a" /* default */].init.bind(__WEBPACK_IMPORTED_MODULE_1__engine__["a" /* default */]))
  }
}

const game = new Game()

/* harmony default export */ __webpack_exports__["a"] = (game);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__resources__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(1);
/* Engine.js
* 这个文件提供了游戏循环玩耍的功能（更新敌人和渲染）
 * 在屏幕上画出出事的游戏面板，然后调用玩家和敌人对象的 update / render 函数（在 app.js 中定义的）
 *
 * 一个游戏引擎的工作过程就是不停的绘制整个游戏屏幕，和小时候你们做的 flipbook 有点像。当
 * 玩家在屏幕上移动的时候，看上去就是图片在移动或者被重绘。但这都是表面现象。实际上是整个屏幕
 * 被重绘导致这样的动画产生的假象

 * 这个引擎是可以通过 Engine 变量公开访问的，而且它也让 canvas context (ctx) 对象也可以
 * 公开访问，以此使编写app.js的时候更加容易
 */



class Engine {
  constructor () {
    this.lastTime = Date.now()
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.canvas.width = 505
    this.canvas.height = 606
    document.body.appendChild(this.canvas)
  }

  main () {
    const now = Date.now()
    const dt = (now - this.lastTime) / 1000.0

    /* 调用我们的 update / render 函数， 传递事件间隙给 update 函数因为这样
     * 可以使动画更加顺畅。
     */
    this.update(dt)
    this.render()

    /* 设置我们的 lastTime 变量，它会被用来决定 main 函数下次被调用的事件。 */
    this.lastTime = now

    /* 在浏览准备好调用重绘下一个帧的时候，用浏览器的 requestAnimationFrame 函数
     * 来调用这个函数
     */
    window.requestAnimationFrame(this.main.bind(this))
  }

  /**
   * 这个函数调用一些初始化工作，特别是设置游戏必须的 lastTime 变量，这些工作只用
   * 做一次就够了
  */
  init () {
    this.lastTime = Date.now()
    this.main()
  }

  update (dt) {
    __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].update()
    __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].allEnemies.forEach(function (enemy) {
      enemy.update(dt)
    })
    // game.player.update()
    __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].checkCollisions(); // 碰撞检测
  }

  render () {
    // 这个数组保存着游戏关卡的特有的行对应的图片相对路径
    const rowImages = [
      'images/water-block.png', // 这一行是河。
      'images/stone-block.png', // 第一行石头
      'images/stone-block.png', // 第二行石头
      'images/stone-block.png', // 第三行石头
      'images/grass-block.png', // 第一行草地
      'images/grass-block.png' // 第二行草地
    ]
    const numRows = 6
    const numCols = 5

    /* 便利我们上面定义的行和列，用 rowImages 数组，在各自的各个位置绘制正确的图片 */
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        /* 这个 canvas 上下文的 drawImage 函数需要三个参数，第一个是需要绘制的图片
         * 第二个和第三个分别是起始点的x和y坐标。我们用我们事先写好的资源管理工具来获取
         * 我们需要的图片，这样我们可以享受缓存图片的好处，因为我们会反复的用到这些图片
         */
        this.ctx.drawImage(__WEBPACK_IMPORTED_MODULE_0__resources__["a" /* default */].get(rowImages[row]), col * 101, row * 83)
      }
    }

    __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].player.render()

    /* 遍历在 allEnemies 数组中存放的作于对象然后调用你事先定义的 render 函数 */
    __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].allEnemies.forEach(function (enemy) {
      enemy.render()
    })
  }
}

/* harmony default export */ __webpack_exports__["a"] = (new Engine());


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_game__ = __webpack_require__(1);


__WEBPACK_IMPORTED_MODULE_0__lib_game__["a" /* default */].run()

window.game = __WEBPACK_IMPORTED_MODULE_0__lib_game__["a" /* default */]


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Enemy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Player; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__engine__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__resources__ = __webpack_require__(0);



/**
 * 游戏实体
 */
class Entity {
  constructor () {
    if (new.target === Entity) {
      throw new Error('不可以实例化抽象类')
    }
  }

  update () {
    throw new Error('抽象方法')
  }

  render () {
    __WEBPACK_IMPORTED_MODULE_0__engine__["a" /* default */].ctx.drawImage(__WEBPACK_IMPORTED_MODULE_1__resources__["a" /* default */].get(this.sprite), this.x, this.y)
  }
}

/**
 * 玩家要躲避的敌人
 */
class Enemy extends Entity {
  /**
   * @constructor
   */
  constructor () {
    super()
    this.sprite = 'images/enemy-bug.png'
    this.x = -100
    const coords = [
      63, 146, 229, 312, 395
    ]
    this.y = coords[Math.floor(Math.random() * 10) % coords.length]
  }

  /**
   * @description 更新敌人的位置
   * @param dt ，表示时间间隙
   */
  update (dt) {
    // console.log(dt)
    this.x += dt * 150
  }
}

/**
 * 玩家类
 */
class Player extends Entity {
  constructor () {
    super()
    this.sprite = 'images/char-boy.png'
    this.x = 202
    this.y = 405
    this.yPace = 83
    this.xPace = 101
  }

  handleInput (direction) {
    if (direction === 'left' && this.x > 0) {
      this.x -= this.xPace
    } else if (direction === 'right' && this.x < 400) {
      this.x += this.xPace
    } else if (direction === 'up' && this.y > 0) {
      this.y -= this.yPace
    } else if (direction === 'down' && this.y < 400) {
      this.y += this.yPace
    }
  }

  reset () {
    this.x = 202
    this.y = 405
  }
}




/***/ })
/******/ ]);