import { Enemy, Player } from './entities'
import engine from './engine'
import resources from './resources'

class Game {
  constructor () {
    this.status = 0 // 游戏执行状态：0 未开始；1 正在执行；2 游戏结束
    this.startTime = Date.now()
    this.allEnemies = [
    ]
    this.player = new Player()
  }

  update () {
    // 每秒钟新增一只🐞
    if ((Date.now() - this.startTime) > 1000) {
      this.startTime = Date.now()
      this.allEnemies.push(new Enemy())

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

  // 初始化游戏
  init () {
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
     * 加载我们知道的需要来绘制我们游戏关卡的图片。然后把 init 方法设置为回调函数。
     * 那么党这些图片都已经加载完毕的时候游戏就会开始。
     */
    resources.load([
      'images/stone-block.png',
      'images/water-block.png',
      'images/grass-block.png',
      'images/enemy-bug.png',
      'images/char-boy.png'
    ])
    resources.onReady(engine.init.bind(engine))
  }

  /**
   * 游戏开始执行
   */
  start () {
    this.status = 1
  }

  /**
   * 游戏结束
   */
  end () {
    this.status = 2
  }

  get isRunning () {
    return this.status === 1
  }
}

const game = new Game()

export default game
