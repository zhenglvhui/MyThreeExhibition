<template>
  <div class="mainSecondPage">
    <div class="closeIcon" @click="closePage"></div>
    <div class="commonModelRender">
      <template v-for="item in Object.keys(commonRenderData)" :key="item">
        <CommonModelRender v-if="meshName == item" v-bind="commonRenderData[item]"  />
      </template>
      <!-- v-if="isShowCommonModelRender"  -->
      <AboutMe v-if="meshName == 'computer'"></AboutMe>
    </div>
  </div>
</template>
<script setup lang="ts">
import CommonModelRender from "@/components/CommonModelRender/CommonModelRender.vue";
import { reactive, defineEmits, onMounted, defineProps, ref, Ref, defineAsyncComponent } from "vue";
import carGlbUrl from "@/assets/models/car.glb";
import moneyGlbUrl from "@/assets/models/money.glb";
import firmamentGlbUrl from "@/assets/models/firmament.glb";
import earthGlbUrl from "@/assets/models/earth.glb";
import treeGlbUrl from "@/assets/models/tree.glb";
import rubikCubeGlbUrl from "@/assets/models/rubikCube.glb";
import mypikachuGlbUrl from "@/assets/models/mypikachu.glb";
import robotGlbUrl from "@/assets/models/robot.glb";
import AboutMe from "@/components/AboutMe/AboutMe.vue";
import * as THREE from "three";
import { ItCommonRenderData, ItCommonRenderItemData, ItControlsObject, ItPlayAllSpecialAnimateFn } from "@/ts/interface/modelRender";

let emits = defineEmits(["close"]);
const props = withDefaults(defineProps<{ meshName?: string;  }>(), {});

let commonRenderData: ItCommonRenderData = reactive({
  // 小车
  car: {
    camraPosition: {
      x: 0.83,
      y: 4.86,
      z: 3.3,
    },
    glbUrl: carGlbUrl,
    controlsObject: {
      target: new THREE.Vector3(-5.67, 0, 0.57),
      maxDistance: 10, // 最大缩放距离
      minDistance: 8, // 最小缩放距离
      enablePan: false, // 不允许平移
      maxPolarAngle: Math.PI * 0.45, // 最大垂直角度
    },
  },
  // 金币
  money: {
    camraPosition: {
      x: -10.06,
      y: 6.4,
      z: 13.91,
    },
    controlsObject: {
      target: new THREE.Vector3(0, 2.09, 0),
      maxDistance: 30, // 最大缩放距离
      minDistance: 15, // 最小缩放距离
      enablePan: false, // 不允许平移
    },
    glbUrl: moneyGlbUrl,
    isNeedAmbientLightL: true,
    ambientIntensity: 0.1,
    intensityDivided: 1.3,
    isSelfRotation: true,
  },
  // 太空
  firmament: {
    camraPosition: {
      x: 3.9,
      y: 3.15,
      z: 6.18,
    },
    controlsObject: {
      target: new THREE.Vector3(0, 2.09, 0),
      maxDistance: 11, // 最大缩放距离
      minDistance: 7, // 最小缩放距离
      enablePan: false, // 不允许平移
    },
    glbUrl: firmamentGlbUrl,
    isNeedAmbientLight: true,
    isNeedCameraPointLight: true,
    cameraPointLightIntensity: 300,
    isSelfRotation: true,
  },
  // 地球
  earth: {
    camraPosition: {
      x: 4.2,
      y: 2.41,
      z: 0.66,
    },
    controlsObject: {
      target: new THREE.Vector3(-0.02, -0.3, -0.023),
      maxDistance: 6, // 最大缩放距离
      minDistance: 4, // 最小缩放距离
      enablePan: false, // 不允许平移
    },
    glbUrl: earthGlbUrl,
    isNeedAmbientLight: true,
    ambientIntensity: 1,
    isNeedCameraPointLight: true,
    cameraPointLightIntensity: 1,
    intensityDivided: 2,
    isSelfRotation: false,
    renderOutputColorSpace: THREE.SRGBColorSpace,
  },
  // 荧光树
  tree: {
    camraPosition: {
      x: -3.71,
      y: 1.51,
      z: -3.96,
    },
    controlsObject: {
      target: new THREE.Vector3(0, 0.33, 0),
      maxDistance: 6, // 最大缩放距离
      minDistance: 4, // 最小缩放距离
      enablePan: false, // 不允许平移
    },
    glbUrl: treeGlbUrl,
    isNeedAmbientLight: true,
    ambientIntensity: 5,
    isNeedCameraPointLight: true,
    cameraPointLightIntensity: 40,
    intensityDivided: 0.3,
    isSelfRotation: true,
    renderOutputColorSpace: THREE.SRGBColorSpace,
  },
  // 魔方
  rubikCube: {
    camraPosition: {
      x: -1.65,
      y: 1.32,
      z: 8.596,
    },
    controlsObject: {
      target: new THREE.Vector3(0, 2, 0),
      maxDistance: 10, // 最大缩放距离
      minDistance: 8, // 最小缩放距离
      enablePan: false, // 不允许平移
    },
    glbUrl: rubikCubeGlbUrl,
    cameraPointLightIntensity: 0.5,
    isSelfRotation: false,
    renderOutputColorSpace: THREE.SRGBColorSpace,
  },
  //  皮卡丘
  mypikachu: {
    camraPosition: {
      x: 2.5,
      y: 2.7,
      z: 2.27,
    },
    controlsObject: {
      target: new THREE.Vector3(0, 1, 0),
      maxDistance: 6, // 最大缩放距离
      minDistance: 3, // 最小缩放距离
      enablePan: false, // 不允许平移
    },
    glbUrl: mypikachuGlbUrl,
    isNeedAmbientLight: true,
    isNeedCameraPointLight: true,
    cameraPointLightIntensity: 3,
    intensityDivided: 3,
    isSelfRotation: false,
  },
  // 机器人
  robot: {
    camraPosition: {
      x: 8.4,
      y: 25,
      z: 32,
    },
    controlsObject: {
      target: new THREE.Vector3(0, 1, 0),
      maxDistance: 45, // 最大缩放距离
      minDistance: 35, // 最小缩放距离
      enablePan: false, // 不允许平移
      maxPolarAngle: Math.PI * 0.5, // 最大垂直角度
    },
    glbUrl: robotGlbUrl,
    isNeedAmbientLight: true,
    ambientIntensity: 7,
    isNeedCameraPointLight: true,
    cameraPointLightIntensity: 30,
    isSelfRotation: false,
    renderOutputColorSpace: THREE.SRGBColorSpace,
    playAllSpecialAnimateFn: [
      {
        animationName: "Action.002",
        fnArr: [{ fn: "setDuration", fnParams: 20 }],
      },
    ],
  },
});
let renderData: ItCommonRenderItemData | undefined = reactive({});
let isShowCommonModelRender: Ref<boolean> = ref(false);

// 关闭当前页面
let closePage = () => {
  emits("close");
};

onMounted(() => {
  if (props.meshName) {
    renderData = commonRenderData[props.meshName];
    isShowCommonModelRender.value = true;
  }
});
</script>
<style scoped lang="less">
.mainSecondPage {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  box-sizing: border-box;

  position: relative;

  .closeIcon {
    position: absolute;
    right: 15px;
    top: 15px;
    width: 35px;
    height: 30px;
    background: url("../../assets/images/icon-close.png") no-repeat center center / 100% 100%;
    cursor: pointer;
    z-index: 1;

    &:hover {
      transform: scale(1.1);
      transition: all 0.3s linear;
    }
  }
}

.commonModelRender {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
