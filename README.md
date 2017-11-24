前端纳米学位街机游戏项目
===============================

## 评审标准

[https://review.udacity.com/#!/rubrics/499/view](https://review.udacity.com/#!/rubrics/499/view)

## 演示地址
[http://qiezi.io/frogger-game/index.html](http://qiezi.io/frogger-game/index.html)

# 代码说明
项目主要代码在 **/src/lib** 目录下:

* game.js 暴露 game 对象，实现游戏的运行逻辑；
* engine.js 暴露 engine 对象，实现游戏的渲染逻辑；
* resources.js 暴露 resources 对象，图片资源到加载与缓存；
* entities.js 暴露游戏实体类，游戏实体类都是 Entity 类的子类，需要实现 update 和 render 方法。实体类包括：
  * Enemy 敌人
  * Player 游戏玩家
  * Rock 石头，障碍物
  * Gem 宝石，Blue 100 分，Green 200 分，Yellow 300 分
  * Heart 红心，为玩家加一条生命
  * Key 钥匙，清空全场敌人
 