<!--
 * @Date: 2022-04-24 11:39:04
 * @Description: Loading页面
-->
<template>
  <div class="page">
    <div class="Loading" ref="container"></div>
    <Loading :progress="progress" v-show="progress != 100" @complete="complete" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, Ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as dat from "dat.gui";
import Loading from "@/components/Loading/Loading.vue";
import carGlbUrl from "@/assets/models/car.glb";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { playAllAnimate, onWindowResize, openShowDowAndLight } from "@/js/util";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { myLightHelpers } from "@/js/threeHelper";
import { ENUM_LIGHT_HELPER } from "@/js/Enum";
// import TWEEN from "@tweenjs/tween.js";
// import { SituControls } from "../js/SituControls";

let scene: THREE.Scene; // 场景
let camera: THREE.PerspectiveCamera; // 相机
let container: Ref<HTMLElement | null> = ref(null);
const gui = new dat.GUI(); // 初始化gui
let clock = new THREE.Clock();
let renderer: THREE.WebGLRenderer; // 渲染器
let mixer: THREE.AnimationMixer; // 动画切片
let controls: OrbitControls;
let modelScene: THREE.Group;

let getCamera = () => {
  console.log({ camera });
};

// 初始化场景
let initScene = () => {
  scene = new THREE.Scene();
};

// 初始化渲染器
let initRender = () => {
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
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  container.value?.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.VSMShadowMap;
};

// 初始化相机
let initCamera = () => {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0.83, 4.86, 3.3);
};

let progress = ref(0);
// 加载模型
let loaderModel = () => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/"); // 设置public下的解码路径，注意最后面的/
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    carGlbUrl,
    (gltf) => {
      console.log({ car: gltf });
      scene.add(gltf.scene);
      mixer = playAllAnimate(gltf.scene, gltf.animations);
      modelScene = gltf.scene;
      modelScene.traverse(function (child) {
        openShowDowAndLight(child);
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
let initControls = () => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxDistance = 10; // 最大缩放距离
  controls.minDistance = 8; // 最小缩放距离
  controls.enablePan = false; // 不允许平移
  controls.maxPolarAngle = Math.PI * 0.45; // 最大垂直角度
  controls.target = new THREE.Vector3(-5.67, 0, 0.57);
  controls.update();
};



let sceneUpdate = () => {
  requestAnimationFrame(sceneUpdate);
  renderer.render(scene, camera);
  if (mixer) {
    mixer.update(clock.getDelta());
  }
};

// 初始化
let init = () => {
  initRender();
  initScene();
  initCamera();
  loaderModel();
  initControls();
};

let complete = () => {
  init();
  sceneUpdate();
  window.addEventListener("resize", onWindowResize(camera, renderer), false);
};

onMounted(() => {});
</script>
<style scoped lang="less">
.page {
  width: 100vw;
  height: 100vh;
  background: url("../assets/images/bg.jpg") no-repeat center center / 100% 100%;
  background-size: auto 100%;
  background-position: right bottom;
}
</style>
