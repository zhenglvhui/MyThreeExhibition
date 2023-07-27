// three 工具类
import { ENUM_LIGHT_HELPER } from "@/js/Enum";
import * as THREE from "three";
import * as dat from "dat.gui";

// 光源辅助器
/**
 *
 * @param {*} gui gui控制器
 * @param {ENUM_LIGHT_HELPER} lightType 光线类型
 * @param {light} light 光实体
 * @param {scene} scene 要添加辅助线的场景
 * @param {string} name gui光线名称
 */
const myLightHelpers = function (gui: dat.GUI, lightType = ENUM_LIGHT_HELPER.point, light: any, scene: THREE.Scene, name: string = "") {
  const sphereSize: number = 1;
  let lightHelper: any;
  switch (lightType) {
    case ENUM_LIGHT_HELPER.point:
      // 这里要封装方法，用于调节灯光位置
      lightHelper = new THREE.PointLightHelper(light, sphereSize);
      break;
    case ENUM_LIGHT_HELPER.spot:
      lightHelper = new THREE.SpotLightHelper(light);
      break;
    default:
      break;
  }
  gui.add(light.position, "x").min(-10).max(10).step(0.01).name(`${name}-x`);
  gui.add(light.position, "y").min(-10).max(10).step(0.01).name(`${name}-y`);
  gui.add(light.position, "z").min(-10).max(10).step(0.01).name(`${name}-z`);
  scene.add(lightHelper);
};

export { myLightHelpers };
