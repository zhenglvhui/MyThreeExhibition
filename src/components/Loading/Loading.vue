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
      <div class="tips">{{ tips }}</div>
    </div>
    <div class="loading" ref="container"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineProps, defineEmits, Ref, onBeforeUnmount } from "vue";
import * as THREE from "three";
import LoadingBlgUrl from "@/assets/models/loading.glb";
import { isMobile } from "@/ts/util/util";
import LoadingModel from "./LoadingModel";
const emit = defineEmits(["complete"]);
const props = withDefaults(
  defineProps<{
    progress: number;
  }>(),
  { progress: 0 }
);
let container: Ref<HTMLElement | null> = ref(null);
let loadingModel = new LoadingModel({
  renderContainer: container,
  cameraFov: isMobile() ? 100 : 75,
  cameraNear: 0.1,
  cameraFar: 1000,
  cameraPosition: new THREE.Vector3(0.03, 1.2, 7),
  blgUrl: LoadingBlgUrl,
});

let tipsList: string[] = [
  "PC端键盘WSAD可以控制移动",
  "场景左下角可以切换不同视图",
  "移动端下方按钮可以控制移动",
  "点击场景中的模型可以打开模型详情",
  "场景中的白色点位可以移动到对应模型前",
];
let index: number = 0;
let tips: Ref<string> = ref(tipsList[index]);
let setInterId: number;

onMounted(() => {
  setTimeout(() => {
    loadingModel.init(() => {
      emit("complete");
      setInterId = setInterval(() => {
        index++;
        tips.value = tipsList[index % 4];
      }, 4000);
    });
  }, 350);
});

onBeforeUnmount(() => {
  try {
    loadingModel.destroyModel({ modelScene: loadingModel.getModelScene() });
    clearInterval(setInterId);
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .text {
    font-size: 30px;
    font-weight: 600;
    color: #fff;
    text-align: center;
  }

  .progessBox {
    width: 30vh;
    height: 5vh;
    margin-top: 10px;
    border-radius: 20px;
    border: 4px solid #fff;
    overflow: hidden;

    .progess {
      width: 100%;
      height: 100%;
      background: rgb(15, 25, 190);
    }
  }

  .tips {
    font-size: 25px;
    margin-top: 10px;
    color: #00ff00;
    text-align: center;
    font-weight: 600;
  }
}

@media screen and (max-width: 750px) {
  .progessDiv {
    margin-top: 0.4rem;
    .text {
      font-size: 1.2rem;
    }

    .tips {
      font-size: 0.8rem;
    }
  }
}
</style>
