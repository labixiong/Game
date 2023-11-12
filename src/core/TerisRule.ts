import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { MoveDirection, Point, Shape } from "./types";

function isPoint(obj: any): obj is Point {
  if (obj.x !== undefined) {
    return true
  }
  return false
}

/**
 * 根据游戏规则判断各种情况
 */
export class TerisRule {
  /**
   * 判断某个形状的方块是否能移动到目标位置
   */
  static canIMove(shape: Shape, targetPoint: Point, exists: Square[]): boolean {
    // 需要判断多种情况
    // 1. 边界判断
    // 假设已经移动到了目标位置targetPoint，先算出当前形状下所有格子的坐标
    const targetSquaresPoint: Point[] = shape.map(s => {
      return {
        x: s.x + targetPoint.x,
        y: s.y + targetPoint.y
      }
    })

    // 其次对数组中的每个坐标进行判断
    let result = targetSquaresPoint.some(p => {
      return p.x < 0 || p.x > GameConfig.panelSize.width - 1 || p.y < 0 || p.y > GameConfig.panelSize.height - 1
    })

    if (result) {
      return false
    }

    // 判断是否与已有方块有重叠
    // 如何判断? 判断目标位置的坐标是否已经存在exists数组中
    result = targetSquaresPoint.some(p => exists.some(e => e.point.x === p.x && e.point.y === p.y))
    if (result) {
      return false
    }

    return true
  }

  static move(teris: SquareGroup, targetPoint: Point, exists: Square[]): boolean
  static move(teris: SquareGroup, direction: MoveDirection, exists: Square[]): boolean
  static move(teris: SquareGroup, targetPointOrDirection: Point | MoveDirection, exists: Square[]): boolean {
    // 这里可以书写类型保护,确保targetPointOrDirection是Point或者MoveDirection中的一种
    if (isPoint(targetPointOrDirection)) {
      if (this.canIMove(teris.shape, targetPointOrDirection, exists)) {
        teris.centerPoint = targetPointOrDirection
        return true
      }

      return false
    } else {
      const direction = targetPointOrDirection;
      let targetPoint: Point;
      if (direction === MoveDirection.down) {
        targetPoint = {
          x: teris.centerPoint.x,
          y: teris.centerPoint.y + 1
        }
      }
      else if (direction === MoveDirection.left) {
        targetPoint = {
          x: teris.centerPoint.x - 1,
          y: teris.centerPoint.y
        }
      }
      else {
        targetPoint = {
          x: teris.centerPoint.x + 1,
          y: teris.centerPoint.y
        }
      }

      // 移动完之后再把当前的形状和坐标传入进去并重新调用函数
      return this.move(teris, targetPoint, exists)
    }
  }

  // 直达,某个方向的边界
  static moveDirectly(teris: SquareGroup, direction: MoveDirection, exists: Square[]) {
    while (this.move(teris, direction, exists)) { }
  }

  // 旋转后的目标坐标也不能超出边界
  static rotate(teris: SquareGroup, exists: Square[]): boolean {
    const newShape = teris.afterRotateShape() // 得到旋转之后的形状
    if (this.canIMove(newShape, teris.centerPoint, exists)) {
      teris.rotate()
      return true
    } else {
      return false
    }
  }

  static deleteSquares(exists: Square[]): number {
    // 获取y坐标的数组
    let ys = exists.map(e => e.point.y)
    // 获取y的最大值和最小值
    const maxY = Math.max(...ys)
    const minY = Math.min(...ys)

    let num: number = 0

    for (let y = minY; y <= maxY; y++) {
      if (this.deleteLine(exists, y)) {
        num++
      }
    }

    return num
  }

  static deleteLine(exists: Square[], y: number): boolean {
    // 获取当前纵坐标下所有的方块
    const squares = exists.filter(e => e.point.y === y)

    // 如果当前行的所有方块的数量等于游戏面板的逻辑宽度,那么就可以进行消除
    if (squares.length === GameConfig.panelSize.width) {
      squares.forEach(sq => {
        // 从面板中进行消除
        if (sq.viewer) {
          sq.viewer.remove()
        }
        // 从数据中删除
        exists.splice(exists.indexOf(sq), 1)
      })

      // 改变其余在消除行上方的方块y坐标
      exists.filter(e => e.point.y < y).forEach(e => {
        e.point = {
          x: e.point.x,
          y: e.point.y + 1
        }
      })


      return true
    }

    return false
  }
}