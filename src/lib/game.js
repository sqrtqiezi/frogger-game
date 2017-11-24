import { Entity, Enemy, Player, Gem, Rock, Key, Heart } from './entities'
import engine from './engine'
import resources from './resources'
import $ from 'jquery'
import moment from 'moment'

/**
 * Game 类，实现全部游戏逻辑
 */
class Game {
  constructor () {
    this.status = 0 // 游戏执行状态：0 未开始；1 正在执行；2 游戏结束
    this.startTime = null
    this.endTime = null
    this.bugTime = Date.now()
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
    const now = Date.now()
    if (now - this.bugTime > 1000) {
      this.bugTime = Date.now()
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
    if (this.heart === null && Math.floor(Math.random() * 100) % 17 === 0) {
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
      this.showError('哎呀，跳河了')
      this.subtractLife()
    }

    this.allEnemies.forEach(item => {
      if (this.checkCollision(this.player.x, this.player.y, item.x, item.y)) {
        this.showError('哎呀，出车祸了')
        this.subtractLife()
      }
    })

    this.allGems.forEach((item, index) => {
      if (this.checkCollision(this.player.x, this.player.y, item.x, item.y)) {
        this.pickGem(index)
      }
    })

    if (this.key !== null) {
      if (this.checkCollision(this.player.x, this.player.y, this.key.x, this.key.y)) {
        this.pickKey()
      }
    }

    if (this.heart !== null) {
      if (this.checkCollision(this.player.x, this.player.y, this.heart.x, this.heart.y)) {
        this.pickHeart()
      }
    }
  }

  /**
   * 碰撞检测逻辑
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

  /**
   * 拾取钥匙
   */
  pickKey () {
    this.allEnemies = []
    this.key = null
    this.showPositive('释放大招')
  }

  /**
   * 拾取红心
   */
  pickHeart () {
    this.lives++
    this.heart = null
    this.showPositive('生命加一')
  }

  /**
   * 生命值减一
   */
  subtractLife () {
    this.lives--
    this.reset()
    if (this.lives < 1) {
      // 游戏结束
      this.end()
    }
  }

  /**
   * 渲染游戏控制面板
   */
  renderPanel () {
    $('.panel .time.value').text(this.duration)
    $('.panel .scores.value').text(this.score)

    let htmlLives
    if (this.lives > 0) {
      htmlLives = []
      for (let i = 0; i < this.lives; i++) {
        htmlLives.push('<i class="heart icon"></i>')
      }
      htmlLives = htmlLives.join('')
    } else {
      htmlLives = '<span>Game Over</span>'
    }
    $('.panel .lives.value').html(htmlLives)

    $('.panel .char.value img').attr('src', this.player.sprite)
  }

  /**
   * 显示奖励消息
   * @param content
   */
  showPositive (content) {
    this._showMessage(content, 'positive')
  }

  /**
   * 显示惩罚消息
   * @param content
   */
  showError (content) {
    this._showMessage(content, 'error')
  }

  /**
   * 显示消息
   * @param content
   * @param type
   * @private
   */
  _showMessage (content, type) {
    $(`.ui.${type}.message`).show(function () {
      $(`.ui.${type}.message > p`).text(content)
      setTimeout(() => {
        $(this).hide()
      }, 2000)
    })
  }

  /**
   * 游戏开始
   */
  start () {
    this.status = 1
    this.startTime = Date.now()
  }

  /**
   * 游戏重新开始
   */
  restart () {
    this.lives = 3
    this.score = 0
    this.status = 1
    this.startTime = Date.now()
    this.reset()
  }

  /**
   * 游戏结束
   */
  end () {
    const self = this

    $('.ui.game-over.modal .time.value').text(this.duration)
    $('.ui.game-over.modal .score.value').text(this.score)

    $('.ui.game-over.modal').modal({
      closable: false,
      onApprove () {
        self.restart()
      }
    }).modal('show')

    this.endTime = Date.now()
    setTimeout(() => {
      this.status = 2
    }, 0)
  }

  /**
   * 游戏是否已经运行？
   * @returns {boolean}
   */
  get isRunning () {
    return this.status === 1
  }

  /**
   * 游戏运行时长
   * @returns {*}
   */
  get duration () {
    if (this.status === 0) {
      return '00:00:00'
    }
    let duration
    if (this.status === 1) {
      duration = moment.duration(Date.now() - this.startTime)
    } else { // status === 2 游戏结束
      duration = moment.duration(this.endTime - this.startTime)
    }
    const hours = duration.get('hours')
    const minutes = duration.get('minutes')
    const seconds = duration.get('seconds')

    function _prefix (num) {
      if (num < 10) {
        return `0${num}`
      }
      return `${num}`
    }

    return `${_prefix(hours)}:${_prefix(minutes)}:${_prefix(seconds)}`
  }

  /**
   * 初始化游戏
   */
  init () {
    this.loadResources()
    this.initController()
    this.initPanel()
  }

  /**
   * 加载游戏资源
   */
  loadResources () {
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
      'images/char-cat-girl.png',
      'images/char-horn-girl.png',
      'images/char-pink-girl.png',
      'images/char-princess-girl.png',
      'images/gem-blue.png',
      'images/gem-green.png',
      'images/gem-orange.png',
      'images/rock.png',
      'images/heart.png',
      'images/key.png'
    ])
    // 资源加载完成之后，初始化游戏引擎
    resources.onReady(engine.init.bind(engine))
  }

  /**
   * 初始化游戏控制
   */
  initController () {
    // 绑定游戏按键
    resources.onReady(() => {
      // 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput() 方法里面
      document.addEventListener('keyup', e => {
        const allowedKeys = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
        }
        this.player.handleInput(allowedKeys[e.keyCode])
      })

      // 「游戏开始」按钮
      $('.btn-start').one('click', () => {
        this.start()
        $('.btn-start').addClass('disabled')
      })
    })
  }

  /**
   * 初始化显示面板
   */
  initPanel () {
    // 初始化控制面板
    $('.btn-change-char').popup()
    $('.btn-change-char').click(() => {
      $('.ui.char-change.modal').modal('show')
    })

    // 初始化角色选择弹窗
    const htmlChars = []
    for (const char of Player.sprites) {
      htmlChars.push(`<div class="ui medium image">
        <a href="#" class="btn-char" data-sprite="${char}">
          <img src="${char}">
        </a>
      </div>`)
    }
    $('.ui.char-change.modal .image.content').html(htmlChars.join(''))

    const self = this
    $('.ui.char-change.modal .btn-char').click(function () {
      self.player.sprite = $(this).data('sprite')
      self.renderPanel()
      $('.ui.char-change.modal').modal('hide')
    })
  }
}

export default new Game()
