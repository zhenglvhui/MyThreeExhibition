<!--
 * @Date: 2022-04-24 11:39:04
 * @Description: 
-->
<template>
  <div class="Exhibition page">
    <TootipsModel :title="tootipsModelTitle" :modelName="tootipsModelName"  />
    <div class="loadingIcon" v-if="isShowLoadingIcon">
      <img src="@/assets/images/loading.png" alt="" />
    </div>
    <!-- 按钮位置 -->
    <div class="icon">
      <div class="item">
        <div class="text">{{ currentView }}</div>
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

    <Loading :progress="progress" class="loadingPage"  v-if="progress != 100" @complete="complete" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref, reactive } from "vue";
import * as THREE from "three";
import Loading from "@/components/Loading/Loading.vue";
import exhibitionGlbUrl from "@/assets/models/exhibition.glb";
import { isMobile } from "@/ts/util/util";
import { ENUM_VIEW_TYPE } from "@/ts/Enum";
import MainSecondPage from "@/components/MainSecondPage/MainSecondPage.vue";
import ExhibitionModel from "@/views/Exhibition/ExhibitionModel";
import TootipsModel from "@/components/TootipsModel/TootipsModel.vue";
import { ON_SHOW_SECOND_PAGE, ON_CHANGE_VIEW, ON_SHOW_TOOTIPS, MODEL_NAME_LIST } from "@/ts/Constants";
let currentView = ref(ENUM_VIEW_TYPE.internal); // 当前视图
let isShowMainSecondPage: Ref<boolean> = ref(false); // 是否打开二级弹出
let mainSecondPageMeshName: Ref<string | undefined> = ref(undefined);
let mainSecondPageisLoading: Ref<boolean> = ref(true); //  子页面是否需要loading
let isShowLoadingIcon = ref(true);
let container: Ref<HTMLElement | null> = ref(null);
let exhibitionModel = new ExhibitionModel({
  renderAlpha: 0,
  renderContainer: container,
  renderOutputColorSpace: THREE.SRGBColorSpace,
  cameraFov: isMobile() ? 80 : 60,
  cameraNear: 10,
  cameraFar: 100000,
  cameraPosition: new THREE.Vector3(0, 0, 0),
  blgUrl: exhibitionGlbUrl,
});
let tootipsModelTitle = ref("");
let tootipsModelName = ref("");
let progress = ref(0);

let changeView = () => {
  exhibitionModel.changeView();
};

//隐藏页面
let hideSecondPage = () => {
  isShowMainSecondPage.value = false;
  exhibitionModel.getMoveMesh().canMoveEnbled = true;
};

// 点击视图,打开二级页面
type changeViewParams = {
  isShowMainSecondPage: boolean;
  mainSecondPageMeshName: string;
  mainSecondPageisLoading: boolean;
};
exhibitionModel.$on(ON_SHOW_SECOND_PAGE, (paramsArr: changeViewParams[]) => {
  let params = paramsArr[0];
  isShowMainSecondPage.value = params.isShowMainSecondPage;
  mainSecondPageMeshName.value = params.mainSecondPageMeshName;
  mainSecondPageisLoading.value = params.mainSecondPageisLoading;
});

// 右下角切换视图
exhibitionModel.$on(ON_CHANGE_VIEW, (params: ENUM_VIEW_TYPE[]) => {
  currentView.value = params[0];
});

// 展示说明文案
exhibitionModel.$on(ON_SHOW_TOOTIPS, (params: string[]) => {
  tootipsModelTitle.value = MODEL_NAME_LIST[params[0]] || "PC端键盘WSAD可以控制移动";
  tootipsModelName.value = params[0];
});

let complete = () => {
  exhibitionModel.init(
    () => {
      isShowLoadingIcon.value = false;
    },
    (xhr) => {
      let nowProgress: number = Math.floor((xhr.loaded / xhr.total) * 100);
      progress.value = nowProgress;
    }
  );
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

.loadingIcon {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100px;
    height: 100px;
    animation: loading 1s linear infinite;
  }
  @keyframes loading {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
