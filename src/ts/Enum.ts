/** 点光源枚举 */
enum ENUM_LIGHT_HELPER {
  /** 点光源 */
  point = 1,  
  /** 聚光灯 */
  spot = 2,  
}

/** 点击物体移动类型枚举 */
enum ENUM_MESH_TYPE {
  /** 移动 */
  move = "move",  
  /** 看向的物体，可点击弹出的物体 */
  click = "click",  
  /** 文本 */
  text = "text",  
  /** 手指 */
  finger = "finger",   
  /** 进入 */
  enter = "enter",  
  /** 不存在的类型 */
  none = "none"  
}

/** 视图模式 */
enum ENUM_VIEW_TYPE {
  /**内部 */
  internal = "展厅内",  
  /**外部 */
  external = "展厅外",
  /**府视图 */
  vertical = "俯视图",
}

/** 按键快捷键 */
enum ENUM_MOUSE_KEY {
  keyW = "KeyW",
  keyS = "KeyS",
  keyA = "KeyA",
  keyD = "KeyD",
  keyV = "KeyV",
  space = "Space"
}



export { ENUM_LIGHT_HELPER, ENUM_MESH_TYPE, ENUM_VIEW_TYPE, ENUM_MOUSE_KEY };
