// 工具类
import * as THREE from "three";
import { Ref, getCurrentInstance } from "vue";
import { ItPlayAllSpecialAnimateFn, ItFnArr } from "@/js/interface/modelRender";

// 执行全部动画  mesh 执行的动画的mesh  animations 要执行的动画集合  setFramePlay从第几帧开始播放
const playAllAnimate = function (mesh: THREE.Group, animations: THREE.AnimationClip[], setFramePlay: number = 1, playAllSpecialAnimateFn: ItPlayAllSpecialAnimateFn[] = []): THREE.AnimationMixer {
  let mixer: THREE.AnimationMixer;
  mixer = new THREE.AnimationMixer(mesh);
  animations.forEach(function (clip): void {
    mixer.setTime(setFramePlay);
    let findItem = playAllSpecialAnimateFn.find((item) => item.animationName == clip.name);
    if (findItem) {
      let mixerStorage = mixer.clipAction(clip);
      findItem.fnArr.map((item: ItFnArr) => {
        mixerStorage = (mixerStorage as any)[item.fn](item.fnParams);
      });
      mixerStorage.play();
    } else {
      mixer.clipAction(clip).play();
    }
  });
  return mixer;
};

// 页面窗口变动，重新渲染
const onWindowResize = (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
  return function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
};

// 显示阴影公共处理方法  isReceiveShadow 是否投射阴影
const showShowDow = function (mesh: any, isReceiveShadow: boolean = false, isCastShadow: boolean = false) {
  if (isReceiveShadow || isCastShadow) {
    mesh.castShadow = true;
    mesh.material.side = THREE.DoubleSide;
    mesh.material.shadowSide = THREE.BackSide;
  }
  if (isReceiveShadow) {
    mesh.receiveShadow = true;
  }
};

// 显示灯光公共处理方法 isCastShadow 是否显示阴影 intensityDivided导出转换的功率的倍率
const showLight = (light: any, isCastShadow: boolean = false, intensityDivided: number = 1) => {
  light.intensity = light.intensity / intensityDivided;
  // if (light.isSpotLight) {
  //   light.intensity = light.intensity / intensityDivided / 4;
  // } else if (light.isDirectionalLight) {
  //   //  1 = 683
  //   // light.intensity = light.intensity / 683;
  // } else {
  //   light.intensity = light.intensity / intensityDivided;
  // }
  light.castShadow = isCastShadow;
  if (isCastShadow) {
    light.shadow.mapSize.width = 2048; // default
    light.shadow.mapSize.height = 2048; // default
  }
};

// 开启模型灯光阴影
const openShowDowAndLight = function (mesh: any, intensityDivided?: number) {
  if (mesh.isMesh) {
    showShowDow(mesh, mesh.name.includes("rShadow"), mesh.name.includes("cShadow"));
  }
  if (mesh.isLight) {
    showLight(mesh, mesh.name.includes("cShadow"), intensityDivided);
  }
};

// 获取射线交点，用于判断是否接触到物体了
/**
 *
 * @param {Number} x 鼠标x
 * @param {Number} y 鼠标y
 * @param {Camera} camera 正在使用的相机
 * @param {Scene} scene 要被判断的场景
 * @returns
 */
const getIntersects = function (x: number, y: number, camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
  if (!camera || !scene) return { raycasterMesh: [] };
  let raycaster: THREE.Raycaster = new THREE.Raycaster();
  let mouse: THREE.Vector2 = new THREE.Vector2();
  x = (x / window.innerWidth) * 2 - 1;
  y = -(y / window.innerHeight) * 2 + 1;
  // mouse.set(x, y, 0.5);
  mouse.set(x, y);
  raycaster.setFromCamera(mouse, camera);
  let raycasterMesh = raycaster.intersectObjects(scene.children); // 穿过的物体
  return {
    raycasterMesh,
  };
};

