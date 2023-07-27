<!--
 * @Date: 2022-04-24 11:39:04
 * @Description: 公共模型页面
-->
<template>
  <div class="page">
    <!-- @click="getCamera" -->
    <div ref="container" @click="getCamera"></div>
    <Loading :progress="progress" v-if="progress != 100 && isLoading" @complete="complete" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, onBeforeUnmount, getCurrentInstance, Ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import Loading from "@/components/Loading/Loading.vue";
import carGlbUrl from "@/assets/models/car.glb";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  playAllAnimate,
  onWindowResize,
  openShowDowAndLight,
  getIntersects,
  throttle,
  destroyModel,
  useGetGlobalProperties,
  isMobile,
} from "@/js/util";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { ItControlsObject, ItPlayAllSpecialAnimateFn } from "@/js/interface/modelRender";
import TWEEN from "@tweenjs/tween.js";
import { XYZ } from "@/js/interface/commonInterface";
// import TWEEN from "@tweenjs/tween.js";
// import { SituControls } from "../js/SituControls";

interface ItCommonRenderItemData {
  isLoading: boolean;
  camraPosition?: XYZ; // 相机的位置
  glbUrl?: string; // 要加载glb路径
  controlsObject?: ItControlsObject; // 控制器的限制范围
  isNeedAmbientLight?: boolean; // 是否需要环境光
  ambientLightColor?: number; // 环境灯光颜色
  ambientIntensity?: number; // 环境光强度
  isNeedCameraPointLight?: boolean; // 是否需要相机上的点光源
  cameraPointLightColor?: number; // 相机上的点光源颜色
  cameraPointLightIntensity?: number; // 相机上的点光源强度
  intensityDivided?: number; // 功率要除以的倍数
  isSelfRotation?: boolean; // 模型是否自转
  renderOutputColorSpace?: THREE.ColorSpace; // render颜色类型
  playAllSpecialAnimateFn?: ItPlayAllSpecialAnimateFn[]; // 动画执行Fn    // AnimationAction 中的方法 // [{animationName:'', fnArr: [{fn:'', fnParams:''}]}]
}

const props = withDefaults(defineProps<ItCommonRenderItemData>(), {
  camraPosition: () => {
    return {
      x: 0,
      y: 0,
      z: 0,
    };
  },
  glbUrl: carGlbUrl,
  controlsObject: () => {
    return {};
  },
  isNeedAmbientLight: false,
  ambientLightColor: 0xffffff,
  ambientIntensity: 1,
  isNeedCameraPointLight: false,
  cameraPointLightColor: 0xffffff,
  cameraPointLightIntensity: 0.8,
  intensityDivided: 1,
  isSelfRotation: false,
  renderOutputColorSpace: THREE.LinearSRGBColorSpace,
  playAllSpecialAnimateFn: () => [],
  isLoading:true
});

let scene: THREE.Scene; // 场景
let camera: THREE.PerspectiveCamera; // 相机
let container: Ref<HTMLElement | null> = ref(null);
// const gui: dat.GUI = new dat.GUI(); // 初始化gui
let clock: THREE.Clock = new THREE.Clock();
let renderer: THREE.WebGLRenderer; // 渲染器
let mixer: THREE.AnimationMixer; // 动画切片
let controls: OrbitControls;
let modelScene: THREE.Group;

let getCamera = (): void => {
  console.log({ camera });
};

// // 初始化场景
let initScene = (): void => {
  scene = new THREE.Scene();
};

// 初始化渲染器
let initRender = (): void => {
  //设置渲染器，并添加抗锯齿效果
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    // precision: "hiphp",
    precision: "lowp", // 解决移动端卡顿问题
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = props.renderOutputColorSpace;
  // @ts-ignore;
  renderer.physicallyCorrectLights = true;
  container.value?.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true;

  // renderer.shadowMap.type = THREE.VSMShadowMap;
};

