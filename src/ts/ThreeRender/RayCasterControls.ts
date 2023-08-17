import ThreeBase from "./ThreeBase";
import * as THREE from 'three'

export default class RayCasterControls {
    private mainModel: ThreeBase
    constructor(mainModel: ThreeBase) {
        this.mainModel = mainModel;
    }

    // 获取射线交点，用于判断是否接触到物体了
    /**
     *
     * @param {Number} x 鼠标x
     * @param {Number} y 鼠标y
     * @param {Camera} camera 正在使用的相机
     * @param {THREE.Object3D[]} meshs 要被判断的场景
     * @param {string[]} filterNameList 要被过滤的数据名称
     * @returns
     */
    static getIntersects(x: number, y: number, camera: THREE.PerspectiveCamera, meshs: THREE.Object3D[], filterNameList: string[] = []) {
        if (!camera || !meshs) return { raycasterMesh: [] };
        let raycaster: THREE.Raycaster = new THREE.Raycaster();
        let mouse: THREE.Vector2 = new THREE.Vector2();
        x = (x / window.innerWidth) * 2 - 1;
        y = -(y / window.innerHeight) * 2 + 1;
        mouse.set(x, y);
        raycaster.setFromCamera(mouse, camera);
        let raycasterMesh = raycaster.intersectObjects(meshs); // 穿过的物体
        raycasterMesh = raycasterMesh.filter(item => !filterNameList.includes(item.object.name));
        return {
            raycasterMesh,
        };
    };

    //  判断相机的射线是否和物体有接触
    static cameraInRayCaster(raycastObjects: THREE.Object3D[], camera: THREE.Camera):THREE.Intersection<THREE.Object3D<THREE.Event>>[] {
        let raycaster: THREE.Raycaster = new THREE.Raycaster();
        let hoverPoint: THREE.Vector2 = new THREE.Vector2(0, 0);
        raycaster.setFromCamera(hoverPoint, camera);
        const intersects = raycaster.intersectObjects(raycastObjects);
        return intersects;
    }
}