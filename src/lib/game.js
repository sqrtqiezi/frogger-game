import { Entity, Enemy, Player, Gem, Rock, Key, Heart } from './entities'
import engine from './engine'
import resources from './resources'
import $ from 'jquery'

class Game {
  constructor () {
    this.status = 0 // 游戏执行状态：0 未开始；1 正在执行；2 游戏结束
    this.startTime = Date.now()
    this.allEnemies = []
    this.allGems = []
    this.allRocks = []
    this.key = null
    this.heart = null
    this.score = 0
    this.lives = 3
    this.player = new Player()
  }

  /**
   * 更新游戏状态
   */
  update () {
    // 每秒钟新增一只🐞
    if ((Date.now() - this.startTime) > 1000) {
      this.startTime = Date.now()
      this.allEnemies.push(new Enemy())
    }

    // 清除移出屏幕的实体
    function _clean (entities) {
      entities.forEach((item, index) => {
        if (item.x > 600) {
          entities.splice(index, 1)
        }
      })
    }

    _clean(this.allRocks)
    _clean(this.allGems)
    _clean(this.allEnemies)
    if (this.key !== null && this.key.x > 600) {
      this.key = null
    }
    if (this.heart !== null && this.heart.x > 600) {
      this.heart = null
    }
  }

  /**
   * 滚动地图（除玩家之外，所有实体向右移动一格）
   */
  rollMap () {
    // 滚动实体
    function _roll (entities) {
      if (Array.isArray(entities)) {
        entities.forEach(item => {
          item.x += 101
        })
      } else if (entities instanceof Entity) {
        entities.x += 101
      }
    }

    _roll(this.allEnemies)
    _roll(this.allGems)
    _roll(this.allRocks)
    _roll(this.key)
    _roll(this.heart)

    // 随机出现💎
    if (Math.floor(Math.random() * 100) % 5 === 0) {
      this.allGems.push(new Gem())
    }

    // 随机出现岩石
    if (Math.floor(Math.random() * 100) % 7 === 0) {
      this.allRocks.push(new Rock())
    }

    // 随机出现🔑
    if (this.key === null && Math.floor(Math.random() * 100) % 13 === 0) {
      this.key = new Key()
    }

    // 随机出现红心
    if (this.heart === null && Math.floor(Math.random() * 100) % 19 === 0) {
      this.heart = new Heart()
    }
  }

  /**
   * 重置游戏状态
   */
  reset () {
    this.player.reset()
    this.allEnemies = []
    this.allGems = []
    this.allRocks = []
  }

  /**
   * 碰撞检测
   */
  checkCollisions () {
    if (this.player.y < 73) {
      this.showError('擦，跳河了')
      this.lives--
      this.reset()
    }

    this.allEnemies.forEach(item => {
      if (this.checkCollision(this.player.x, this.player.y, item.x, item.y)) {
        this.showError('擦，出车祸了')
        this.lives--
        this.reset()
      }
    })

    this.allGems.forEach((item, index) => {
      if (this.checkCollision(this.player.x, this.player.y, item.x, item.y)) {
        this.pickGem(index)
      }
    })

    if (this.key !== null) {
      if (this.checkCollision(this.player.x, this.player.y, this.key.x, this.key.y)) {
        this.allEnemies = []
        this.key = null
        this.showPositive('释放大招')
      }
    }

    if (this.heart !== null) {
      if (this.checkCollision(this.player.x, this.player.y, this.heart.x, this.heart.y)) {
        this.lives++
        this.heart = null
        this.showPositive('生命加一')
      }
    }
  }

  /**
   * 检测逻辑
   */
  checkCollision (px, py, ex, ey) {
    return (Math.abs(px - ex) < 60 && Math.abs(py - ey) < 60)
  }

  /**
   * 拾取宝石
   * @param index
   */
  pickGem (index) {
    let score = this.allGems[index].score
    this.score += score
    this.allGems.splice(index, 1)
    this.showPositive(`捡到宝石，增加 ${score} 分`)
  }

  showPositive (content) {
    this._showMessage(content, 'positive')
  }

  showError (content) {
    this._showMessage(content, 'error')
  }

  _showMessage (content, type) {
    $(`.ui.${type}.message`).show(function () {
      $(`.ui.${type}.message > p`).text(content)
      setTimeout(() => {
        $(this).hide()
      }, 2000)
    })
  }

  // 初始化游戏
  init () {
    /**
     * 加载我们知道的需要来绘制我们游戏关卡的图片。然后把 init 方法设置为回调函数。
     * 那么当这些图片都已经加载完毕的时候游戏就会开始。
     */
    resources.load([
      'images/stone-block.png',
      'images/water-block.png',
      'images/grass-block.png',
      'images/enemy-bug.png',
      'images/char-boy.png',
      'images/gem-blue.png',
      'images/gem-green.png',
      'images/gem-orange.png',
      'images/rock.png',
      'images/heart.png',
      'images/key.png'
    ])
    resources.onReady(engine.init.bind(engine))

    // 绑定游戏按键
    resources.onReady(() => {
      // 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
      // 方法里面。你不需要再更改这段代码了。
      document.addEventListener('keyup', e => {
        const allowedKeys = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
        }
        this.player.handleInput(allowedKeys[e.keyCode])
      })

      // 开始
      $('.btn-start').one('click', () => {
        this.start()
        $('.btn-start').addClass('disabled')
      })
    })
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

  /**
   * 游戏是否已经运行？
   * @returns {boolean}
   */
  get isRunning () {
    return this.status === 1
  }
}

export default new Game()
