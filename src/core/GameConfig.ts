export default {
  // 面板的大小, 10 * 10 的方形格子,并不是实际的宽度
  panelSize: {
    width: 12,
    height: 20
  },

  // 右侧面板的逻辑宽高，8代表8个格子
  nextSize: {
    width: 5,
    height: 5
  },
  levels: [
    { score: 0, duration: 1500 },
    { score: 100, duration: 1000 },
    { score: 200, duration: 800 },
    { score: 500, duration: 700 },
    { score: 800, duration: 600 },
    { score: 1200, duration: 500 },
    { score: 1800, duration: 400 },
    { score: 3000, duration: 300 },
    { score: 4000, duration: 300 },
    { score: 5000, duration: 200 },
    { score: 6000, duration: 100 }
  ]
}