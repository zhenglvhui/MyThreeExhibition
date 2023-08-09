import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { XYZ } from "./commonInterface";
 

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
  
export { ItCommonRenderData, ItCommonRenderItemData, ItPlayAllSpecialAnimateFn, ItFnArr, ItControlsObject }