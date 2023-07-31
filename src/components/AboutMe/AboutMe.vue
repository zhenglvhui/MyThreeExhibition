<template>
  <div class="aboutMePage">
    <div class="download" @click="downloadPdf">
      <div class="icon"></div>
      <div class="text">下载</div>
    </div>
    <VuePdfEmbed :source="pdfurl" class="vue-pdf-embed" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { isWeixin } from "@/js/util";
import VuePdfEmbed from "vue-pdf-embed";
const pdfurl = ref("/pdf/郑律辉-前端工程师.pdf");

const downloadPdf = (): void => {
  // if (isWeixin()) return alert("微信浏览器暂不支持下载，请切换到其他浏览器");
  // const xhr: XMLHttpRequest = new XMLHttpRequest();
  // xhr.open("GET", pdfurl.value, true);
  // xhr.responseType = "blob";
  // xhr.onload = () => {
  //   if (xhr.status === 200) {
  //     const blob: Blob = new Blob([xhr.response], { type: "application/pdf" });
  //     const url: string = URL.createObjectURL(blob);
  const link: HTMLAnchorElement = document.createElement("a");
  link.href = "http://" + window.location.host + pdfurl.value;
  link.download = "郑律辉-前端工程师.pdf";
  link.click();
  // URL.revokeObjectURL(url);
  // }
  // };
  // xhr.send();
};
</script>
<style scoped lang="less">
.aboutMePage {
  width: 100vw;
  //   margin: 20px 0 -50px 0;
  overflow: hidden;
  box-sizing: border-box;
}
.vue-pdf-embed {
  width: 70vw;
  margin: 20px auto;
  height: 100vh;
  overflow: auto;
}

::-webkit-scrollbar {
  display: none;
}

.download {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  right: 15px;
  bottom: 15px;
  z-index: 1;

  .icon {
    width: 30px;
    height: 30px;
    background: url("../../assets/images/icon-downloan.png") no-repeat center center / 100% 100%;
    cursor: pointer;
  }

  .text {
    font-size: 14px;
    color: rgb(255, 144, 0);
  }
}
</style>
