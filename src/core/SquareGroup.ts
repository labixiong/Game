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

  public get squares() {
    return this._squares
  }


  public get centerPoint(): Point {
    return this._centerPoint
  }


  public set centerPoint(v: Point) {
    this._centerPoint = v;

    // 修改中心点的同时需要同步更改方块组中每个方块的坐标
    this._shape.forEach((s, i) => {
      this._squares[i].point = {
        x: this._centerPoint.x + s.x,
        y: this._centerPoint.y + s.y
      }
    })
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
      sq.point = {
        x: this._centerPoint.x + s.x,
        y: this._centerPoint.y + s.y
      }

      arr.push(sq)
    })

    this._squares = arr
  }

}

