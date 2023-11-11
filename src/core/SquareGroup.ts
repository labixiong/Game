import { Square } from "./Square";
import { Point, Shape } from "./types";

/**
 * 方块组
 * 
 * 如果要设置方块组，首先就要知道需要设置的形状、中心点坐标以及方块组颜色
 */
export class SquareGroup {
  // 只读数组 两种写法都可
  // private _squares: ReadonlyArray<Square> = []
  private _squares: readonly Square[] = []

  // 旋转方向是否为顺时针，true表示顺时针，false表示逆时针
  protected isClock: boolean = true

  public get squares() {
    return this._squares
  }


  public get centerPoint(): Point {
    return this._centerPoint
  }


  public set centerPoint(v: Point) {
    this._centerPoint = v;

    // 修改中心点的同时需要同步更改方块组中每个方块的坐标
    this.setSquarePoints()
  }

  public get shape() {
    return this._shape
  }

  constructor(
    private _shape: Shape, // 形状，坐标数组,传入相对方块组坐标的数组
    private _centerPoint: Point, // 中心点坐标，是相对于单独的方块组的中心点坐标并不是相对于面板
    private _color: string
  ) {
    const arr: Square[] = []

    this._shape.forEach(s => {
      const sq = new Square()
      sq.color = this._color
      arr.push(sq)
    })

    this._squares = arr
    this.setSquarePoints()
  }


  /**
   * 根据旋转方向isClock来得到新的形状
   * 
   * 只是计算形状,并未真正发生旋转
   */
  afterRotateShape(): Shape {
    // 顺时针旋转得到的规律
    // 之前的x，y坐标旋转过后的坐标是 -y，x
    if (this.isClock) {
      return this._shape.map(s => {
        return {
          x: -s.y,
          y: s.x
        }
      })
    } else {
      // 逆时针旋转的规律是x,y 旋转过后是y, -x
      return this._shape.map(s => {
        return {
          x: s.y,
          y: -s.x
        }
      })
    }
  }

  // 根据中心点坐标以及形状来重新设置每个方块的坐标
  private setSquarePoints() {
    this._shape.forEach((p, i) => {
      this._squares[i].point = {
        x: this._centerPoint.x + p.x,
        y: this._centerPoint.y + p.y
      }
    })
  }


  // 旋转函数
  rotate() {
    const newShape = this.afterRotateShape()
    this._shape = newShape

    this.setSquarePoints()
  }

}

