<template>
  <!-- <div class="page"> -->
  <CommonModelRender v-bind="renderData" />
  <!-- </div> -->
</template>
<script setup lang="ts">
import CommonModelRender from "@/components/CommonModelRender/CommonModelRender.vue";
import { reactive } from "vue";
import carGlbUrl from "@/assets/models/car.glb";
import moneyGlbUrl from "@/assets/models/money.glb";
import firmamentGlbUrl from "@/assets/models/firmament.glb";
import earthGlbUrl from "@/assets/models/earth.glb";
import treeGlbUrl from "@/assets/models/tree.glb";
import rubikCubeGlbUrl from "@/assets/models/rubikCube.glb";
import mypikachuGlbUrl from "@/assets/models/pikachu.glb";
import robotGlbUrl from "@/assets/models/robot.glb";
import * as THREE from "three";

let renderData = reactive({
  camraPosition: {
    x: 0,
    y: 0,
    z: 0,
  },
  controlsObject: {
    target: new THREE.Vector3(0, 0.1, 0),
    maxDistance: 8, // 最大缩放距离
    minDistance: -8, // 最小缩放距离
    // enablePan: false, // 不允许平移
    // maxPolarAngle: Math.PI * 0.5, // 最大垂直角度
  },
  glbUrl: mypikachuGlbUrl,
  isNeedAmbientLight: true,
  isNeedCameraPointLight: true,
  cameraPointLightIntensity: 0.3,
  // intensityDivided:3,
  isSelfRotation: false,
  renderOutputColorSpace: THREE.SRGBColorSpace,
});

// 小车
// let renderData = reactive({
//   camraPosition: {
//     x: 0.83,
//     y: 4.86,
//     z: 3.3,
//   },
//   glbUrl: carGlbUrl,
//   controlsObject: {
//     target: new THREE.Vector3(-5.67, 0, 0.57),
//     maxDistance: 10, // 最大缩放距离
//     minDistance: 8, // 最小缩放距离
//     enablePan: false, // 不允许平移
//     maxPolarAngle: Math.PI * 0.45, // 最大垂直角度
//   },
//   // isNeedAmbientLight: true,
//   // isNeedCameraPointLight: true,
//   // cameraPointLightIntensity: 2,
//   intensityDivided: 1,
// });

// 金币
// let renderData = reactive({
//   camraPosition: {
//     x: -10.06,
//     y: 6.4,
//     z: 13.91,
//   },
//   controlsObject: {
//     target: new THREE.Vector3(0, 2.09, 0),
//     maxDistance: 30, // 最大缩放距离
//     minDistance: 15, // 最小缩放距离
//     enablePan: false, // 不允许平移
//     // maxPolarAngle: Math.PI * 0.45, // 最大垂直角度
//   },
//   glbUrl: moneyGlbUrl,
// isNeedAmbientLightL: true,
// ambientIntensity: 0.1,
// intensityDivided: 200000,
//   isSelfRotation: true,
// });

// 太空
// let renderData = reactive({
//   camraPosition: {
//     x: 3.9,
//     y: 3.15,
//     z: 6.18,
//   },
//   controlsObject: {
//     target: new THREE.Vector3(0, 2.09, 0),
//     maxDistance: 11, // 最大缩放距离
//     minDistance: 7, // 最小缩放距离
//     enablePan: false, // 不允许平移
//     // maxPolarAngle: Math.PI * 0.5, // 最大垂直角度
//   },
//   glbUrl: firmamentGlbUrl,
//   isNeedAmbientLight: true,
//   isNeedCameraPointLight: true,
//   cameraPointLightIntensity:1.5,
//   isSelfRotation: true,
// });

