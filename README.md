# 俄罗斯方块游戏 {ignore=true}

[toc]

# 概述

使用技术：webpack + jquery + typescript + 面向对象开发

项目目的：

1. 学习TS如何结合webpack做开发
2. 巩固TS的知识
3. 锻炼逻辑思维能力
4. 体验面向对象编程的思想

学习方法：

1. 调整心态，不要浮躁
2. 理解->思考->实践->理解->.....

# 工程搭建

环境： 浏览器 + 模块化

webpack：构建工具，根据入口文件找寻依赖，打包

- 安装webpack
- 安装html-webpack-plugin 以某个html页面为模板
- 安装clean-webpack-plugin 打包资源生成前先清除打包目录内的文件
- 安装webpack-dev-server 启动开发服务器
- 安装ts相应的loader `ts-loader` / `awesome-typescript-loader` 它们依赖typescript

`@types/node库 要跟本地的nodejs版本保持一致，大版本保持一致即可，否则会报 node_modules/@types/node/ts4.8/test.d.ts:647:22 - error TS1005: ',' expected. 类似的错误`

# 游戏开发

原则：
1. 单一职能原则：每个类只做跟它相关的一件事
2. 开闭原则：系统中的类，应该对扩展开放，对修改关闭

基于以上两个原则，系统中使用如下模式：

数据-界面分离模式

## 开发小方块类

小方块类：它能处理自己的数据，知道什么时候需要显示，但不知道怎么显示

## 小方块的显示类

作用: 将小方块显示到页面中

文件位置：`src/core/viewer/SquarePageViewer.ts`

SquarePageViewer类来控制显示，需要给定两个属性值（需要显示的方块，以及方块展示到什么html容器中）

需要继承接口 IViewer 来实现show方法和remove方法， SquarePageViewer的实例对象给方块的显示者(viewer)赋值

## 开发方块的组合类

利用基本的方块来拼凑出各种形状的俄罗斯方块

组合类中的属性： 

- 小方块的数组

**思考：**

1. 该数组的组成能不能发生变化  

    答：不能发生变化，是只读的数组

2. 怎么组合？位置怎么定？该数组的每一项从何而来？

    答：一个方块的组合取决于组合的形状（一组相对坐标的组合，该组合中有一个特殊的坐标来表示形状的中心）

    如果知道形状、中心点和颜色，就可以设置小方块的数组

## 俄罗斯方块的生产者

文件位置: `src/core/Teris.ts`  主要用来生成随机的一个俄罗斯方块组,颜色和形状随机,传入中心点即可 