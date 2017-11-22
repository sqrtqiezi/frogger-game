import engine from './engine'
import resources from './resources'

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

export {
  Enemy, Player
}
