<!--
 * @Date: 2022-04-24 11:39:04
 * @Description: 
-->
<template>
  <div class="Exhibition page">
    <!-- 按钮位置 -->
    <div class="icon">
      <div class="item">
        <div class="text">{{ Decode_ENUM_VIEW_TYPE[currentView] }}</div>
        <div class="change" @click="changeView()"></div>
      </div>
    </div>
    <!-- 二级弹出位置 -->
    <Transition name="scale">
      <MainSecondPage
        class="mainSecondPage"
        @close="hideSecondPage"
        :meshName="mainSecondPageMeshName"
        :isLoading="mainSecondPageisLoading"
        v-if="isShowMainSecondPage"
      />
    </Transition>

    <!-- @click="getCamera" -->
    <div ref="container"></div>
    <Loading :progress="progress" class="loadingPage" v-if="progress != 100" @complete="complete" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, getCurrentInstance, Ref, reactive } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import * as dat from "dat.gui";
import Loading from "@/components/Loading/Loading.vue";
import exhibitionGlbUrl from "@/assets/models/exhibition.glb";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  playAllAnimate,
  onWindowResize,
  openShowDowAndLight,
  getIntersects,
  throttle,
  isMobile,
  useGetGlobalProperties,
  createSpriteMesh,
} from "@/js/util";
import Stats from "three/examples/jsm/libs/stats.module.js";
// import { myLightHelpers } from "@/js/threeHelper";
import { ENUM_LIGHT_HELPER, ENUM_MESH_TYPE, ENUM_VIEW_TYPE, Decode_ENUM_VIEW_TYPE } from "@/js/Enum";
import * as TWEEN from "@tweenjs/tween.js";
import MainSecondPage from "@/components/MainSecondPage/MainSecondPage.vue";

let scene: THREE.Scene; // 场景
let camera: THREE.PerspectiveCamera; // 相机
let container: Ref<HTMLElement | null> = ref(null);
// const gui = new dat.GUI(); // 初始化gui
let clock: THREE.Clock = new THREE.Clock();
let renderer: THREE.WebGLRenderer; // 渲染器
let mixer: THREE.AnimationMixer; // 动画切片
let controls: OrbitControls;
let modelScene: THREE.Group;
// let cachePosition = {}; // 缓存位置
let currentView = ref(ENUM_VIEW_TYPE.internal); // 当前视图
let initMeshPoint: THREE.Object3D<THREE.Event>; // 初始模型点位
let meshCeiling: THREE.Object3D<THREE.Event>; // 天花板模型
let isShowMainSecondPage: Ref<boolean> = ref(false); // 是否打开二级弹出
let mainSecondPageMeshName: Ref<string | undefined> = ref(undefined);
let mainSecondPageMeshNameList: string[] = reactive([]); //  点击物体集合
let mainSecondPageisLoading: Ref<boolean> = ref(true); //  子页面是否需要loading
let spriteMeshList: THREE.Object3D<THREE.Event>[] = []; // 点精灵图集合

interface pointXY {
  x: number;
  y: number;
}
let spriteInitScale: pointXY = { x: 8, y: 6 }; // 点精灵初始缩放大小
let enterArrow: THREE.Object3D<THREE.Event>; // 进入箭头

let getCamera = (): void => {
  console.log({ camera });
  console.log({ controls: controls.target });
};

// 初始化场景
let initScene = (): void => {
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
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.value?.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.VSMShadowMap;
};

// 初始化相机
let initCamera = (): void => {
  camera = new THREE.PerspectiveCamera(isMobile() ? 80 : 60, window.innerWidth / window.innerHeight, 10, 100000);
  camera.position.set(-17, 165, 573);
};

let progress = ref(0);
const { $dracoLoader } = useGetGlobalProperties();
// 加载模型
let loaderModel = (): void => {
  const loader = new GLTFLoader();
  loader.setDRACOLoader($dracoLoader);
  loader.load(
    exhibitionGlbUrl,
    (gltf) => {
      console.log({ ExhibitionRender: gltf });
      scene.add(gltf.scene);
      renderer.compile(scene, camera);
      mixer = playAllAnimate(gltf.scene, gltf.animations);
      modelScene = gltf.scene;
      modelScene.traverse(function (child) {
        openShowDowAndLight(child, 1);
        // 前往
        if (child.userData?.name == "move-computer") {
          initMeshPoint = child;
        }
        if (child.userData?.name == "enter-arrow") {
          enterArrow = child;
          enterArrow.visible = false;
        }
        if (child.name == "天花板") {
          meshCeiling = child;
        }
        if (child.userData.name && child.userData.name.split("-")[0] == ENUM_MESH_TYPE.finger) {
          // 创建文字精灵物体
          let text = child.userData.name.split("-")[2].split("_")[0];
          let spriteMesh = createSpriteMesh(text);
          spriteMesh.scale.set(spriteInitScale.x, spriteInitScale.y, 1);
          spriteMesh.position.set(child.position.x, child.position.y + 3, child.position.z);
          spriteMesh.name = ENUM_MESH_TYPE.text + "-" + child.userData.name.split("-")[1];
          spriteMesh.visible = false;
          spriteMeshList.push(spriteMesh);
          modelScene.add(spriteMesh);
        }
      });
      renderer.render(scene, camera);
    },
    (xhr) => {
      let nowProgress: number = Math.floor((xhr.loaded / xhr.total) * 100);
      progress.value = nowProgress;
    },
    (error) => {
      console.log({ loadModelError: error });
    }
  );
};

