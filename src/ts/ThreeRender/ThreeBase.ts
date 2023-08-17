import { MoveCameraTweenParams, ThreeOption, DestroyModelParams, UserData } from "@/ts/interface/modelRender";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import MyDRACOLoader from "./MyDRACOLoader";
import { ItFnArr, ItPlayAllSpecialAnimateFn } from "@/ts/interface/modelRender";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Emitter from "@/ts/util/Emitter";
import Stats from "three/examples/jsm/libs/stats.module";
import * as TWEEN from "@tweenjs/tween.js";
import { ENUM_MESH_TYPE } from "../Enum";
import MoveMesh from "@/ts/ThreeRender/MoveMesh";
import KeyControl from "@/ts/ThreeRender/KeyControl";
import { MeshBVH, MeshBVHOptions, StaticGeometryGenerator } from "three-mesh-bvh";
import { MODEL_NAME_LIST, ON_MODEL_PROGRESS } from "../Constants";


class ThreeBase extends Emitter {
    protected modelScene!: THREE.Group;
    protected option: ThreeOption;
    protected scene!: THREE.Scene;
    protected camera!: THREE.PerspectiveCamera;
    protected renderer !: THREE.WebGLRenderer;
    protected controls!: OrbitControls;
    protected stats: Stats = new Stats();
    private globalTween!: TWEEN.Tween<THREE.Vector3>;
    private oldControlsEnableRotate!: boolean;
    protected internalCameraY: number = 30; // 展厅内的相机固定高度
    protected moveMesh !: MoveMesh;
    protected keyControl !: KeyControl;

    constructor(option: ThreeOption) {
        super();
        this.option = option;
    }

    static isMesh(obj: unknown): obj is THREE.Mesh {
        return (typeof obj === "object" && obj !== null && "isMesh" in obj);
    }

    static isLight(obj: unknown): obj is THREE.Light {
        return obj instanceof THREE.Light;
    }

    // username 做切割处理
    static splitUsername(username: string = ''): UserData {
        let splitList: string[] = username.split('-');
        let type: ENUM_MESH_TYPE = splitList.length >= 2 ? <ENUM_MESH_TYPE>splitList[0] : ENUM_MESH_TYPE.none;
        let meshName: string = splitList[1] && splitList[1].split('_')[0]
        return {
            name: username,
            type,
            meshName,
            meshNameAll: splitList[1],
            text: MODEL_NAME_LIST[meshName],
        }
    }


    protected initWebGLRenderer(): void {
        //设置渲染器，并添加抗锯齿效果
        this.renderer = new THREE.WebGLRenderer(this.option.webGLRendererParameters || {
            antialias: true,
            // precision: "hiphp",
            precision: "lowp", // 解决移动端卡顿问题
            alpha: true,
        });
        this.renderer.setPixelRatio(this.option.devicePixelRatio || window.devicePixelRatio);
        this.renderer.setSize(this.option.renderWidth || window.innerWidth, this.option.renderHeight || window.innerHeight);
        this.renderer.setClearColor(this.option.renderBackgroundColor || 0x000000, this.option.renderAlpha ?? 1);
        this.renderer.outputColorSpace = this.option.renderOutputColorSpace || THREE.LinearSRGBColorSpace;
        // @ts-ignore;
        this.renderer.physicallyCorrectLights = this.option.renderPhysicallyCorrectLights || false;
        this.renderer.shadowMap.enabled = this.option.renderShadowMapEnabled || false;
        this.option.renderContainer.value?.appendChild(this.renderer.domElement);
    }

    protected initScene(): void {
        this.scene = new THREE.Scene();
    }