// 防抖
const debounce = function <A extends any[], R>(fn: (...args: A) => R, delay: number = 1000): (...args: A) => void {
  let timer: number | null = null;
  return function (this: void, ...args: A): void {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// 节流
const throttle = function <A extends any[], R>(fn: (...args: A) => R, delay: number = 1000): (...args: A) => void {
  let flag: boolean = true;
  return function (this: void, ...args: A): void {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, args);
      flag = true;
    }, delay);
  };
}

// 判断是否移动端
const isMobile = function (): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 销毁模型
interface ItDestroyModel<K extends keyof HTMLElementEventMap> {
  container: Ref<HTMLElement | null>,
  animationID: number,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  modelScene: THREE.Group,
  scene: THREE.Scene,
  type?: K,
  throttleOnDocumentMouseMove?: (this: HTMLElement, event: HTMLElementEventMap[K]) => any
}


type ItKeyOfIfDestroyModel<K extends keyof HTMLElementEventMap> = [
  container: Ref<HTMLElement | null>,
  animationID: number,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  modelScene: THREE.Group,
  scene: THREE.Scene,
  type?: K,
  throttleOnDocumentMouseMove?: (this: HTMLElement, event: HTMLElementEventMap[K]) => void
]

function destroyModel<K extends keyof HTMLElementEventMap>(args: ItDestroyModel<K>): void;
function destroyModel<K extends keyof HTMLElementEventMap>(...args: ItKeyOfIfDestroyModel<K>): void;
function destroyModel<K extends keyof HTMLElementEventMap>(...args: any[]): void {
  let fnArg: ItDestroyModel<K>;
  if (args.length === 1) {
    fnArg = args[0];
  } else {
    fnArg = { container: args[0], animationID: args[1], camera: args[2], renderer: args[3], modelScene: args[4], scene: args[5], type: args[6], throttleOnDocumentMouseMove: args[7] };
  }
  let { container, animationID, camera, renderer, modelScene, scene, type, throttleOnDocumentMouseMove } = fnArg;
  if (!container.value) return;
  window.removeEventListener("resize", onWindowResize(camera, renderer), false);
  if (throttleOnDocumentMouseMove && type) {
    container.value.removeEventListener(type, throttleOnDocumentMouseMove, false);
  }
  cancelAnimationFrame(animationID); // 去除animationFrame
  modelScene.traverse((child: any) => {
    if (child.isMesh) {
      child.geometry.dispose();
      child.material.dispose();
    }
    child = null;
  });
  scene.remove(modelScene);
  scene.clear();
  renderer.forceContextLoss();
  renderer.dispose();
  renderer.clear();
};



// 解构GlobalProperties全局变量
const useGetGlobalProperties = function () {
  const globalApp = getCurrentInstance();
  let globalProperties = globalApp?.appContext.app.config.globalProperties
  return { ...globalProperties };
};

// 创建精灵mesh
const createSpriteMesh = function (name: string, color: number = 0xffff00, font: string = "Bold 60px Arial", lineWidth: number = 2): THREE.Sprite {
  //先用画布将文字画出
  let canvas: HTMLCanvasElement = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 200;
  let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#fff";
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.lineWidth = lineWidth;
    ctx.fillText(name, 200, 150);
  }
  let texture: THREE.Texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  //使用Sprite显示文字
  let material: THREE.SpriteMaterial = new THREE.SpriteMaterial({ map: texture, color: 0xffff00 });
  let sprite: THREE.Sprite = new THREE.Sprite(material);
  return sprite;
};

// 判断是否微信浏览器
const isWeixin = function (): boolean {
  return /MicroMessenger/i.test(navigator.userAgent);
};

export {
  playAllAnimate,
  onWindowResize,
  showShowDow,
  showLight,
  openShowDowAndLight,
  getIntersects,
  debounce,
  throttle,
  isMobile,
  destroyModel,
  useGetGlobalProperties,
  createSpriteMesh,
  isWeixin,
};
