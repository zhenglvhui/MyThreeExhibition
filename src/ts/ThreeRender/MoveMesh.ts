import { MoveCameraTweenParams, MoveMeshOptions } from "@/ts/interface/modelRender";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import ThreeBase from "@/ts/ThreeRender/ThreeBase";
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import KeyControl from "./KeyControl";
import { MeshBVH, MeshBVHOptions, StaticGeometryGenerator } from "three-mesh-bvh";
import { ENUM_MOUSE_KEY } from "../Enum";
import { KeyStatus } from "../interface/commonInterface";

interface CapsuleInfo {
    radius: number // 胶囊体半径，用于检测、
    segment: THREE.Line3
}

interface EnterKeyInfo {
    key: ENUM_MOUSE_KEY,
    point: THREE.Vector3
}

// 移动物体 
export default class MoveMesh {
    private mainModel: ThreeBase;
    private options: MoveMeshOptions;
    private character!: THREE.Mesh<RoundedBoxGeometry, THREE.MeshBasicMaterial>; // 胶囊体
    private velocity: THREE.Vector3; // 跳起坐标
    private camera: THREE.PerspectiveCamera; // 相机
    private controls: OrbitControls; // 控制器
    private keyControl: KeyControl; // 控制器
    private upVector: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
    private isCanMove: boolean = false;
    private cameraRaycaster: THREE.Raycaster = new THREE.Raycaster();
    public canMoveEnbled: boolean = true;// 是否启用，用于外部调用  
    private internalCameraY;
    private capsuleInfo: CapsuleInfo = { // 胶囊体数据,碰撞时使用
        radius: 8,
        segment: new THREE.Line3(
            new THREE.Vector3(0, 5, 0),
            new THREE.Vector3(0, -23, 0)
        )
    };
    private tempBox: THREE.Box3 = new THREE.Box3();
    private tempMat: THREE.Matrix4 = new THREE.Matrix4();
    private tempSegment: THREE.Line3 = new THREE.Line3();
    private tempVector: THREE.Vector3 = new THREE.Vector3();
    private tempVector2: THREE.Vector3 = new THREE.Vector3();

    constructor(mainModel: ThreeBase, options: MoveMeshOptions = {
        resetPosition: new THREE.Vector3(0, 5, 0), // 重生点
        resetY: -25, // 掉落高度
        speed: 25, // 速度
        jumpHeight: 20, // 跳起高度
        gravity: -50 // 重力
    }) {
        this.mainModel = mainModel;
        this.cameraRaycaster.far = 5;
        this.internalCameraY = mainModel.getInternalCameraY();
        this.velocity = new THREE.Vector3(0, mainModel.getInternalCameraY(), 0);
        this.camera = mainModel.getCamera();
        this.controls = mainModel.getControls();
        this.keyControl = mainModel.getKeyControl();
        this.options = options;
        this.createMoveModel();

    }

