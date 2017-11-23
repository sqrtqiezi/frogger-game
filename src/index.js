import game from './lib/game'
import $ from 'jquery'

// 初始化游戏
game.init()

// 绑定游戏开始
$('.btn-start').one('click', function () {
  game.start()
  $(this).addClass('disabled')
})

// 将 game 暴露到全局，方便调试
window.game = game
