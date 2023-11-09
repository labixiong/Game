/**
 * 方块类，最小的一个单元块
 * 
 * 特性：
 * 1. 逻辑坐标 - 游戏面板会被切分为x * y的格子面板，逻辑坐标为[0, 0], [1, 0], ...,不能设置为定位中的top left值，这样就破坏了数据和界面分离的模式
 * 2. 颜色
 */

import { IViewer, Point } from "./types"

export class Square {

  // 由于坐标只知道显示的位置，不知道如何去显示，所以需要单独设置一个显示者属性，来控制如何显示
  private _viewer?: IViewer;
  private _point: Point = {
    x: 0,
    y: 0
  }
  private _color: string = ""

  public get point() {
    return this._point
  }

  public set point(n) {
    this._point = n

    // 设置坐标的时候判断,如果有显示者,代表需要显示,则进行展示
    if (this._viewer) {
      this._viewer.show()
    }
  }

  public get color() {
    return this._color
  }

  public set color(val) {
    this._color = val;
  }

  public get viewer() {
    return this._viewer
  }

  public set viewer(v) {
    this._viewer = v

    if (v) {
      v.show()
    }
  }
}