// 初始化控制器
let initControls = (): void => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false; // 不允许平移
  controls.target = new THREE.Vector3(-2.0, 26, -20);
  exhibitionInsideControls();
  controls.update();
};

// 切换到展厅内的控制器设置
let exhibitionInsideControls = (isNeedTween = true): void => {
  controls.enableZoom = false; // 是否可以缩放
  controls.maxPolarAngle = Math.PI * 0.7; // 最大垂直角度
  controls.maxDistance = Infinity; // 最大缩放距离
  controls.minDistance = -Infinity; // 最小缩放距离
  controls.enableRotate = true;
  spriteMeshList.map((item) => {
    item.visible = false;
    item.scale.set(spriteInitScale.x, spriteInitScale.y, 1);
  });
  if (meshCeiling) {
    meshCeiling.visible = true;
  }
  if (enterArrow) {
    enterArrow.visible = false;
  }
  if (!isNeedTween) return;
  moveCameraTween(new THREE.Vector3(-6.7, 44, 497), new THREE.Vector3(5.79, 26, 26), false, () => {
    handerClick(initMeshPoint, [ENUM_MESH_TYPE.move]);
  });
};

// 切换到展厅外部的控制器设置
let exhibitionOutsideControls = (isNeedTween = true) => {
  controls.enableRotate = true;
  controls.maxPolarAngle = Math.PI; // 最大垂直角度
  meshCeiling.visible = true;
  enterArrow.visible = true;
  spriteMeshList.map((item) => {
    item.visible = false;
    item.scale.set(spriteInitScale.x, spriteInitScale.y, 1);
  });
  if (!isNeedTween) return;
  moveCameraTween(new THREE.Vector3(-315, 350, 478), new THREE.Vector3(0, 0, -1), false);
};

// 切换到俯视图的控制器设置
let exhibitionVerticalControls = (isNeedTween = true) => {
  controls.enableZoom = true;
  controls.enableRotate = false;
  controls.maxDistance = 900; // 最大缩放距离
  controls.minDistance = 500; // 最小缩放距离
  meshCeiling.visible = false;
  enterArrow.visible = true;
  spriteMeshList.map((item) => {
    item.visible = true;
    item.scale.set(85, 70, 1);
  });
  if (!isNeedTween) return;
  moveCameraTween(new THREE.Vector3(0, 672, 0), new THREE.Vector3(0, 0, -1), false);
};

//  切换不同视图
let changeView = (isNeedTween = true, callback = () => {}, viewType?: number): void => {
  if (viewType) {
    currentView.value = viewType;
    callback();
  } else {
    // 展厅内
    if (currentView.value == ENUM_VIEW_TYPE.internal) {
      currentView.value = ENUM_VIEW_TYPE.vertical;
      exhibitionVerticalControls(isNeedTween);
      // 俯视图
    } else if (currentView.value == ENUM_VIEW_TYPE.vertical) {
      currentView.value = ENUM_VIEW_TYPE.external;
      exhibitionOutsideControls(isNeedTween);
    } else {
      currentView.value = ENUM_VIEW_TYPE.internal;
      exhibitionInsideControls(isNeedTween);
    }
  }
};

let initLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(light);
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  scene.add(camera);
  camera.add(pointLight);
};

// 性能检测
// let stats;
// let statsUpdate = () => {
//   stats = new Stats();
//   stats.setMode(0);
//   stats.domElement.style.position = "absolute";
//   stats.domElement.style.left = "0px";
//   stats.domElement.style.top = "0px";
//   document.body.appendChild(stats.domElement);
// };

let sceneUpdate = () => {
  // stats.update();
  renderer.render(scene, camera);
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  TWEEN.update();
  requestAnimationFrame(sceneUpdate);
};

