export const ON_SHOW_SECOND_PAGE:string = "on-show-second-page"; // 打开二级页面
export const ON_CHANGE_VIEW:string = "on-change-view"; // 切换视图
export const ON_CHARACTER_JUMP:string = "on-character-jump"; // 跳起来
export const ON_SHOW_TOOTIPS:string = "on-show-tootips"; // 展示说明

interface modelNameList {
    [key:string]:string
}
export const MODEL_NAME_LIST:modelNameList = {
    "car":"深夜汽车",
    "computer":"个人简介",
    "earth":"环绕地球",
    "firmament":"金属小盘",
    "money":"旋转金币",
    "mypikachu":"皮卡丘",
    "robot": "机器人",
    "rubikCube": "烘焙魔方",
    "tree": "发光小树",
}