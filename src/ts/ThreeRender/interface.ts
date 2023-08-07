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


export {
    ThreeOption,
    MoveCameraTweenParams  ,
    DestroyModelParams
}