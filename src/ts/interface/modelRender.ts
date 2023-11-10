import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { XYZ } from "./commonInterface";
import { Ref } from "vue"
import { ENUM_MESH_TYPE } from "../Enum";


interface ItFnArr {
    fn: string;
    fnParams: any;
}

// AnimationAction 中的方法  [{animationName:'', fnArr: [{fn:'', fnParams:''}]}]
interface ItPlayAllSpecialAnimateFn {
    animationName: String;
    fnArr: ItFnArr[]; 
}

type ItControlsObject = {
    [propsName in keyof OrbitControls]?: any;
};

interface ItCommonRenderItemData {
    /** 相机的位置 */
    camraPosition?: XYZ;    
    /** 要加载glb路径 */
    glbUrl?: string;   
    /** 控制器的限制范围 */
    controlsObject?: ItControlsObject;   
    /** 是否需要环境光 */
    isNeedAmbientLight?: boolean;  
    /** 环境灯光颜色 */
    ambientLightColor?: number;   
    /** 环境光强度 */
    ambientIntensity?: number;  
    /** 是否需要相机上的点光源 */
    isNeedCameraPointLight?: boolean;   
    /** 相机上的点光源颜色 */
    cameraPointLightColor?: number;  
    /** 相机上的点光源强度 */
    cameraPointLightIntensity?: number;  
    /** 功率要除以的倍数 */
    intensityDivided?: number;  
    /** 模型是否自转 */
    isSelfRotation?: boolean;   
    /** render颜色类型 */
    renderOutputColorSpace?: THREE.ColorSpace;  
    /** 动画执行Fn */
    playAllSpecialAnimateFn?: ItPlayAllSpecialAnimateFn[];  
}
interface ItCommonRenderData {
    [propName: string]: ItCommonRenderItemData;
}


interface MoveCameraTweenParams {
    /** 要移动到的位置 */
    movePosition: THREE.Vector3,  
     /** 要看向的位置 */
    targetPosition: THREE.Vector3, 
     /** 是否内部浏览 */
    isInternal?: boolean,    
     /** 回调 */
    cb?: (...arg: any[]) => void, 
     /** 更新回调 */ 
    updateCb?:(...arg: any[]) => void,
     /** 动画执行时间 */
    animateTime?: number      
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
    /** 模型名称  */
    name: string; 
    /** 触发类型  */
    type: ENUM_MESH_TYPE,  
    /** 要被作用的模型名称  */
    meshName: string; 
    /** 完整模型  */
    meshNameAll: string;  
    /** 文案  */
    text: string;
}

interface MoveMeshOptions {
    /** 重生点 */
    resetPosition: THREE.Vector3,  
    /** 掉落高度 */
    resetY: number, 
    /** 速度 */ 
    speed: number,
    /** 跳起高度 */
    jumpHeight: number, 
    /** 重力 */
    gravity: number 
}


export {
    ItCommonRenderData, ItCommonRenderItemData, ItPlayAllSpecialAnimateFn, ItFnArr, ItControlsObject,
    MoveCameraTweenParams, DestroyModelParams, ThreeOption, UserData, MoveMeshOptions
}