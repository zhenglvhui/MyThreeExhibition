import ThreeBase from "@/ts/ThreeRender/ThreeBase";
import { ThreeOption } from "@/ts/ThreeRender/interface";
import * as THREE from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default class LoadingModel extends ThreeBase {
    protected option: ThreeOption;
    private modelScene!: THREE.Group;
    private mixer !: THREE.AnimationMixer;
    private progress: number = 0;
    private clock: THREE.Clock = new THREE.Clock();
    constructor(option: ThreeOption) {
        super(option);
        this.option = option;
    }

    private initLight() {
        // 左边和右边的点光源
        const leftPointlight = new THREE.PointLight(0xffffff, 2, 100);
        leftPointlight.position.set(-5.8, 5.1, 3.18);
        this.scene.add(leftPointlight);
        const rightPointlight = new THREE.PointLight(0xffffff, 1, 10);
        rightPointlight.position.set(4.27, 2.1, 5);
        this.scene.add(rightPointlight);
    };


    sceneUpdate() {
        this.renderer.setAnimationLoop(() => {
            if (this.progress === 100) return;
            this.renderer?.render(this.scene, this.camera);
            if (this.mixer) {
                this.mixer.update(this.clock.getDelta());
            }
        })
    };

    // 初始化
    init(loadComplete?: (gltf: GLTF) => void, loadProcess?: (xhr: ProgressEvent<EventTarget>) => void) {
        this.initScene();
        this.initWebGLRenderer();
        this.initCamera();
        this.initLight();
        this.loaderModel((gltf) => {
            this.scene.add(gltf.scene);
            this.modelScene = gltf.scene;
            this.mixer = this.playAllAnimate(gltf.scene, gltf.animations, 1);
            loadComplete && loadComplete(gltf)
            this.renderer?.render(this.scene, this.camera);
            this.sceneUpdate();
        }, (xhr) => {
            loadProcess && loadProcess(xhr)
        })
        window.addEventListener("resize", this.onWindowResize(this.camera, this.renderer), false);
    }

    getModelScene() {
        return this.modelScene;
    }

    setProgress(progress: number) {
        this.progress = progress;
    }
}