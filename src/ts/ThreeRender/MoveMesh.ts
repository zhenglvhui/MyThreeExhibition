import { MoveCameraTweenParams, MoveMeshOptions } from "@/ts/interface/modelRender";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import ThreeBase from "@/ts/ThreeRender/ThreeBase";
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import KeyControl from "./KeyControl";
import { MeshBVH, MeshBVHOptions, StaticGeometryGenerator } from "three-mesh-bvh";

interface CapsuleInfo {
    radius: number // 胶囊体半径，用于检测、
    segment: THREE.Line3
}

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
    private isCanMove: boolean = false;
    private playerIsOnGround = true; // 是否在地面上
    public canMoveEnbled: boolean = true;// 是否启用，用于外部调用
    private capsuleInfo: CapsuleInfo = { // 胶囊体数据,碰撞时使用
        radius: 30,
        segment: new THREE.Line3(
            new THREE.Vector3(),
            new THREE.Vector3(0, 5, 0)
        )
    };

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
            new RoundedBoxGeometry(1, 80, 1, 10, 1),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
        );
        this.character.geometry.translate(0, 0, 0);
        this.character.name = 'character'
        this.character.position.copy(this.options.resetPosition);
        this.character.visible = true;
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

    // 检查是否碰撞
    private tempBox: THREE.Box3 = new THREE.Box3();
    private tempMat: THREE.Matrix4 = new THREE.Matrix4();
    private tempSegment: THREE.Line3 = new THREE.Line3();
    private tempVector: THREE.Vector3 = new THREE.Vector3();
    private tempVector2: THREE.Vector3 = new THREE.Vector3();
    private checkCollision(deltaTime: number, collider: THREE.Mesh) {

        let { radius, segment } = this.capsuleInfo;

        this.tempBox.makeEmpty(); // 清空包围盒
        this.tempMat.copy(collider.matrixWorld).invert(); // 将当前矩阵翻转为它的逆矩阵
        this.tempSegment.copy(segment);

        // 获取胶囊体在对撞机局部空间中的位置
        this.tempSegment.start.applyMatrix4(this.character.matrixWorld).applyMatrix4(this.tempMat);
        this.tempSegment.end.applyMatrix4(this.character.matrixWorld).applyMatrix4(this.tempMat);

        // 获取胶囊体的轴对齐边界框
        this.tempBox.expandByPoint(this.tempSegment.start);
        this.tempBox.expandByPoint(this.tempSegment.end);

        this.tempBox.min.addScalar(-radius);
        this.tempBox.max.addScalar(radius);


        collider.geometry?.boundsTree?.shapecast({
            intersectsBounds: box => box.intersectsBox(this.tempBox),
            intersectsTriangle: tri => {
                // 检查场景是否与胶囊相交，并调整
                const triPoint = this.tempVector;
                const capsulePoint = this.tempVector2;
                const distance = tri.closestPointToSegment(this.tempSegment, triPoint, capsulePoint);
                // console.log({tri_point,capsule_point,distance})

                if (distance < radius) {
                    const depth = radius - distance ;
                    const direction = capsulePoint.sub(triPoint).normalize();
                    this.tempSegment.start.addScaledVector(direction, depth);
                    this.tempSegment.end.addScaledVector(direction, depth);
                }
            }
        });

        // 检查后得到胶囊体对撞机的调整位置
        // 场景碰撞并移动它. capsule_info.segment.start被假定为玩家模型的原点。
        const newPosition = this.tempVector;
        newPosition.copy(this.tempSegment.start).applyMatrix4(collider.matrixWorld);

        // 检查对撞机移动了多少
        const deltaVector = this.tempVector2;
        deltaVector.subVectors(newPosition, this.character.position);

        this.playerIsOnGround = deltaVector.y > Math.abs(deltaTime * this.velocity.y * 0.25);
        const offset = Math.max(0.0, deltaVector.length() - 1e-5);
        deltaVector.normalize().multiplyScalar(offset);

        // 调整player模型位置
        this.character.position.add(deltaVector);

        if (!this.playerIsOnGround) {
            deltaVector.normalize();
            this.velocity.addScaledVector(deltaVector, -deltaVector.dot(this.velocity));
        } else {
            this.velocity.set(0, 0, 0);
        }
    }


    // 键盘时移动位置
    private keyMoveCharacter(deltaTime: number) {
        if (!this.isCanMove || !this.canMoveEnbled) return;
        // 控制移动
        const angle = this.controls.getAzimuthalAngle(); //获得当前的水平旋转，单位为弧度。
        const { ketStatus } = this.keyControl;
        const enter = ketStatus["KeyW"] || ketStatus["KeyS"] || ketStatus["KeyA"] || ketStatus["KeyD"]
        this.velocity.y += this.playerIsOnGround ? 0 : deltaTime * this.options.gravity; // 不在地面的话，每次更新的时候下落
        this.character.position.addScaledVector(this.velocity, deltaTime); // 控制自身移动

        if (ketStatus["KeyW"]) {
            // console.log({ 'deltaTime * this.options.gravity': deltaTime * this.options.gravity })
            // console.log({ ' this.playerIsOnGround': this.playerIsOnGround })
            // console.log({ 'this.character.position': JSON.stringify(this.character.position) })
            // console.log({ 'this.velocity': JSON.stringify(this.velocity) })
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

        this.character.updateMatrixWorld();

    }


    /**
     * 
     * @param deltaTime 间隔时间
     * @param collider   collider: THREE.Mesh
     */
    public update(deltaTime: number, collider: THREE.Mesh) {
        if (!this.isCanMove || !this.canMoveEnbled) return;
        this.keyMoveCharacter(deltaTime)
        this.checkCollision(deltaTime, collider);
    }
}