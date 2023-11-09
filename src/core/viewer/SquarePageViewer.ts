/**
 * 显示一个小方块到页面中
 * 
 * 前提条件:
 * 1. 需要知道显示的哪一个方块
 * 2. 需要知道将方块显示到哪个容器中
 */

import { Square } from "../Square";
import { IViewer } from "../types";
import PageConfig from "./PageConfig";
import $ from 'jquery'

export class SquarePageViewer implements IViewer {
  // 方块在页面中就是一个dom对象
  private dom?: JQuery<HTMLElement>
  // 是否已经移除过了, 默认没有移除
  private isRemove: boolean = false

  constructor(
    private square: Square,
    private container: JQuery<HTMLElement>
  ) {
  }

  // 显示函数
  show(): void {
    if (this.isRemove) {
      return;
    }
    if (!this.dom) {
      // 先设置固定不变的值
      this.dom = $("<div>").css({
        position: 'absolute',
        width: PageConfig.SquareSize.width,
        height: PageConfig.SquareSize.height,
        border: '1px solid #ccc',
        boxSizing: 'border-box'
      }).appendTo(this.container)
    }

    // 设置动态值
    this.dom.css({
      left: this.square.point.x * PageConfig.SquareSize.width,
      top: this.square.point.y * PageConfig.SquareSize.height,
      background: this.square.color
    })
  }

  // 移除显示函数
  // 坐标信息还在，如果重新显示的话，会在消失前的位置重新显示
  remove(): void {
    if (this.dom && !this.isRemove) {
      this.dom.remove()
      this.isRemove = true
    }
  }
}