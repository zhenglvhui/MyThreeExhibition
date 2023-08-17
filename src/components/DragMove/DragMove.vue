<template>
  <div class="dragMovePage">
    <div class="outsideBox" ref="outsideBox">
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
import { Ref, ref, reactive, defineEmits } from "vue";
import * as THREE from "three";
import { ENUM_MOUSE_KEY } from "@/ts/Enum";
const emit = defineEmits(["statusKeys"]);
interface InternalBoxOffset {
  offsetLeft: number;
  offsetTop: number;
}
interface ClientXY {
  clientX: number;
  clientY: number;
}

interface KeyObject {
  angle: [number, number];
  offsetLeft: 0 | 1 | -1;
  offsetTop: 0 | 1 | -1;
  key: ENUM_MOUSE_KEY[];
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
  let { clientWidth: internalBoxClientWidth, clientHeight: internalBoxClientHeight } = internalBox.value as HTMLElement;
  let { clientX: newClientX, clientY: newClientY } = event.touches[0];
  let { clientX: oldClientX, clientY: oldClientY } = clientXY;
  internalBoxOffset.offsetLeft = getOffer(newClientX, oldClientX, clientWidth - internalBoxClientWidth);
  internalBoxOffset.offsetTop = getOffer(newClientY, oldClientY, clientHeight - internalBoxClientHeight);
  let vector2: THREE.Vector2 = new THREE.Vector2(internalBoxOffset.offsetLeft, internalBoxOffset.offsetTop);
  let angle: number = (180 / Math.PI) * vector2.angleTo(new THREE.Vector2(internalBoxOffset.offsetLeft > 0 ? 1 : -1, 0));
  getMouseEnterForAngle(angle);
};

const getMouseEnterForAngle = (angle: number) => {
  let list: KeyObject[] = [
    {
      angle: [0, 30],
      offsetLeft: 1, // 0表示正负都行，1表示真值，-1表示负值
      offsetTop: 0,
      key: [ENUM_MOUSE_KEY.keyD],
    },
    {
      angle: [30, 60],
      offsetLeft: 1, // 0表示正负都行，1表示真值，-1表示负值
      offsetTop: -1,
      key: [ENUM_MOUSE_KEY.keyD, ENUM_MOUSE_KEY.keyW],
    },
    {
      angle: [60, 90],
      offsetLeft: 0, // 0表示正负都行，1表示真值，-1表示负值
      offsetTop: -1,
      key: [ENUM_MOUSE_KEY.keyW],
    },
    {
      angle: [30, 60],
      offsetLeft: -1, // 0表示正负都行，1表示真值，-1表示负值
      offsetTop: -1,
      key: [ENUM_MOUSE_KEY.keyW, ENUM_MOUSE_KEY.keyA],
    },
    {
      angle: [0, 30],
      offsetLeft: -1, // 0表示正负都行，1表示真值，-1表示负值
      offsetTop: 0,
      key: [ENUM_MOUSE_KEY.keyA],
    },
    {
      angle: [30, 60],
      offsetLeft: -1, // 0表示正负都行，1表示真值，-1表示负值
      offsetTop: 1,
      key: [ENUM_MOUSE_KEY.keyA, ENUM_MOUSE_KEY.keyS],
    },
    {
      angle: [60, 90],
      offsetLeft: 0, // 0表示正负都行，1表示真值，-1表示负值
      offsetTop: 1,
      key: [ENUM_MOUSE_KEY.keyS],
    },
    {
      angle: [30, 60],
      offsetLeft: 1, // 0表示正负都行，1表示真值，-1表示负值
      offsetTop: 1,
      key: [ENUM_MOUSE_KEY.keyS, ENUM_MOUSE_KEY.keyD],
    },
  ];

  function offsetBoolean(offsetType: number, offset: number): boolean {
    if (offsetType === 0) {
      return true;
    } else if (offsetType === 1) {
      return offset > 0;
    } else {
      return offset < 0;
    }
  }

  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let isAngle = angle >= item.angle[0] && angle <= item.angle[1];
    let offsetLeft = offsetBoolean(item.offsetLeft, internalBoxOffset.offsetLeft);
    let offsetTop = offsetBoolean(item.offsetTop, internalBoxOffset.offsetTop);
    if (isAngle && offsetLeft && offsetTop) {
      emit("statusKeys", item.key);
      return item.key;
    }
  }
  console.log("摇杆意外情况");
};

// //鼠标释放时候的函数
const end = () => {
  isDrap = false;
  internalBoxOffset.offsetLeft = 0;
  internalBoxOffset.offsetTop = 0;
  emit("statusKeys", []);
};
</script>
<style lang="less" scoped>
.dragMovePage {
  z-index: 3;
  position: fixed;
  left: 50%;
  bottom: 0;
  margin-bottom: 20px;
  transform: translateX(-50%);

  .outsideBox {
    display: flex;
    width: 80px;
    height: 80px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);

    .internalBox {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: rgba(0, 0, 255, 0.7);
      cursor: pointer;
    }
  }
}
</style>
