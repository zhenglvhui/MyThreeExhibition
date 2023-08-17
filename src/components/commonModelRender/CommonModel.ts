import { ON_MODEL_PROGRESS } from "@/ts/Constants";
import AnimateControls from "@/ts/ThreeRender/AnimateControls";
import CreateMesh from "@/ts/ThreeRender/CreateMesh";
import RayCasterControls from "@/ts/ThreeRender/RayCasterControls";
import ShowdowControls from "@/ts/ThreeRender/ShowdowControls";
import ThreeBase from "@/ts/ThreeRender/ThreeBase";
import { ThreeOption } from "@/ts/interface/modelRender";
import { ItCommonRenderItemData } from "@/ts/interface/modelRender";
import { throttle } from "@/ts/util/util";
import * as THREE from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Ref, ref } from "vue";

export default class CommonModel extends ThreeBase {
    protected option: ThreeOption;
    private mixer !: THREE.AnimationMixer;
    private clock: THREE.Clock = new THREE.Clock();
    private meshAABB!: THREE.Mesh;
    private props: ItCommonRenderItemData;
    private isMouseAtMesh: Ref<Boolean> = ref(false);
    constructor(option: ThreeOption, props: ItCommonRenderItemData) {
        super(option);
        this.option = option;
        this.props = props
        THREE.DefaultLoadingManager.onProgress = (url, loaded, total) => {
            let nowProgress: number = Math.floor((loaded / total) * 100);
            this.$emit(ON_MODEL_PROGRESS, nowProgress)
        };
    }

    private initLight() {
        let { isNeedAmbientLight, ambientLightColor, ambientIntensity, isNeedCameraPointLight, cameraPointLightColor, cameraPointLightIntensity } = this.props;
        if (isNeedAmbientLight) {
            const light: THREE.AmbientLight = new THREE.AmbientLight(ambientLightColor, ambientIntensity);
            this.scene.add(light);
        }
        if (isNeedCameraPointLight) {
            const pointLight: THREE.PointLight = new THREE.PointLight(cameraPointLightColor, cameraPointLightIntensity);
            this.scene?.add(this.camera);
            this.camera.add(pointLight);
        }
    };

    // 初始化控制器
    private initControls() {
        this.addControls();
        for (const key in this.props.controlsObject) {
            (this.controls as any)[key] = (this.props.controlsObject as any)[key];
        }
        this.controls.update();
    };


    private sceneUpdate() {
        this.renderer.setAnimationLoop(() => {
            this.selfRotation();
            this.renderer?.render(this.scene, this.camera);
            if (this.mixer) {
                this.mixer.update(this.clock.getDelta());
            }
        })
    };

    private selfRotation() {
        let { isSelfRotation } = this.props;
        if (!isSelfRotation || !this.modelScene || !this.isMouseAtMesh.value) return;
        this.modelScene.rotateY(0.001);
    };

    private onDocumentMouseMove(event: MouseEvent) {
        event.preventDefault();
        let { raycasterMesh } = RayCasterControls.getIntersects(event.pageX, event.pageY, this.camera, [this.meshAABB]);
        this.isMouseAtMesh.value = !raycasterMesh.length;
    };

    private throttleOnDocumentMouseMove = throttle(this.onDocumentMouseMove.bind(this), 100);

    // 初始化
    public init(loadComplete?: (gltf: GLTF) => void, loadProcess?: (xhr: ProgressEvent<EventTarget>) => void) {
        this.initScene();
        this.initWebGLRenderer();
        this.initCamera();
        this.initLight();
        this.loaderModel((gltf) => {
            console.log({ gltf })
            this.scene.add(gltf.scene);
            this.modelScene = gltf.scene;
            this.mixer = AnimateControls.playAllAnimate(gltf.scene, gltf.animations, 1, this.props.playAllSpecialAnimateFn);
            this.modelScene.traverse((child) => {
                ShowdowControls.openShowDowAndLight(child, this.props.intensityDivided);
            });

            this.meshAABB = CreateMesh.creatAABBFromMesh({
                addMesh: this.modelScene,
                name: 'parent'
            })
            this.scene.add(this.meshAABB);

            this.renderer?.render(this.scene, this.camera);
            this.sceneUpdate();
            loadComplete && loadComplete(gltf)
        }, (xhr) => {
            loadProcess && loadProcess(xhr)
        })
        this.initControls();
        window.addEventListener("resize", this.onWindowResize(this.camera, this.renderer), false);
        this.option.renderContainer.value?.addEventListener("mousemove", this.throttleOnDocumentMouseMove, false);
    }

    public getModelScene() {
        return this.modelScene;
    }
    public getThrottleOnDocumentMouseMove() {
        return this.throttleOnDocumentMouseMove;
    }

}