    protected addControls(): void {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    protected initCamera(): void {
        this.camera = new THREE.PerspectiveCamera(this.option.cameraFov, (this.option.renderWidth || window.innerWidth) / (this.option.renderHeight || window.innerHeight), this.option.cameraNear, this.option.cameraFar);
        this.camera.position.copy(this.option.cameraPosition);
    }

    protected loaderModel(loadComplete: (gltf: GLTF) => void, loadProcess?: (xhr: ProgressEvent<EventTarget>) => void): void {
        const myDRACOLoader = new MyDRACOLoader();
        const loader = new GLTFLoader();
        loader.setDRACOLoader(myDRACOLoader.getDRACOLoader());
        loader.load(
            this.option.blgUrl,
            (gltf) => {
                loadComplete(gltf);
            },
            (xhr) => {
                loadProcess && loadProcess(xhr)
            },
            (error) => {
                console.log({ loadModelError: error });
            }
        );
    }


    protected initStats() {
        this.stats.showPanel(0);
        this.stats.dom.style.position = "absolute";
        this.stats.dom.style.left = "0px";
        this.stats.dom.style.top = "0px";
        document.body.appendChild(this.stats.dom);
    };

    protected initKeyControl(mainModel: ThreeBase) {
        this.keyControl = new KeyControl(mainModel);
    }

    protected initMoveMesh(mainModel: ThreeBase) {
        this.moveMesh = new MoveMesh(mainModel);
    }


    // 页面窗口变动，重新渲染
    protected onWindowResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
        return () => {
            let width: number = this.option.renderWidth || window.innerWidth;
            let height: number = this.option.renderHeight || window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
    };


    // 调整控制器围绕当前原点移动
    public updateOrbitControlsFromOrigin() {
        this.controls.maxPolarAngle = Math.PI;
        this.controls.minDistance = 1e-4;
        this.controls.maxDistance = 1e-4;
    }



    // 移动位置动画
    public moveCameraTween(param: MoveCameraTweenParams) {
        if (!(this.camera && this.controls)) throw new Error('相机或控制器未赋值');
        let { movePosition, targetPosition, isInternal = true, cb = () => { }, animateTime = 3000, updateCb = () => { } } = param;
        // let toTargetPositionY = isInternal ? targetPosition.y : movePosition.y;
        if (this.globalTween) {
            this.globalTween.stop();
        }

        // 看向物体前方一点
        if (isInternal) {
            let firstMeshPositionCopy: THREE.Vector3 = movePosition.clone();
            let targetMeshPositionCopy: THREE.Vector3 = targetPosition.clone();
            firstMeshPositionCopy.lerp(targetMeshPositionCopy, 0.1);
            targetPosition = firstMeshPositionCopy;
            // this.controls.target.set(firstMeshPositionCopy.x, targetMeshPositionCopy.y, firstMeshPositionCopy.z);
        }
        // 解决微任务bug
        setTimeout(() => {
            this.oldControlsEnableRotate = this.controls.enableRotate;
            this.controls.enableRotate = false;
        }, 0);
        this.globalTween = new TWEEN.Tween(this.camera.position)
            .to(new THREE.Vector3(movePosition.x, movePosition.y, movePosition.z), animateTime)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .start()
            .onUpdate((nowPosition, percentage) => {
                this.controls.target.set(
                    targetPosition.x * percentage + nowPosition.x * (1 - percentage),
                    targetPosition.y * percentage + nowPosition.y * (1 - percentage),
                    targetPosition.z * percentage + nowPosition.z * (1 - percentage)
                );
                this.controls.update();
                updateCb(nowPosition, percentage, this.controls.target);
            })
            .onComplete(() => {
                this.controls.enableRotate = this.oldControlsEnableRotate;
                cb();
            });
    };

    // 循环递归具有某个标识符的父级模型
    /**
     *
     * @param {THREE.Object3D<THREE.Event>} mesh
     * @param {Array} supportedTypes 支持的类型
     * @param {(firstMesh: THREE.Object3D<THREE.Event>, supportedTypes: string[]) => void} handerClick 回调后要被执行的函数
     * @param {Fucntion} identifier 回调后要被执行的函数
     */
    static recurMeshParentName(
        mesh: THREE.Object3D<THREE.Event>,
        supportedTypes: string[] = [],
        fn: (firstMesh: THREE.Object3D<THREE.Event>, supportedTypes: string[]) => void,
        identifier: string = '-'
    ): void | boolean {
        if (mesh.userData.name && mesh.userData.name.split(identifier).length > 1) {
            fn(mesh, supportedTypes);
        } else if (mesh.parent == null) {
            return false;
        } else {
            this.recurMeshParentName(mesh.parent, supportedTypes, fn);
        }
    };

    // 销毁模型
    public destroyModel<K extends keyof HTMLElementEventMap>(destroyModelParams: DestroyModelParams<K>) {
        if (!(this.scene && this.renderer)) throw new Error('场景或渲染器未赋值');
        let { modelScene, throttleOnDocumentMouseMove, type } = destroyModelParams;
        window.removeEventListener("resize", this.onWindowResize(this.camera, this.renderer), false);
        if (throttleOnDocumentMouseMove && type) {
            this.option.renderContainer.value?.removeEventListener(type, throttleOnDocumentMouseMove, false);
        }
        modelScene.traverse((child: any) => {
            if (child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
            child = null;
        });
        this.scene.remove(modelScene);
        this.scene.clear();
        this.renderer.forceContextLoss();
        this.renderer.dispose();
        this.renderer.clear();
        this.renderer = null!;
        this.scene = null!;
        THREE.Cache.clear();
    }

    public getScene() {
        return this.scene;
    }

    public getCamera() {
        return this.camera;
    }

    public getRenderer() {
        return this.renderer;
    }

    public getModelScene() {
        return this.modelScene;
    }

    public getControls() {
        return this.controls;
    }

    public getKeyControl() {
        return this.keyControl;
    }

    public getMoveMesh() {
        return this.moveMesh;
    }

    public getOption() {
        return this.option;
    }


    public getInternalCameraY() {
        return this.internalCameraY;
    }

}

export default ThreeBase