// 初始化相机
let initCamera = (): void => {
  camera = new THREE.PerspectiveCamera(isMobile() ? 110 : 90, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(props.camraPosition.x, props.camraPosition.y, props.camraPosition.z);
};

let progress: Ref<number> = ref(0);
const { $dracoLoader } = useGetGlobalProperties();
// 加载模型
let loaderModel = (): void => {
  const loader = new GLTFLoader();
  loader.setDRACOLoader($dracoLoader);
  loader.load(
    props.glbUrl,
    (gltf) => {
      console.log({ CommonModelRender: gltf });
      scene?.add(gltf.scene);
      mixer = playAllAnimate(gltf.scene, gltf.animations, 1, props.playAllSpecialAnimateFn);
      modelScene = gltf.scene;
      modelScene.traverse(function (child) {
        openShowDowAndLight(child, props.intensityDivided);
        // if (child instanceof THREE.Mesh) {
        //   child.material.roughness = 0.5;
        // }
      });
    },
    (xhr) => {
      progress.value = Math.floor((xhr.loaded / xhr.total) * 100);
    },
    (error) => {
      console.log({ loadModelError: error });
    }
  );
};

// 初始化控制器
let initControls = (): void => {
  controls = new OrbitControls(camera, renderer?.domElement);
  for (const key in props.controlsObject) {
    (controls as any)[key] = (props.controlsObject as any)[key];
  }
  controls.update();
};

let initLight = (): void => {
  let { isNeedAmbientLight, ambientLightColor, ambientIntensity, isNeedCameraPointLight, cameraPointLightColor, cameraPointLightIntensity } = props;
  if (isNeedAmbientLight) {
    const light: THREE.AmbientLight = new THREE.AmbientLight(ambientLightColor, ambientIntensity);
    scene?.add(light);
  }
  if (isNeedCameraPointLight) {
    const pointLight: THREE.PointLight = new THREE.PointLight(cameraPointLightColor, cameraPointLightIntensity);
    scene?.add(camera);
    camera.add(pointLight);
  }
};

// // 自转
let isMouseAtMesh: Ref<Boolean> = ref(false);
let selfRotation = (): void => {
  let { isSelfRotation } = props;
  if (!isSelfRotation || !modelScene || !isMouseAtMesh.value) return;
  modelScene.rotateY(0.001);
};

let onDocumentMouseMove = (event: MouseEvent) => {
  event.preventDefault();
  let { raycasterMesh } = getIntersects(event.pageX, event.pageY, camera, scene);
  isMouseAtMesh.value = !raycasterMesh.length;
};

let throttleOnDocumentMouseMove = throttle(onDocumentMouseMove, 100);

// 性能检测
// let stats: Stats;
// let statsUpdate = () => {
//   stats = new Stats();
//   stats.showPanel(0);
//   stats.dom.style.position = "absolute";
//   stats.dom.style.left = "0px";
//   stats.dom.style.top = "0px";
//   document.body.appendChild(stats.dom);
// };

let animationID: number;
let sceneUpdate = (): void => {
  // stats.update();
  animationID = requestAnimationFrame(sceneUpdate);
  selfRotation();
  if (scene) {
    renderer?.render(scene, camera);
  }
  if (mixer) {
    mixer.update(clock.getDelta());
  }
};

// 初始化
let init = (): void => {
  initRender();
  loaderModel();
  initScene();
  initCamera();
  initControls();
  initLight();
  // statsUpdate();
};

let complete = (): void => {
  init();
  sceneUpdate();
  window.addEventListener("resize", onWindowResize(camera, renderer), false);
};

onMounted((): void => {
  // complete();
  container.value?.addEventListener("mousemove", throttleOnDocumentMouseMove, false);
  if(!props.isLoading){
    // 动画执行完之后，在加载模型，否则会卡顿
    setTimeout(() => {
      complete();
    },350)
  }
});

onBeforeUnmount((): void => {
  try {
    destroyModel(container, animationID, camera, renderer, modelScene, scene, "mousemove", throttleOnDocumentMouseMove);
    renderer = null!;
    scene = null!;
    THREE.Cache.clear();
  } catch (e) {
    console.log(e);
  }
});
</script>
<style scoped lang="less">
.page {
  width: 100%;
  height: 100%;
  background: url("../../assets/images/bg.jpg") no-repeat center center / 100% 100%;
  background-size: auto 100%;
  background-position: right bottom;
  z-index: 5;
}
</style>
