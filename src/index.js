import game from './lib/game'
import $ from 'jquery'

// 初始化游戏
game.init()

// 将 game 暴露到全局，方便调试
window.game = game
