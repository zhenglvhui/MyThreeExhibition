import ThreeBase from "./ThreeBase";
import * as THREE from 'three'

export default class ShowdowControls {

    // 显示阴影公共处理方法  isReceiveShadow 是否投射阴影
    static showShowDow(mesh: any, isReceiveShadow: boolean = false, isCastShadow: boolean = false) {
        if (isReceiveShadow || isCastShadow) {
            mesh.castShadow = true;
            mesh.material.side = THREE.DoubleSide;
            mesh.material.shadowSide = THREE.BackSide;
        }
        if (isReceiveShadow) {
            mesh.receiveShadow = true;
        }
    };

    // 显示灯光公共处理方法 isCastShadow 是否显示阴影 intensityDivided导出转换的功率的倍率
    static showLight(light: any, isCastShadow: boolean = false, intensityDivided: number = 1) {
        light.intensity = light.intensity / intensityDivided;
        light.castShadow = isCastShadow;
        if (isCastShadow) {
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;
        }
    };


    // 开启模型灯光阴影
    static openShowDowAndLight(mesh: THREE.Object3D<THREE.Event>, intensityDivided?: number) {
        if (ThreeBase.isMesh(mesh)) {
            this.showShowDow(mesh, mesh.name.includes("rShadow"), mesh.name.includes("cShadow"));
        }
        if (ThreeBase.isLight(mesh)) {
            this.showLight(mesh, mesh.name.includes("cShadow"), intensityDivided);
        }
    };
}