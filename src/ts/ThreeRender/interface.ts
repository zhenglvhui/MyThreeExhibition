import { Ref } from "vue"

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
    ThreeOption
}