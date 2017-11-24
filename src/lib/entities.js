import engine from './engine'
import game from './game'
import resources from './resources'

const COORDS = [
  63, 146, 229, 312, 395
]

// 随机获取实体初始化 y 坐标
function _getCoord () {
  return COORDS[Math.floor(Math.random() * 10) % COORDS.length]
}

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
    engine.ctx.drawImage(resources.get(this.sprite), this.x, this.y)
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
    this.y = _getCoord()
  }

  /**
   * @description 更新敌人的位置
   * @param dt ，表示时间间隙
   */
  update (dt) {
    this.x += dt * 150
  }
}

/**
 * 宝石💎
 */
class Gem extends Entity {
  constructor () {
    const TYPES = [
      'images/gem-blue.png',
      'images/gem-green.png',
      'images/gem-orange.png'
    ]
    const index = Math.floor(Math.random() * 10) % TYPES.length
    super()
    this.x = -103
    this.y = _getCoord() - 10
    this.score = (index + 1) * 100
    this.sprite = TYPES[index]
  }
}

/**
 * 岩石
 */
class Rock extends Entity {
  constructor () {
    super()
    this.sprite = 'images/rock.png'
    this.x = -103
    this.y = _getCoord()
  }
}

/**
 * 钥匙🔑
 */
class Key extends Entity {
  constructor () {
    super()
    this.sprite = 'images/key.png'
    this.x = -103
    this.y = _getCoord()
  }
}

/**
 * 红心♥️
 */
class Heart extends Entity {
  constructor () {
    super()
    this.sprite = 'images/heart.png'
    this.x = -103
    this.y = _getCoord()
  }
}

/**
 * 玩家
 */
class Player extends Entity {
  constructor () {
    super()
    this.sprite = Player.sprites[0]
    this.x = 202
    this.y = 405
    this.yPace = 83
    this.xPace = 101
  }

  handleInput (direction) {
    // 检测是否会与岩石碰撞
    function _checkRocksCollision (px, py) {
      for (const rock of game.allRocks) {
        if (game.checkCollision(px, py, rock.x, rock.y)) {
          return true
        }
      }
      return false
    }

    if (direction === 'left' && this.x > 0) {
      // 要撞到岩石的话，不移动
      if (_checkRocksCollision(this.x - this.xPace, this.y)) return
      if (this.x > 202) {
        this.x -= this.xPace
      } else {
        // 玩家在地图中间向左移动时，地图向右滚动
        game.rollMap()
      }
    } else if (direction === 'right' && this.x < 400) {
      if (_checkRocksCollision(this.x + this.xPace, this.y)) return
      this.x += this.xPace
    } else if (direction === 'up' && this.y > 0) {
      if (_checkRocksCollision(this.x, this.y - this.yPace)) return
      this.y -= this.yPace
    } else if (direction === 'down' && this.y < 400) {
      if (_checkRocksCollision(this.x, this.y + this.yPace)) return
      this.y += this.yPace
    }
  }

  reset () {
    this.x = 202
    this.y = 405
  }
}

Player.sprites = [
  'images/char-boy.png',
  'images/char-cat-girl.png',
  'images/char-horn-girl.png',
  'images/char-pink-girl.png',
]

export {
  Entity, Enemy, Player, Gem, Rock, Key, Heart
}
