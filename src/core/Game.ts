import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { createTeris } from "./Teris";
import { TerisRule } from "./TerisRule";
import { GameStatus, GameViewer, MoveDirection } from "./types";

export class Game {
  // 游戏状态
  private _gameStatus: GameStatus = GameStatus.init

  // 当前玩家操作的方块, 初始化状态下未操作任何方块，所以设置为可选参数
  private _curTeris?: SquareGroup

  // 下一个方块
  private _nextTeris: SquareGroup = createTeris({ x: 0, y: 0 })

  // 自动下落计时器
  private _timer?: number

  // 自动下落的时间有可能随着游戏的难度或者积分的高低而递减
  private _duration: number = 1000

  // 当前游戏中,已存在的小方块
  // 这里不设置类型SquareGroup的原因是还需要进行消除,作为单个方块的数组比较好处理
  private _exists: Square[] = []


  /**
   * 游戏开始，首先要改变游戏的状态,改编为游戏正在进行中的状态
   */
  start() {
    // 1. 改变当前状态为开始状态
    if (this._gameStatus === GameStatus.playing) {
      return
    }

    this._gameStatus = GameStatus.playing

    // 2. 需要考虑的是curTeris有可能没有值，需要赋初值
    // 怎么赋值? 一开始就要赋值为下一个方块组的值,下一组方块的值赋值为初值
    if (!this._curTeris) {
      this.switchTeris()
    }

    // 3. 方块组自动下落
    this.autoDown()
  }

  /**
   * 暂停函数
   */
  pause() {
    // 只有当游戏正在进行中的时候才可以暂停,并清除定时器
    if (this._gameStatus === GameStatus.playing) {
      this._gameStatus = GameStatus.pause
      clearInterval(this._timer)
      this._timer = undefined
    }
  }

  controlLeft() {
    if (this._curTeris && this._gameStatus === GameStatus.playing) {
      TerisRule.move(this._curTeris, MoveDirection.left, this._exists);
    }
  }

  controlRight() {
    if (this._curTeris && this._gameStatus === GameStatus.playing) {
      TerisRule.move(this._curTeris, MoveDirection.right, this._exists);
    }
  }

  controlDown() {
    if (this._curTeris && this._gameStatus === GameStatus.playing) {
      TerisRule.moveDirectly(this._curTeris, MoveDirection.down, this._exists);
      this.hitBottom()
    }
  }

  controlRotate() {
    if (this._curTeris && this._gameStatus === GameStatus.playing) {
      TerisRule.rotate(this._curTeris, this._exists);
    }
  }

  // 在项目最开始的时候,面板内没有内容,但是下一个方块组已经出现了,所以需要把下一个方块显示出来
  constructor(private _viewer: GameViewer) {
    // 游戏最开始的时候，产生下一个方块的时候要重新设置中心点坐标，因为有可能下一个方块会出界
    this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris)
    this._viewer.showNext(this._nextTeris)
  }

  /**
   * 切换方块
   */
  private switchTeris() {
    this._curTeris = this._nextTeris
    // 重新设置中心点，保证游戏面板中的模块在面板中心落下
    this.resetCenterPoint(GameConfig.panelSize.width, this._curTeris)
    this._nextTeris = createTeris({ x: 0, y: 0 })
    // 重新设置中心点，保证右侧面板中的下一个方块组不会越界到游戏面板中
    this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris)
    // 切换的时候将当前的方块显示出来,因为当前方块已经赋值为下一个方块
    this._viewer.switch(this._curTeris)
    // 切换过后,此时新的方块已经产生了
    this._viewer.showNext(this._nextTeris)
  }

  /**
   * 自动下落
   */
  private autoDown() {
    // 判断一下当前有无计时器
    if (this._timer || this._gameStatus !== GameStatus.playing) {
      return
    }

    // 这里的setInterval会根据不同的环境来返回不同的类型
    // 目前项目目前的环境是浏览器环境,由于node_modules/@types模块中包含node文件夹 所以判断当前为node环境
    // 所以会造成this._timer报错,因为_timer的类型是number
    // 所以把node_modules/@types/node文件夹直接删除即可
    this._timer = setInterval(() => {
      if (this._curTeris) {
        if (!TerisRule.move(this._curTeris, MoveDirection.down, this._exists)) {
          this.hitBottom()
        }
      }
    }, this._duration)
  }


  /**
   * 重新设置右侧面板中下一个方块组的中心点，以达到让该方块出现在区域的中上方，不会越界到面板中
   * @param width 面板的逻辑宽度
   * @param teris 当前方块的对象
   */
  private resetCenterPoint(width: number, teris: SquareGroup) {
    const x = Math.ceil(width / 2) - 1 // 整个面板的中心
    const y = 0
    teris.centerPoint = { x, y }

    // 如果有小方块的y坐标小于0，则说明需要向下移动
    // 此处有可能出现死循环，所以需要强制改变y坐标的值，不能通过TerisRule.move(teris, MoveDirection.down)这样的方式向下移动
    while (teris.squares.some(sq => sq.point.y < 0)) {
      teris.squares.forEach(sq => {
        sq.point = {
          x: sq.point.x,
          y: sq.point.y + 1
        }
      })
    }
  }


  /**
   * 触底操作
   */
  private hitBottom() {
    // 先把当前方块组的每个小方块的坐标都保存下来
    // 这里对_curTeris属性做非空断言是因为当前方块组已经触底,说明存在方块组,所以不可能为空
    this._exists.push(...this._curTeris!.squares)
    // 得到消除行的数量(即消除了几行)
    const num = TerisRule.deleteSquares(this._exists)
    // 切换方块,继续下落
    this.switchTeris()
  }

}