// 地球
// let renderData = reactive({
//   camraPosition: {
//     x: 4.2,
//     y: 2.41,
//     z: 0.66,
//   },
//   controlsObject: {
//     target: new THREE.Vector3(-0.02, -0.3, -0.023),
//     maxDistance: 6, // 最大缩放距离
//     minDistance: 4, // 最小缩放距离
//     enablePan: false, // 不允许平移
//     // maxPolarAngle: Math.PI * 0.5, // 最大垂直角度
//   },
//   glbUrl: earthGlbUrl,
//   isNeedAmbientLight: true,
//   isNeedCameraPointLight: true,
//   cameraPointLightIntensity: 2,
//   isSelfRotation: false,
//   renderOutputColorSpace: THREE.SRGBColorSpace,
// });

// 荧光书
// let renderData = reactive({
//   camraPosition: {
//     x: -3.71,
//     y: 1.51,
//     z: -3.96,
//   },
//   controlsObject: {
//     target: new THREE.Vector3(0,0.33, 0),
//     maxDistance: 6, // 最大缩放距离
//     minDistance: 4, // 最小缩放距离
//     enablePan: false, // 不允许平移
//     // maxPolarAngle: Math.PI * 0.5, // 最大垂直角度
//   },
//   glbUrl: treeGlbUrl,
//   isNeedAmbientLight: true,
//   isNeedCameraPointLight: true,
//   cameraPointLightIntensity: 4,
//   intensityDivided:3,
//   isSelfRotation: true,
//   renderOutputColorSpace: THREE.SRGBColorSpace,
// });
// 魔方
// let renderData = reactive({
//   camraPosition: {
//     x: -1.65,
//     y: 1.32,
//     z: 8.596,
//   },
//   controlsObject: {
//     target: new THREE.Vector3(0, 2, 0),
//     maxDistance: 10, // 最大缩放距离
//     minDistance: 8, // 最小缩放距离
//     enablePan: false, // 不允许平移
//     // maxPolarAngle: Math.PI * 0.5, // 最大垂直角度
//   },
//   glbUrl: rubikCubeGlbUrl,
//   // isNeedAmbientLight: true,
//   // isNeedCameraPointLight: true,
//   cameraPointLightIntensity: 0.5,
//   // intensityDivided:3,
//   isSelfRotation: false,
//   renderOutputColorSpace: THREE.SRGBColorSpace,
// });

//  皮卡丘
// let renderData = reactive({
//   camraPosition: {
//     x: 2.5,
//     y: 2.7,
//     z: 2.27,
//   },
//   controlsObject: {
//     target: new THREE.Vector3(0, 1, 0),
//     maxDistance: 6, // 最大缩放距离
//     minDistance: 3, // 最小缩放距离
//     enablePan: false, // 不允许平移
//     // maxPolarAngle: Math.PI * 0.5, // 最大垂直角度
//   },
//   glbUrl: mypikachuGlbUrl,
//   isNeedAmbientLight: true,
//   isNeedCameraPointLight: true,
//   cameraPointLightIntensity: 0.3,
//   // intensityDivided:3,
//   isSelfRotation: false,
//   renderOutputColorSpace: THREE.SRGBColorSpace,
// });

// 机器人
// let renderData = reactive({
//   camraPosition: {
//     x: 8.4,
//     y:  25,
//     z: 32,
//   },
//   controlsObject: {
//     target: new THREE.Vector3(0, 1, 0),
//     maxDistance: 45, // 最大缩放距离
//     minDistance: 35, // 最小缩放距离
//     enablePan: false, // 不允许平移
//     maxPolarAngle: Math.PI * 0.5, // 最大垂直角度
//   },
//   glbUrl: robotGlbUrl,
// isNeedAmbientLight: true,
// isNeedCameraPointLight: true,
// cameraPointLightIntensity: 0.3,
// // intensityDivided:3,
//   isSelfRotation: false,
//   renderOutputColorSpace: THREE.SRGBColorSpace,
//   playAllSpecialAnimateFn:[{
//     animationName:'Action.002', fnArr: [{fn:'setDuration', fnParams:20}]
//   }]
// });
</script>
<style scoped lang="less">
.page {
  width: 100%;
  height: 100%;
}
</style>