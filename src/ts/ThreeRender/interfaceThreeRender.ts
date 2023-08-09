import { Ref } from "vue"
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
    type?: string, // 触发类型
    meshName?: string; // 要被作用的模型名称
    meshNameAll?: string; // 完整模型
    text?: string; // 文案
    textAll?: string; // 完整文案
}


export  {
    ThreeOption,
    MoveCameraTweenParams,
    DestroyModelParams,
    UserData,
}