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

onMounted(() => {
  setTimeout(() => {
    loadingModel.init(() => {
      emit("complete");
    });
  }, 350);
});

onBeforeUnmount(() => {
  try {
    loadingModel.destroyModel({  modelScene: loadingModel.getModelScene() });
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