    private createMoveModel() {
        this.character = new THREE.Mesh(
            new RoundedBoxGeometry(0.25, 5, 0.25, 10, 1),
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
            updateCb: (nowPosition, percentage, controlsTarget) => {
                this.character.position.copy(nowPosition);
            }
        })
    }

    private updateCamera() {
        this.camera.position.sub(this.controls.target);
        this.controls.target.copy(this.character.position);
        this.camera.position.add(this.character.position);
    }

    // 添加碰撞体
    /**
     * 
     * @param collisionScene 碰撞体集合
     * @returns 
     */
    static addCollider(collisionScene: THREE.Group): THREE.Mesh {
        collisionScene.updateMatrixWorld(true);
        // 新建碰撞体并添加到视图中
        const staticGenerator = new StaticGeometryGenerator(collisionScene);
        staticGenerator.attributes = ["position"];
        const mergedGeometry = staticGenerator.generate();
        mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, { lazyGeneration: false } as MeshBVHOptions);
        return new THREE.Mesh(mergedGeometry);

    }


    // 检查是否碰撞
    private checkCollision(deltaTime: number, collider: THREE.Mesh) {
        let { radius, segment } = this.capsuleInfo;
        this.tempBox.makeEmpty();
        this.tempMat.copy(collider.matrixWorld).invert();
        this.tempSegment.copy(segment);
        this.tempSegment.start.applyMatrix4(this.character.matrixWorld).applyMatrix4(this.tempMat);
        this.tempSegment.end.applyMatrix4(this.character.matrixWorld).applyMatrix4(this.tempMat);
        this.tempBox.expandByPoint(this.tempSegment.start);
        this.tempBox.expandByPoint(this.tempSegment.end);
        this.tempBox.min.addScalar(-radius);
        this.tempBox.max.addScalar(radius);
        collider.geometry?.boundsTree?.shapecast({
            intersectsBounds: box => box.intersectsBox(this.tempBox),
            intersectsTriangle: tri => {
                // 检查场景是否与胶囊相交，并调整
                const triPoint: THREE.Vector3 = this.tempVector;
                const capsulePoint: THREE.Vector3 = this.tempVector2;
                const distance: number = tri.closestPointToSegment(this.tempSegment, triPoint, capsulePoint);
                if (distance < radius) {
                    const depth: number = radius - distance;
                    const direction: THREE.Vector3 = capsulePoint.sub(triPoint).normalize();
                    this.tempSegment.start.addScaledVector(direction, depth);
                    this.tempSegment.end.addScaledVector(direction, depth);
                }
            }
        });
        const newPosition: THREE.Vector3 = this.tempVector;
        newPosition.copy(this.tempSegment.start).applyMatrix4(collider.matrixWorld);
        const deltaVector: THREE.Vector3 = this.tempVector2;
        deltaVector.subVectors(newPosition, this.character.position);
        deltaVector.setY(deltaVector.y - 5);
        const offset: number = Math.max(0.0, deltaVector.length() - 1e-5);
        deltaVector.normalize().multiplyScalar(offset);
        this.character.position.add(deltaVector);
    }


    // 键盘时移动位置
    private keyMoveCharacter(deltaTime: number) {
        if (!this.isCanMove || !this.canMoveEnbled) return;
        const angle: number = this.controls.getAzimuthalAngle();
        const ketStatus: KeyStatus = this.keyControl.getKeyStatus();
        const enterKeyList: EnterKeyInfo[] = [{
            key: ENUM_MOUSE_KEY.keyW,
            point: new THREE.Vector3(0, 0, -1)
        }, {
            key: ENUM_MOUSE_KEY.keyS,
            point: new THREE.Vector3(0, 0, 1)
        }, {
            key: ENUM_MOUSE_KEY.keyA,
            point: new THREE.Vector3(-1, 0, 0)
        }, {
            key: ENUM_MOUSE_KEY.keyD,
            point: new THREE.Vector3(1, 0, 0)
        }];
        for (let i = 0; i < enterKeyList.length; i++) {
            let item = enterKeyList[i];
            if (ketStatus[item.key]) {
                this.tempVector.set(item.point.x, item.point.y, item.point.z).applyAxisAngle(this.upVector, angle);
                this.character.position.addScaledVector(this.tempVector, this.options.speed * deltaTime); 
                this.updateCamera();
            }
        }
        this.character.updateMatrixWorld();
    }

    /**
     * 
     * @param deltaTime 间隔时间
     * @param collider  场景白膜点位
     */
    public update(deltaTime: number, collider: THREE.Mesh) {
        if (!this.isCanMove || !this.canMoveEnbled) return;
        this.keyMoveCharacter(deltaTime)
        this.checkCollision(deltaTime, collider);
        // this.mainModel.updateOrbitControlsFromOrigin();
    }

    public getIsCanMove() {
        return this.isCanMove;
    }
}