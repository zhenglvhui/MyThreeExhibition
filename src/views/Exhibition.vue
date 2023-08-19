<template>
  <div class="Exhibition page">
    <Loading :progress="progress" :isShowLoadingIcon="isShowLoadingIcon" class="loadingPage" v-if="isLoading" @complete="complete" />
    <TootipsModel :title="tootipsModelTitle" :modelName="tootipsModelName" />
    <DragMove v-if="isMobile() " @statusKeys="changeStatusKey" />
    <!-- 按钮位置 -->
    <div class="icon">
      <div class="item">
        <div class="text">{{ currentView }}</div>
        <div class="change" @click="changeView()"></div>
      </div>
    </div>
    <!-- 二级弹出位置 -->
    <Transition name="scale">
      <MainSecondPage class="mainSecondPage" @close="hideSecondPage" :meshName="mainSecondPageMeshName" v-if="isShowMainSecondPage" />
    </Transition>

    <!-- @click="getCamera" -->
    <div ref="container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref, reactive } from "vue";
import * as THREE from "three";
import Loading from "@/components/Loading/Loading.vue";
import exhibitionGlbUrl from "@/assets/models/exhibition.glb";
import { isMobile } from "@/ts/util/util";
import { ENUM_MOUSE_KEY, ENUM_VIEW_TYPE } from "@/ts/Enum";
import MainSecondPage from "@/components/MainSecondPage/MainSecondPage.vue";
import ExhibitionModel from "@/views/Exhibition/ExhibitionModel";
import TootipsModel from "@/components/TootipsModel/TootipsModel.vue";
import DragMove from "@/components/DragMove/DragMove.vue";
import { ON_SHOW_SECOND_PAGE, ON_CHANGE_VIEW, ON_SHOW_TOOTIPS, MODEL_NAME_LIST, ON_MODEL_PROGRESS } from "@/ts/Constants";
import { KeyStatus } from "@/ts/interface/commonInterface";
let currentView = ref(ENUM_VIEW_TYPE.internal); // 当前视图
let isShowMainSecondPage: Ref<boolean> = ref(false); // 是否打开二级弹出
let mainSecondPageMeshName: Ref<string | undefined> = ref(undefined);
let isShowLoadingIcon: Ref<boolean> = ref(false);
let container: Ref<HTMLElement | null> = ref(null);
let isLoading:Ref<boolean> = ref(true);
let exhibitionModel: ExhibitionModel = new ExhibitionModel({
  renderAlpha: 0,
  renderContainer: container,
  renderOutputColorSpace: THREE.SRGBColorSpace,
  cameraFov: isMobile() ? 80 : 60,
  cameraNear: 10,
  cameraFar: 100000,
  cameraPosition: new THREE.Vector3(-556, 563, 227),
  blgUrl: exhibitionGlbUrl,
});
let tootipsModelTitle: Ref<string> = ref("");
let tootipsModelName: Ref<string> = ref("");
let progress: Ref<number> = ref(0);

let changeView = () => {
  exhibitionModel.changeView();
};

let changeStatusKey = (keys: ENUM_MOUSE_KEY[]) => {
  let KeyControl = exhibitionModel.getKeyControl();
  let keyStatus = KeyControl.getKeyStatus();
  let newStatus: KeyStatus = {
    [ENUM_MOUSE_KEY.keyW]: false,
    [ENUM_MOUSE_KEY.keyS]: false,
    [ENUM_MOUSE_KEY.keyA]: false,
    [ENUM_MOUSE_KEY.keyD]: false,
    [ENUM_MOUSE_KEY.keyV]: false,
    [ENUM_MOUSE_KEY.space]: false,
  };
  for (let index = 0; index < Object.keys(keyStatus).length; index++) {
    let key: ENUM_MOUSE_KEY = Object.keys(keyStatus)[index] as ENUM_MOUSE_KEY;
    newStatus[key] = keys.includes(key);
  }
  KeyControl.setKeyStatus(newStatus);
};

//隐藏页面
let hideSecondPage = () => {
  isShowMainSecondPage.value = false;
  exhibitionModel.getMoveMesh().canMoveEnbled = true;
};

// 点击视图,打开二级页面
type ShowSecondPage = [isShow: boolean, meshName: string];
exhibitionModel.$on(ON_SHOW_SECOND_PAGE, ([isShow, meshName]: ShowSecondPage) => {
  isShowMainSecondPage.value = isShow;
  mainSecondPageMeshName.value = meshName;
});

// 右下角切换视图
type ChangeViewParams = [_currentView: ENUM_VIEW_TYPE];
exhibitionModel.$on(ON_CHANGE_VIEW, ([_currentView]: ChangeViewParams) => {
  currentView.value = _currentView;
});

// 加载进度条
// type ProgessParams = [nowProgress: number];
// exhibitionModel.$on(ON_MODEL_PROGRESS, ([nowProgress]: ProgessParams) => {
//   progress.value = nowProgress;
// });

// 展示说明文案
type ShowTootipsParams = [meshName: string];
exhibitionModel.$on(ON_SHOW_TOOTIPS, ([meshName]: ShowTootipsParams) => {
  tootipsModelTitle.value = MODEL_NAME_LIST[meshName] || (isMobile() ? "移动端下方摇杆可以控制移动" : "PC端键盘WSAD可以控制移动");
  tootipsModelName.value = meshName;
});

let complete = () => {
  exhibitionModel.init(() => {
    isLoading.value = false;
  },(xhr) => {
    let nowProgress: number = Math.floor((xhr.loaded / xhr.total) * 100);
    progress.value = nowProgress;
    isShowLoadingIcon.value = nowProgress === 100;
  });
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
