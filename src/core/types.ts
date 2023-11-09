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