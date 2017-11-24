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
import resources from './resources'
import game from './game'

class Engine {
  constructor () {
    this.lastTime = Date.now()
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  main () {
    const now = Date.now()
    const dt = (now - this.lastTime) / 1000.0

    // 仅在运行中的状态执行渲染步骤
    if (game.isRunning) {
      /**
       * 调用我们的 update / render 函数， 传递事件间隙给 update 函数因为这样
       * 可以使动画更加顺畅。
      */
      this.update(dt)
      this.renderBoard()
      this.renderEntities()
    }

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
    this.renderBoard()
    this.main()
  }

  /**
   * 更新游戏实体
   * @param dt
   */
  update (dt) {
    game.update()
    game.allEnemies.forEach(function (enemy) {
      enemy.update(dt)
    })
    game.checkCollisions() // 碰撞检测
  }

  /**
   * 渲染游戏场景
   */
  renderBoard () {
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
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        this.ctx.drawImage(resources.get(rowImages[row]), col * 101, row * 83)
      }
    }

    // 渲染游戏 panel
    game.renderPanel()
  }

  /**
   * 渲染游戏实体
   */
  renderEntities () {
    game.player.render()
    game.allGems.forEach(gem => {
      gem.render()
    })
    if (game.heart !== null) {
      game.heart.render()
    }
    if (game.key !== null) {
      game.key.render()
    }
    game.allRocks.forEach(rock => {
      rock.render()
    })
    game.allEnemies.forEach(function (enemy) {
      enemy.render()
    })
  }
}

export default new Engine()
