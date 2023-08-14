<template>
  <div class="dragMovePage">
    <div class="outsideBox" ref="outsideBox">
      <!--  -->
      <!-- @touchend="end()" -->
      <div
        class="internalBox"
        :style="{ transform: `translate(${internalBoxOffset.offsetLeft}px, ${internalBoxOffset.offsetTop}px)` }"
        ref="internalBox"
        @touchstart="down($event)"
        @touchmove.prevent.stop="move($event)"
        @touchend="end"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref, reactive } from "vue";
import * as THREE from "three";
interface InternalBoxOffset {
  offsetLeft: number;
  offsetTop: number;
}
interface ClientXY {
  clientX: number;
  clientY: number;
}
let isDrap: boolean = false;
let clientXY: ClientXY = {
  clientX: 0,
  clientY: 0,
};
let outsideBox: Ref<HTMLElement | null> = ref(null);
let internalBox: Ref<HTMLElement | null> = ref(null);
let internalBoxOffset: InternalBoxOffset = reactive({ offsetLeft: 0, offsetTop: 0 }); // 移动了多少距离
const down = (event: TouchEvent) => {
  isDrap = true;
  clientXY = {
    clientX: event.touches[0].clientX,
    clientY: event.touches[0].clientY,
  };
};
const getOffer = (newClient: number, oldClient: number, client: number): number => {
  let boundaryNum: number = newClient - oldClient > 0 ? client / 2 : -client / 2;
  return Math.abs(newClient - oldClient) > client / 2 ? boundaryNum : newClient - oldClient;
};
const move = (event: TouchEvent) => {
  if (!isDrap) return;
  let { clientWidth, clientHeight } = outsideBox.value as HTMLElement;
  let { clientX: newClientX, clientY: newClientY } = event.touches[0];
  let { clientX: oldClientX, clientY: oldClientY } = clientXY;
  internalBoxOffset.offsetLeft = getOffer(newClientX, oldClientX, clientWidth - 20);
  internalBoxOffset.offsetTop = getOffer(newClientY, oldClientY, clientHeight - 20);
  let vector2: THREE.Vector2 = new THREE.Vector2(internalBoxOffset.offsetLeft, internalBoxOffset.offsetTop);
  let angle = (180 / Math.PI) * vector2.angleTo(new THREE.Vector2(internalBoxOffset.offsetLeft > 0 ? 1 : -1, 0));
  getMouseEnterForAngle(angle);
};

const getMouseEnterForAngle = (angle: number) => {
  if (internalBoxOffset.offsetLeft > 0 && angle >= 0 && angle < 30) {
    console.log("keyD");
  } else if (internalBoxOffset.offsetLeft > 0 && internalBoxOffset.offsetTop < 0 && angle >= 30 && angle <= 60) {
    console.log("keyWD");
  } else if (internalBoxOffset.offsetTop < 0 && angle > 60 && angle <= 90) {
    console.log("keyW");
  } else if (internalBoxOffset.offsetTop < 0 && internalBoxOffset.offsetLeft < 0 && angle >= 30 && angle <= 60) {
    console.log("keyWA");
  } else if (internalBoxOffset.offsetLeft < 0 && angle >= 0 && angle < 30) {
    console.log("keyA");
  } else if (internalBoxOffset.offsetTop > 0 && internalBoxOffset.offsetLeft < 0 && angle >= 30 && angle <= 60) {
    console.log("keyAS");
  } else if (internalBoxOffset.offsetTop > 0 && angle > 60 && angle <= 90) {
    console.log("keyS");
  } else if (internalBoxOffset.offsetTop > 0 && internalBoxOffset.offsetLeft > 0 && angle >= 30 && angle <= 60) {
    console.log("keySD");
  }else {
    console.log("意外情况")
  }
};

// //鼠标释放时候的函数
const end = () => {
  isDrap = false;
  internalBoxOffset.offsetLeft = 0;
  internalBoxOffset.offsetTop = 0;
};
</script>
<style lang="less" scoped>
.dragMovePage {
  z-index: 2;
  position: fixed;
  left: 50%;
  bottom: 0;
  margin-bottom: 20px;
  transform: translateX(-50%);

  .outsideBox {
    display: flex;
    width: 50px;
    height: 50px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);

    .internalBox {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: red;
      cursor: pointer;
    }
  }
}
</style>