// 初始化
let init = () => {
  initRender();
  initScene();
  initCamera();
  sceneUpdate();
  initControls();
  initLight();
  loaderModel();
  // statsUpdate();
};

// 移动位置动画
/**
 *
 * @param {Vector3} movePosition  要移动到的位置
 * @param {Vector3} targetPosition 要看向的位置
 * @param {Boolean} isInternal 是否内部浏览
 */
let globalTween: TWEEN.Tween<THREE.Vector3>;
let moveCameraTween = (movePosition: THREE.Vector3, targetPosition: THREE.Vector3, isInternal: boolean = true, callback = () => {}) => {
  let toTargetPositionY = isInternal ? targetPosition.y : movePosition.y;
  if (globalTween) {
    globalTween.stop();
  }
  // 解决微任务bug
  setTimeout(() => {
    controls.enableRotate = false;
  }, 0);
  globalTween = new TWEEN.Tween(camera.position)
    .to(new THREE.Vector3(movePosition.x, toTargetPositionY, movePosition.z), 3000)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .start()
    .onUpdate((nowPosition, percentage) => {
      controls.target.set(
        targetPosition.x * percentage + nowPosition.x * (1 - percentage),
        targetPosition.y * percentage + nowPosition.y * (1 - percentage),
        targetPosition.z * percentage + nowPosition.z * (1 - percentage)
      );
      controls.update();
    })
    .onComplete(() => {
      callback();
      if (currentView.value != ENUM_VIEW_TYPE.vertical) {
        controls.enableRotate = true;
      }
      // 看向物体前方一点
      if (!isInternal) return;
      let firstMeshPositionCopy: THREE.Vector3 = movePosition.clone();
      let targetMeshPositionCopy: THREE.Vector3 = targetPosition.clone();
      firstMeshPositionCopy.lerp(targetMeshPositionCopy, 0.05);
      controls.target.set(firstMeshPositionCopy.x, targetMeshPositionCopy.y, firstMeshPositionCopy.z);
    });
};

interface layerXY {
  layerX: number;
  layerY: number;
}
let onDownLayer: layerXY;
let onDocumentMouseDown = (event: MouseEvent) => {
  event.preventDefault();
  onDownLayer = { layerX: event.pageX, layerY: event.pageY };
};
let throttleOnDocumentMouseDown = throttle(onDocumentMouseDown, 100);

// 鼠标点击事件
let onDocumentMouseUp = (event: MouseEvent) => {
  event.preventDefault();
  if (Math.abs(event.pageX - onDownLayer.layerX) > 2 || Math.abs(event.pageY - onDownLayer.layerY) > 2) return;
  let { raycasterMesh } = getIntersects(event.pageX, event.pageY, camera, scene);
  let firstMesh = raycasterMesh.length > 0 ? raycasterMesh[0].object : undefined; // 第一个被射线碰到的物体
  if (!firstMesh) return;
  recurMeshParentName(firstMesh, [ENUM_MESH_TYPE.move, ENUM_MESH_TYPE.click, ENUM_MESH_TYPE.enter], handerClick);
};

// 递归循坏父级名字
/**
 *
 * @param {*} mesh
 * @param {Array} supportedTypes 支持的类型
 * @param {Fucntion} handerClick 回调后要被执行的函数
 */
// type ItRecurMeshParentNameFn = handerClick | handerMove;
let recurMeshParentName = (
  mesh: THREE.Object3D<THREE.Event>,
  supportedTypes: string[] = [],
  fn: (firstMesh: THREE.Object3D<THREE.Event>, supportedTypes: string[]) => void = handerClick
) => {
  if (mesh.userData.name && mesh.userData.name.split("-").length > 1) {
    fn(mesh, supportedTypes);
  } else if (mesh.parent == null) {
    return;
  } else {
    recurMeshParentName(mesh.parent, supportedTypes, fn);
  }
};

