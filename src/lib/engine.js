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
    game.update()
    game.allEnemies.forEach(function (enemy) {
      enemy.update(dt)
    })
    // game.player.update()
    game.checkCollisions(); // 碰撞检测
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
        this.ctx.drawImage(resources.get(rowImages[row]), col * 101, row * 83)
      }
    }

    game.player.render()

    /* 遍历在 allEnemies 数组中存放的作于对象然后调用你事先定义的 render 函数 */
    game.allEnemies.forEach(function (enemy) {
      enemy.render()
    })
  }
}

export default new Engine()
