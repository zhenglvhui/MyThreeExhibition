import { MoveCameraTweenParams, MoveMeshOptions } from "@/ts/interface/modelRender";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import ThreeBase from "@/ts/ThreeRender/ThreeBase";
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import KeyControl from "./KeyControl";

// 移动物体 
export default class MoveMesh {
    private mainModel: ThreeBase;
    private options: MoveMeshOptions;
    private character!: THREE.Mesh<RoundedBoxGeometry, THREE.MeshBasicMaterial>; // 胶囊体
    private velocity: THREE.Vector3 = new THREE.Vector3(); // 跳起坐标
    private camera: THREE.PerspectiveCamera; // 相机
    private controls: OrbitControls; // 控制器
    private keyControl: KeyControl; // 控制器
    private upVector: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
    private tempVector: THREE.Vector3 = new THREE.Vector3();
    private isCanMove: boolean = false;
    public canMoveEnbled:boolean = true;// 是否启用，用于外部调用

    constructor(mainModel: ThreeBase, options: MoveMeshOptions = {
        resetPosition: new THREE.Vector3(0, 5, 0), // 重生点
        resetY: -25, // 掉落高度
        speed: 30, // 速度
        jumpHeight: 20, // 跳起高度
        gravity: -50 // 重力
    }) {
        this.mainModel = mainModel;
        this.camera = mainModel.getCamera();
        this.controls = mainModel.getControls();
        this.keyControl = mainModel.getKeyControl();
        this.options = options;
        this.createMoveModel();

    }

    private createMoveModel() {
        this.character = new THREE.Mesh(
            new RoundedBoxGeometry(0.5, 2.5, 0.5, 10, 1),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
        );
        this.character.geometry.translate(0, 0, 0);
        this.character.name = 'character'
        this.character.position.copy(this.options.resetPosition);
        this.character.visible = false;
        this.mainModel.getScene().add(this.character);
    }

    // 点击时移动位置
    public moveCharacter(params: MoveCameraTweenParams) {
        if (!(this.camera && this.controls)) throw new Error('相机或控制器未赋值');
        this.isCanMove = false;
        this.mainModel.moveCameraTween({
            ...params,
            cb: () => {
                this.isCanMove = true;
                params.cb && params.cb();
            },
            updateCb: (nowPosition) => {
                this.character.position.copy(nowPosition);
            }
        })
    }

    private updateCamera() {
        this.camera.position.sub(this.controls.target);
        this.controls.target.copy(this.character.position);
        this.camera.position.add(this.character.position);
    }

    // 键盘时移动位置
    private keyMoveCharacter(deltaTime: number) {
        if(!this.isCanMove ||  !this.canMoveEnbled) return;
        // 控制移动
        const angle = this.controls.getAzimuthalAngle(); //获得当前的水平旋转，单位为弧度。
        const { ketStatus } = this.keyControl;
        const enter = ketStatus["KeyW"] || ketStatus["KeyS"] || ketStatus["KeyA"] || ketStatus["KeyD"]
        if (ketStatus["KeyW"]) {
            this.tempVector.set(0, 0, -1).applyAxisAngle(this.upVector, angle); // 新的向量位置
        }

        if (ketStatus["KeyS"]) {
            this.tempVector.set(0, 0, 1).applyAxisAngle(this.upVector, angle);
        }

        if (ketStatus["KeyA"]) {
            this.tempVector.set(-1, 0, 0).applyAxisAngle(this.upVector, angle);
        }

        if (ketStatus["KeyD"]) {
            this.tempVector.set(1, 0, 0).applyAxisAngle(this.upVector, angle);
        }

        if (enter) {
            this.character.position.addScaledVector(this.tempVector, this.options.speed * deltaTime); // 控制自身移动
            this.updateCamera();
        }

    }

    /**
     * 
     * @param deltaTime 间隔时间
     * @param collider   collider: THREE.Mesh
     */
    public update(deltaTime: number) {
        this.keyMoveCharacter(deltaTime)
    }
}