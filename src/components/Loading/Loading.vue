<!--
 * @Date: 2022-04-24 11:39:04
 * @Description: Loading页面
-->
<template>
  <div class="page">
    <div class="progessDiv">
      <div class="text">Loading...</div>
      <div class="progessBox">
        <div class="progess" :style="{ width: props.progress + '%' }"></div>
      </div>
    </div>
    <div class="Loading" ref="container"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineProps, defineEmits, watch, onBeforeUnmount, getCurrentInstance, Ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import LoadingBlgUrl from "@/assets/models/loading.glb";
import { playAllAnimate, onWindowResize, isMobile, destroyModel, useGetGlobalProperties } from "@/js/util";
const emit = defineEmits(["complete"]);
const props = withDefaults(
  defineProps<{
    progress: number;
  }>(),
  { progress: 0 }
);

// watch(props.progress, (newProgress) => {
//   if (newProgress === 100) {
//     scene = null; // 场景
//     container = ref(null);
//     // const gui = new dat.GUI(); // 初始化gui
//     renderer = null; // 渲染器
//     mixer = null; // 动画切片
//   }
// });

let scene: THREE.Scene; // 场景
let camera: THREE.PerspectiveCamera; // 相机
let container: Ref<HTMLElement | null> = ref(null);
// const gui = new dat.GUI(); // 初始化gui
let clock = new THREE.Clock();
let renderer: THREE.WebGLRenderer; // 渲染器
let mixer: THREE.AnimationMixer; // 动画切片
let modelScene: THREE.Group;

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
  renderer.setClearColor(0x000000);
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  container.value?.appendChild(renderer.domElement);
};

// 初始化相机
let initCamera = () => {
  camera = new THREE.PerspectiveCamera(isMobile() ? 100 : 75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0.03, 1.2, 7);
};

// 加载模型
const { $dracoLoader } = useGetGlobalProperties();
let loaderModel = () => {
  const loader = new GLTFLoader();
  loader.setDRACOLoader($dracoLoader);
  loader.load(
    LoadingBlgUrl,
    (gltf) => {
      // console.log({ gltf });
      scene?.add(gltf.scene);
      modelScene = gltf.scene;
      mixer = playAllAnimate(gltf.scene, gltf.animations, 1);
      emit("complete");
    },
    (xhr) => {
      // console.log({ xhr });
      console.log({ xhr });
    },
    (error) => {
      console.log({ loadModelError: error });
    }
  );
};

// 初始化灯光
let initLight = () => {
  // 左边和右边的点光源
  const leftPointlight = new THREE.PointLight(0xffffff, 2, 100);
  leftPointlight.position.set(-5.8, 5.1, 3.18);
  scene?.add(leftPointlight);
  const rightPointlight = new THREE.PointLight(0xffffff, 1, 10);
  rightPointlight.position.set(4.27, 2.1, 5);
  scene?.add(rightPointlight);
};

let animationID: number;
let sceneUpdate = () => {
  if (props.progress != 100) {
    // console.log({'props.progress':props.progress})
    animationID = requestAnimationFrame(sceneUpdate);
    renderer?.render(scene, camera);
    if (mixer) {
      mixer.update(clock.getDelta());
    }
  }
};

// 初始化
let init = () => {
  initRender();
  initScene();
  initCamera();
  loaderModel();
  initLight();
};

onMounted(() => {
  setTimeout(() => {
    init();
    sceneUpdate();
    window.addEventListener("resize", onWindowResize(camera, renderer), false);
  }, 350);
});

onBeforeUnmount(() => {
  try {
    try {
      destroyModel(container, animationID, camera, renderer, modelScene, scene);
      renderer = null!;
      scene = null!;
      THREE.Cache.clear();
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
});
</script>
<style scoped lang="less">
.page {
  position: fixed;
  left: 0;
  top: 0;
}
.progessDiv {
  position: fixed;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);

  .text {
    font-size: 30px;
    font-weight: 600;
    color: #fff;
    text-align: center;
  }

  .progessBox {
    width: 30vh;
    height: 5vh;
    margin-top: 20px;
    border-radius: 20px;
    border: 4px solid #fff;
    overflow: hidden;

    .progess {
      width: 100%;
      height: 100%;
      background: rgb(15, 25, 190);
    }
  }
}
</style>