// 点击要移动的物体 或则要展示二级页面的物体时触发 点击事件时
// @param {*} supportedTypes 支持的类型
let handerClick = (firstMesh: THREE.Object3D<THREE.Event>, supportedTypes: string[] = []) => {
  let firstMeshUserName = firstMesh.userData.name;
  if (!firstMeshUserName) return;
  // 被点击的物体类型
  let meshType: ENUM_MESH_TYPE = firstMeshUserName.split("-")[0];
  if (!supportedTypes.includes(meshType)) return; // 如果是不支持的类型，直接return
  // 被点击后指向的物体
  let targetMeshName = firstMeshUserName.split("-")[1];
  switch (meshType) {
    case ENUM_MESH_TYPE.move:
      modelScene.traverse((item) => {
        let { userData } = item;
        if (!userData.name) return;
        let itemMeshType = userData.name.split("-")[0]; //  当前循环mesh类型
        if (itemMeshType != ENUM_MESH_TYPE.click) return;
        let itemMeshName = userData.name.split("-")[1]; // 当前循环mesh名称
        // 当前循环类型名字和要循环的名字一样时前往
        if (itemMeshName == targetMeshName) {
          changeView(
            false,
            () => {
              exhibitionInsideControls(false);
            },
            ENUM_VIEW_TYPE.internal
          );
          moveCameraTween(firstMesh.position, item.position);
        }
      });
      break;
    case ENUM_MESH_TYPE.click:
      showSecondPage(firstMesh);
      break;
    case ENUM_MESH_TYPE.text:
      showMoveText(firstMesh);
      break;
    case ENUM_MESH_TYPE.enter:
      exhibitionInsideControls();
      break;
    default:
      return;
  }
};

let throttleOnDocumentMouseUp = throttle(onDocumentMouseUp, 100);

let onDocumentMouseMove = (event: MouseEvent) => {
  event.preventDefault();
  let { raycasterMesh } = getIntersects(event.pageX, event.pageY, camera, scene);
  let firstMesh: THREE.Object3D<THREE.Event> | undefined = raycasterMesh.length > 0 ? raycasterMesh[0].object : undefined; // 第一个被射线碰到的物体
  if (!firstMesh) return;
  recurMeshParentName(firstMesh, [ENUM_MESH_TYPE.click], handerMove);
};

// 鼠标滑动事件时触发
let handerMove = (firstMesh: THREE.Object3D<THREE.Event>, supportedTypes: string[] = []) => {
  let firstMeshUserName = firstMesh.userData.name;
  if (!firstMeshUserName) return;
  // 被点击的物体类型
  let meshType: ENUM_MESH_TYPE = firstMeshUserName.split("-")[0];
  if (!supportedTypes.includes(meshType)) return; // 如果是不支持的类型，直接return
  switch (meshType) {
    case ENUM_MESH_TYPE.click:
      showMoveText(firstMesh);
      break;
  }
};

// 鼠标移动到物体展示要出现的文字
let showMoveText = (mesh: THREE.Object3D<THREE.Event>) => {
  if (currentView.value != ENUM_VIEW_TYPE.internal) return;
  let meshSplit = mesh.name.split("-");
  spriteMeshList.map((item: THREE.Object3D<THREE.Event>) => {
    let itemSplit = item.name.split("-");
    // 如果是text类型就隐藏，否则就显示
    item.visible = false;
    if (itemSplit[1] == meshSplit[1]) {
      item.visible = true;
    }
  });
};

let throttleOnDocumentMouseMove = throttle(onDocumentMouseMove, 100);

//展示页面
/**
 *
 * @param {Mesh} mesh  被点击的目标
 */
let showSecondPage = (mesh: THREE.Object3D<THREE.Event>) => {
  let meshName: string = mesh.userData.name.split("-")[1].split("_")[0];
  mainSecondPageMeshName.value = meshName;
  // 判断是否加载过，如果加载过了，下次就不进行loading
  if (mainSecondPageMeshNameList.filter((item: string) => item == meshName).length >= 1) {
    mainSecondPageisLoading.value = false;
  } else {
    mainSecondPageMeshNameList.push(meshName);
    mainSecondPageisLoading.value = true;
  }
  isShowMainSecondPage.value = true;
};

//隐藏页面
let hideSecondPage = () => {
  isShowMainSecondPage.value = false;
};

let complete = () => {
  init();
  window.addEventListener("resize", onWindowResize(camera, renderer), false);
  document.addEventListener("mousemove", throttleOnDocumentMouseMove, false);
  container.value?.addEventListener("mousedown", throttleOnDocumentMouseDown, false);
  container.value?.addEventListener("mouseup", throttleOnDocumentMouseUp, false);
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
  overflow: hidden;
}

.mainSecondPage {
  position: fixed;
  z-index: 3;
}

.loadingPage {
  position: fixed;
  z-index: 100;
}

.icon {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 2;
  display: flex;
  justify-content: flex-end;

  .item {
    width: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    margin-bottom: 20px;
    .text {
      text-align: center;
      color: #fff;
      font-weight: 600;
      font-size: 12px;
      width: 50px;
    }

    .change {
      width: 40px;
      height: 40px;
      background: url("../assets/images/icon-change.png") no-repeat center center / 100% 100%;
      cursor: pointer;
      animation: changeIcon 1s infinite linear;
    }
  }
}

@keyframes changeIcon {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.2);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s linear;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
