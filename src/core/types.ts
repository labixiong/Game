import { SquareGroup } from "./SquareGroup";

/**
 * 逻辑坐标接口，为防止通过point.x，point.y的方式进行修改，所以属性设置为只读
 */
export interface Point {
  readonly x: number,
  readonly y: number
}

/**
 * 显示者，控制坐标如何去显示
 */
export interface IViewer {
  // 显示函数
  show(): void;
  // 移除,不再显示
  remove(): void;
}

/**
 * 形状类型 坐标数组
 */
export type Shape = Point[]

/**
 * 移动方向枚举
 */
export enum MoveDirection {
  left,
  right,
  down
}


/**
 * 游戏状态枚举
 */
export enum GameStatus {
  init, // 未开始
  playing, // 进行中
  pause, // 暂停
  over // 游戏结束
}

/**
 * 游戏显示接口
 */
export interface GameViewer {
  /**
   * 显示下一个方块
   * @param teris 下一个方块的对象
   */
  showNext(teris: SquareGroup): void;

  /**
   * 切换方块时涉及到显示状态改变
   * @param teris 切换的方块对象
   */
  switch(teris: SquareGroup): void;
}
