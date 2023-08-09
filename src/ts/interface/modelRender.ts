import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { XYZ } from "./commonInterface";
import { Ref } from "vue"
import { ENUM_MESH_TYPE } from "../Enum";


interface ItFnArr {
    fn: string;
    fnParams: any;
}
interface ItPlayAllSpecialAnimateFn {
    animationName: String;
    fnArr: ItFnArr[];
}

type ItControlsObject = {
    [propsName in keyof OrbitControls]?: any;
};

interface ItCommonRenderItemData {
    camraPosition?: XYZ;  // 相机的位置 
    glbUrl?: string;  // 要加载glb路径
    controlsObject?: ItControlsObject;  // 控制器的限制范围
    isNeedAmbientLight?: boolean; // 是否需要环境光
    ambientLightColor?: number; // 环境灯光颜色 
    ambientIntensity?: number; // 环境光强度
    isNeedCameraPointLight?: boolean;  // 是否需要相机上的点光源
    cameraPointLightColor?: number; // 相机上的点光源颜色
    cameraPointLightIntensity?: number; // 相机上的点光源强度
    intensityDivided?: number; // 功率要除以的倍数
    isSelfRotation?: boolean;  // 模型是否自转
    renderOutputColorSpace?: THREE.ColorSpace; // render颜色类型
    playAllSpecialAnimateFn?: ItPlayAllSpecialAnimateFn[]; // 动画执行Fn    // AnimationAction 中的方法 // [{animationName:'', fnArr: [{fn:'', fnParams:''}]}]
}
interface ItCommonRenderData {
    [propName: string]: ItCommonRenderItemData;
}


interface MoveCameraTweenParams {
    movePosition: THREE.Vector3, // 要移动到的位置  
    targetPosition: THREE.Vector3, // 要看向的位置
    isInternal?: boolean, //是否内部浏览     
    cb?: (...arg: any[]) => void, // 回调  
    animateTime?: number // 动画执行时间      
}

interface DestroyModelParams<K extends keyof HTMLElementEventMap> {
    modelScene: THREE.Group,
    type?: K,
    throttleOnDocumentMouseMove?: (this: HTMLElement, event: HTMLElementEventMap[K]) => void
}

interface ThreeOption {
    webGLRendererParameters?: THREE.WebGLRendererParameters,
    devicePixelRatio?: number,
    renderWidth?: number,
    renderHeight?: number,
    renderBackgroundColor?: THREE.ColorRepresentation
    renderAlpha?: number,
    renderOutputColorSpace?: THREE.ColorSpace,
    renderContainer: Ref<HTMLElement | null>,
    renderPhysicallyCorrectLights?: boolean,
    renderShadowMapEnabled?: boolean,
    cameraFov: number,
    cameraNear: number,
    cameraFar: number,
    cameraPosition: THREE.Vector3,
    blgUrl: string
}

interface UserData {
    name: string; // 模型名称
    type: ENUM_MESH_TYPE, // 触发类型
    meshName: string; // 要被作用的模型名称
    meshNameAll: string; // 完整模型
    text: string; // 文案
    textAll: string; // 完整文案
}

interface MoveMeshOptions {
    resetPosition: THREE.Vector3,  // 重生点
    resetY: number,  // 掉落高度
    speed: number,// 速度
    jumpHeight: number, // 跳起高度
    gravity: number // 重力
}

export {
    ItCommonRenderData, ItCommonRenderItemData, ItPlayAllSpecialAnimateFn, ItFnArr, ItControlsObject,
    MoveCameraTweenParams, DestroyModelParams, ThreeOption, UserData, MoveMeshOptions
}