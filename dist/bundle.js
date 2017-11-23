!function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=3)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.resourceCache={},this.readyCallbacks=[]}return r(e,[{key:"load",value:function(e){e instanceof Array?e.forEach(function(e){this._load(e)}.bind(this)):this._load(e)}},{key:"get",value:function(e){return this.resourceCache[e]}},{key:"isReady",value:function(){var e=!0;for(var t in this.resourceCache)this.resourceCache.hasOwnProperty(t)&&!this.resourceCache[t]&&(e=!1);return e}},{key:"onReady",value:function(e){this.readyCallbacks.push(e)}},{key:"_load",value:function(e){if(this.resourceCache[e])return this.resourceCache[e];var t=new window.Image;t.onload=function(){this.resourceCache[e]=t,this.isReady()&&this.readyCallbacks.forEach(function(e){e()})}.bind(this),this.resourceCache[e]=!1,t.src=e}}]),e}();t.default=new i},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=n(4),o=r(n(2)),u=r(n(0)),s=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.status=0,this.startTime=Date.now(),this.allEnemies=[],this.player=new a.Player}return i(e,[{key:"update",value:function(){var e=this;Date.now()-this.startTime>1e3&&(this.startTime=Date.now(),this.allEnemies.push(new a.Enemy),this.allEnemies.forEach(function(t,n){t.x>600&&e.allEnemies.splice(n,1)}))}},{key:"reset",value:function(){this.player.reset(),this.allEnemies=[]}},{key:"checkCollisions",value:function(){var e=this;this.allEnemies.forEach(function(t){Math.abs(e.player.x-t.x)<60&&Math.abs(e.player.y-t.y)<60&&e.reset()}),this.player.y<73&&this.reset()}},{key:"init",value:function(){document.addEventListener("keyup",function(e){this.player.handleInput({37:"left",38:"up",39:"right",40:"down"}[e.keyCode])}.bind(this)),u.default.load(["images/stone-block.png","images/water-block.png","images/grass-block.png","images/enemy-bug.png","images/char-boy.png"]),u.default.onReady(o.default.init.bind(o.default))}},{key:"start",value:function(){this.status=1}},{key:"end",value:function(){this.status=2}},{key:"isRunning",get:function(){return 1===this.status}}]),e}());t.default=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=r(n(0)),o=r(n(1)),u=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.lastTime=Date.now(),this.canvas=document.querySelector("canvas"),this.ctx=this.canvas.getContext("2d")}return i(e,[{key:"main",value:function(){var e=Date.now(),t=(e-this.lastTime)/1e3;o.default.isRunning&&(this.update(t),this.renderBoard(),this.renderEntities()),this.lastTime=e,window.requestAnimationFrame(this.main.bind(this))}},{key:"init",value:function(){this.lastTime=Date.now(),this.renderBoard(),this.main()}},{key:"update",value:function(e){o.default.update(),o.default.allEnemies.forEach(function(t){t.update(e)}),o.default.checkCollisions()}},{key:"renderBoard",value:function(){for(var e=["images/water-block.png","images/stone-block.png","images/stone-block.png","images/stone-block.png","images/grass-block.png","images/grass-block.png"],t=0;t<6;t++)for(var n=0;n<5;n++)this.ctx.drawImage(a.default.get(e[t]),101*n,83*t)}},{key:"renderEntities",value:function(){o.default.player.render(),o.default.allEnemies.forEach(function(e){e.render()})}}]),e}();t.default=new u},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var i=r(n(1)),a=r(n(5));i.default.init(),(0,a.default)(".btn-start").one("click",function(){i.default.start(),(0,a.default)(this).addClass("disabled")}),window.game=i.default},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.Player=t.Enemy=void 0;var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=r(n(2)),c=r(n(0)),l=function(){function e(){if(o(this,e),new.target===e)throw new Error("不可以实例化抽象类")}return u(e,[{key:"update",value:function(){throw new Error("抽象方法")}},{key:"render",value:function(){s.default.ctx.drawImage(c.default.get(this.sprite),this.x,this.y)}}]),e}(),f=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));e.sprite="images/enemy-bug.png",e.x=-100;var n=[63,146,229,312,395];return e.y=n[Math.floor(10*Math.random())%n.length],e}return a(t,l),u(t,[{key:"update",value:function(e){this.x+=150*e}}]),t}(),h=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.sprite="images/char-boy.png",e.x=202,e.y=405,e.yPace=83,e.xPace=101,e}return a(t,l),u(t,[{key:"handleInput",value:function(e){"left"===e&&this.x>0?this.x-=this.xPace:"right"===e&&this.x<400?this.x+=this.xPace:"up"===e&&this.y>0?this.y-=this.yPace:"down"===e&&this.y<400&&(this.y+=this.yPace)}},{key:"reset",value:function(){this.x=202,this.y=405}}]),t}();t.Enemy=f,t.Player=h},function(e,t){e.exports=jQuery}]);