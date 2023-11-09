import { createTeris } from "./core/Teris";
import { SquarePageViewer } from "./core/viewer/SquarePageViewer";
import $ from 'jquery'

const teris = createTeris({ x: 3, y: 2 })

teris.squares.forEach(sq => {
  sq.viewer = new SquarePageViewer(sq, $('#root'))
})

$("#btnDown").click(function () {
  // 向下移动只需要改变方块组的中心点即可
  teris.centerPoint = {
    x: teris.centerPoint.x,
    y: teris.centerPoint.y + 1
  }
})