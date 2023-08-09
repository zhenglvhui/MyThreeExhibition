// 点光源枚举
enum ENUM_LIGHT_HELPER {
  point = 1, // 点光源
  spot = 2, // 聚光灯
}

// 点击物体移动类型枚举
enum ENUM_MESH_TYPE {
  move = "move", // 移动
  click = "click", // 看向的物体，可点击弹出的物体
  text = "text", // 文本
  finger = "finger", // 手指 
  enter = "enter", // 进入
}

// 视图模式
enum ENUM_VIEW_TYPE {
  internal = "展厅内", // 内部
  external = "展厅外", //外部
  vertical = "俯视图", //府视图
}


export { ENUM_LIGHT_HELPER, ENUM_MESH_TYPE, ENUM_VIEW_TYPE};
